import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import { deepMerge, formatCompactNumber, funders, getCssColor, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function InstrumentsByFunder({ name }: { name: string | undefined }) {
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
          size: 25,
        },
        aggregations: {
          by_project_type: {
            terms: {
              field: "project_type.keyword",
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
          size: 25,
        },
        aggregations: {
          sum_budget: {
            sum: {
              field: "project_budgetTotal",
            },
          },
          by_project_type: {
            terms: {
              field: "project_type.keyword",
            },
            aggregations: {
              sum_budget: {
                sum: {
                  field: "project_budgetTotal",
                },
              },
            },
          },
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-instruments-by-funder", structure, yearMax, yearMin],
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

  const instrumentsProject = data?.aggregations?.by_instrument_project?.buckets ?? [];
  console
  console.log(instrumentsProject.map((instrument) => instrument.key.split('-')?.[0].split(' ')?.[0].trim().toLowerCase()));
  const seriesProject = instrumentsProject.map((instrument) => ({
    color: getCssColor({ name: instrument.key.split('-')?.[0].split(' ')?.[0].trim().toLowerCase(), prefix: "instrument" }),
    data: funders.map((funder) => instrument?.by_project_type?.buckets?.find((bucket) => bucket.key === funder)?.unique_projects?.value ?? 0),
    name: instrument.key,
  })).reverse();
  const instrumentsBudget = data?.aggregations?.by_instrument_budget?.buckets ?? [];
  const seriesBudget = instrumentsBudget.map((instrument) => ({
    color: getCssColor({ name: instrument.key, prefix: "instrument" }),
    data: funders.map((funder) => instrument?.by_project_type?.buckets?.find((bucket) => bucket.key === funder)?.sum_budget?.value ?? 0),
    name: instrument.key,
  })).reverse();

  const config = {
    comment: { "fr": <>Ce graphe présente la distribution des projets auxquels participe l'établissement, par financeur et selon les grandes classifications disciplinaires.
Les barres représentent le nombre / le montant total des projets rattachés à chaque domaine, permettant d’identifier les champs scientifiques les plus présents dans les projets auxquels l’établissement participe. Les montants affichés ne correspondent pas aux financements réellement perçus par l’établissement, mais au volume global des projets financés dans lesquels il est impliqué. Ils doivent être interprétés comme un indicateur d’activité disciplinaire, et non comme un budget reçu. Les thématiques ont été estimées par IA, à partir du titre, résumé et mots clés des projets.</> },
    id: "instrumentsByFunder",
  };

  // If view by number of projects
  let axis = 'Nombre de projets financés';
  let dataLabel = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''}`;
  };
  let series = seriesProject;
  let stackLabel = function (this: any) {
    return `${this.total} projet${this.total > 1 ? 's' : ''}`;
  };
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.key}</b> auxquels participe <b>${name}</b> au moyen de l'instrument <b>${this.series.name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = 'Montants globaux financés (€)';
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €`;
      };
      series = seriesBudget;
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> financés pour les projets <b>${this.key}</b> auxquels participe <b>${name}</b> au moyen de l'instrument <b>${this.series.name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = 'Montants financés pour cet établissement (€)';
      break;
  }

  const localOptions = {
    legend: { enabled: true, reversed: true },
    yAxis: {
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold'
        },
        formatter: stackLabel,
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: dataLabel,
        },
        stacking: "normal",
      }
    },
    series: series,
    tooltip: { formatter: tooltip },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", funders, "", axis), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="instruments-by-funder">
      <Title as="h2" look="h6">
        {`Instruments par financeur de ${name} ${getYearRangeLabel({ yearMax, yearMin })}`}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
};
