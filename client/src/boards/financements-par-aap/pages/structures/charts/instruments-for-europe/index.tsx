import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import "highcharts/modules/treemap";
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

export default function InstrumentsForEurope({ name }: { name: string | undefined }) {
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
          size: 10,
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
          size: 10,
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
              sum_budget: {
                sum: {
                  field: "project_budgetFinanced",
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
          size: 10,
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
  body.query.bool.filter.push({ terms: { "project_type.keyword": ["Horizon 2020", "Horizon Europe"] } });

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-instruments-for-europe", structure, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
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
      value: instrument?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget?.value ?? 0,
    });
    seriesBudget.push({
      color: getCssColor({ name: instrument.key, prefix: "instrument" }),
      name: [instrument.key, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget?.value ?? 0,
    });
  });
  instrumentsParticipation.forEach((instrument) => {
    seriesParticipation.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: instrument.key, prefix: "instrument" }) } },
      name: [instrument.key, getI18nLabel(i18n, 'coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget_participation?.value ?? 0,
    });
    seriesParticipation.push({
      color: getCssColor({ name: instrument.key, prefix: "instrument" }),
      name: [instrument.key, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget_participation?.value ?? 0,
    });
  });
  instrumentsProject.forEach((instrument) => {
    seriesProject.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: instrument.key, prefix: "instrument" }) } },
      name: [instrument.key, getI18nLabel(i18n, 'coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.unique_projects?.value ?? 0,
    });
    seriesProject.push({
      color: getCssColor({ name: instrument.key, prefix: "instrument" }),
      name: [instrument.key, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
      value: instrument?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.unique_projects?.value ?? 0,
    });
  });

  const config = {
    comment: { "fr": <>Ce graphe présente la distribution des projets auxquels participe l'établissement, par financeur et selon les grandes classifications disciplinaires.
Les barres représentent le nombre / le montant total des projets rattachés à chaque domaine, permettant d’identifier les champs scientifiques les plus présents dans les projets auxquels l’établissement participe. Les montants affichés ne correspondent pas aux financements réellement perçus par l’établissement, mais au volume global des projets financés dans lesquels il est impliqué. Ils doivent être interprétés comme un indicateur d’activité disciplinaire, et non comme un budget reçu. Les thématiques ont été estimées par IA, à partir du titre, résumé et mots clés des projets.</> },
    id: "instrumentsForEurope",
  };

  // If view by number of projects
  let series = seriesProject.reverse();
  let tooltip = function (this: any) {
    return `<b>${this.value}</b> projets <b>${this.key}</b> auxquels participe <b>${name}</b> au moyen de l'instrument <b>${this.name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      series = seriesBudget.reverse();
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.value)} €</b> financés pour les projets <b>${this.key}</b> auxquels participe <b>${name}</b> au moyen de l'instrument <b>${this.name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      series = seriesParticipation.reverse();
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.value)} €</b> perçus pour les projets <b>${this.key}</b> auxquels participe <b>${name}</b> au moyen de l'instrument <b>${this.name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
      };
      break;
  };

  const options: HighchartsInstance.Options = {
    chart: { type: "treemap" },
    legend: { enabled: true },
    plotOptions: {
      treemap: {
        dataLabels: {
          style: {
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
    <div className={`chart-container chart-container--${color}`} id="instruments-for-europe">
      <Title as="h2" look="h6">
        {`Instruments pour l'Europe de ${name} ${getYearRangeLabel({ yearMax, yearMin })}`}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
};
