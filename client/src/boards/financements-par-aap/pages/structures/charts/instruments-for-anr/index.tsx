import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import type HighchartsInstance from "highcharts/es-modules/masters/highcharts.src.js";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getI18nLabel } from "../../../../../../utils";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import i18n from "../../../../i18n.json";
import { formatCompactNumber, getCssColor, getEsQuery, getYearRangeLabel, pattern } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function InstrumentsForAnr({ name }: { name: string | undefined }) {
  const [selectedControl, setSelectedControl] = useState("projects");
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
    aggregations: {
      by_instrument_project: {
        terms: {
          field: "project_instrument.keyword",
        },
        aggregations: {
          is_coordinator: {
            terms: {
              field: "participation_is_coordinator",
            },
            aggregations: {
              unique_projects: {
                cardinality: {
                  field: "project_id.keyword",
                },
              },
            },
          },
        },
      },
      by_instrument_budget: {
        terms: {
          field: "project_instrument.keyword",
          order: { "sum_budget": "desc" },
        },
        aggregations: {
          sum_budget: {
            sum: {
              field: "project_budgetFinanced",
            },
          },
          is_coordinator: {
            terms: {
              field: "participation_is_coordinator",
            },
            aggregations: {
              should_ignore: {
                terms: {
                  field: "participant_ignore_total_budget",
                },
                aggregations: {
                  sum_budget: {
                    sum: {
                      field: "project_budgetFinanced",
                    },
                  },
                },
              },
            },
          },
        },
      },
      by_instrument_participation: {
        terms: {
          field: "project_instrument.keyword",
          order: { "sum_budget_participation": "desc" },
        },
        aggregations: {
          sum_budget_participation: {
            sum: {
              field: "participation_funding",
            },
          },
          is_coordinator: {
            terms: {
              field: "participation_is_coordinator",
            },
            aggregations: {
              sum_budget_participation: {
                sum: {
                  field: "participation_funding",
                },
              },
            },
          },
        },
      },
    },
  };
  body.query.bool.filter.push({ terms: { "project_type.keyword": ["ANR", "PIA ANR", "PIA hors ANR"] } });

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-instruments-for-anr", structure, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  const seriesBudget: any = [];
  const seriesParticipation: any = [];
  const seriesProject: any = [];
  const instrumentsBudget = data?.aggregations?.by_instrument_budget?.buckets ?? [];
  const instrumentsParticipation = data?.aggregations?.by_instrument_participation?.buckets ?? [];
  const instrumentsProject = data?.aggregations?.by_instrument_project?.buckets ?? [];
  instrumentsBudget.forEach((instrument) => {
    seriesBudget.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: instrument.key, prefix: "instrument" }) } },
      name: [instrument.key, getI18nLabel(i18n, 'coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets
        ?.find((bucket) => bucket.key === 1)?.should_ignore?.buckets
        ?.find((bucket) => bucket.key === 0)?.sum_budget?.value ?? 0,
    });
    seriesBudget.push({
      color: getCssColor({ name: instrument.key, prefix: "instrument" }),
      name: [instrument.key, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets
        ?.find((bucket) => bucket.key === 0)?.should_ignore?.buckets
        ?.find((bucket) => bucket.key === 0)?.sum_budget?.value ?? 0,
    });
  });
  instrumentsParticipation.forEach((instrument) => {
    seriesParticipation.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: instrument.key, prefix: "instrument" }) } },
      name: [instrument.key, getI18nLabel(i18n, 'coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets
        ?.find((bucket) => bucket.key === 1)?.sum_budget_participation?.value ?? 0,
    });
    seriesParticipation.push({
      color: getCssColor({ name: instrument.key, prefix: "instrument" }),
      name: [instrument.key, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets
        ?.find((bucket) => bucket.key === 0)?.sum_budget_participation?.value ?? 0,
    });
  });
  instrumentsProject.forEach((instrument) => {
    seriesProject.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: instrument.key, prefix: "instrument" }) } },
      name: [instrument.key, getI18nLabel(i18n, 'coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets
        ?.find((bucket) => bucket.key === 1)?.unique_projects?.value ?? 0,
    });
    seriesProject.push({
      color: getCssColor({ name: instrument.key, prefix: "instrument" }),
      name: [instrument.key, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets
        ?.find((bucket) => bucket.key === 0)?.unique_projects?.value ?? 0,
    });
  });

  const title = `Instruments ANR pour les projets auxquels participe ${name} ${getYearRangeLabel({ yearMax, yearMin })}`;
  // If view by number of projects
  let series = seriesProject.reverse();
  let tooltip = function (this: any) {
    return `<b>${this.value}</b> projets ANR auxquels participe <b>${name}</b> au moyen de l'instrument <b>${this.name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      series = seriesBudget.reverse();
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.value)} €</b> financés au global pour les projets ANR auxquels participe <b>${name}</b> au moyen de l'instrument <b>${this.name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      series = seriesParticipation.reverse();
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.value)} €</b> perçus par <b>${name}</b> pour les projets ANR au moyen de l'instrument <b>${this.name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
      };
      break;
  };

  const config = {
    comment: {
      "fr": <>Ce graphe présente la distribution des projets auxquels participe l'établissement, par type d'instrument, pour les projets ANR.
        Le type de participation est distingué, en pointillé quand l'établissement est coordinateur, en couleur simple s'il est partenaire non-coordinateur. Le financement global représente le volume total de financements des projets auxquels participe l'établissement. Le financement perçu approxime la part réelle allouée à chaque établissement partenaire d’un projet (en assimilant consommation et subvention pour le PIA).
      </>
    },
    id: "instrumentsForAnr",
    integrationURL: `/integration?chart_id=instrumentsForAnr&${searchParams.toString()}`,
    title,
  };

  const options: HighchartsInstance.Options = {
    chart: { type: "treemap" },
    legend: { enabled: true },
    plotOptions: {
      treemap: {
        dataLabels: {
          style: {
            color: "black",
            fontWeight: "bold",
            fontSize: "14px",
            textOutline: "1px contrast",
          },
        },
      },
    },
    series: [{ data: series, layoutAlgorithm: "squarified", type: "treemap" }],
    title: { text: "" },
    tooltip: { formatter: tooltip },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="instruments-for-anr">
      <Title as="h2" look="h6">
        {title}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapperFundings config={config} hideTitle options={options} />}
    </div>
  );
};
