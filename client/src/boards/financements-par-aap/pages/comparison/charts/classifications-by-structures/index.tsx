import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import { deepMerge, formatCompactNumber, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function ClassificationsByStructures() {
  const [selectedControl, setSelectedControl] = useState("projects");
  const [searchParams] = useSearchParams();
  const structures = searchParams.getAll("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures, yearMax, yearMin }),
    aggregations: {
      by_structure_project: {
        terms: {
          field: "participant_id_name_default.keyword",
          size: structures.length,

        },
        aggregations: {
          by_classifications: {
            terms: {
              field: "project_classification.primary_field.keyword",
              size: 25,
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
      by_structure_budget: {
        terms: {
          field: "participant_id_name_default.keyword",
          order: { "sum_budget": "desc" },
          size: structures.length,
        },
        aggregations: {
          sum_budget: {
            sum: {
              field: "project_budgetTotal",
            },
          },
          by_classifications: {
            terms: {
              field: "project_classification.primary_field.keyword",
              size: 25,
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
    queryKey: ["fundings-classifications-by-structures", structures, yearMax, yearMin],
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

  const structuresProject = data?.aggregations?.by_structure_project?.buckets ?? [];
  const categoriesProject = structuresProject.map((bucket) => bucket.key.split("###")[1]);
  const seriesProject = (structuresProject?.[0]?.by_classifications?.buckets ?? []).map((bucket) => ({
    data: structuresProject.map((sss) => sss.by_classifications.buckets.find((classification) => classification.key === bucket.key)?.unique_projects?.value ?? 0),
    name: bucket.key,
  })).reverse();
  const structuresBudget = data?.aggregations?.by_structure_budget?.buckets ?? [];
  const categoriesBudget = structuresBudget.map((bucket) => bucket.key.split("###")[1]);
  const seriesBudget = (structuresBudget?.[0]?.by_classifications?.buckets ?? []).map((bucket) => ({
    data: structuresBudget.map((sss) => sss.by_classifications.buckets.find((classification) => classification.key === bucket.key)?.sum_budget?.value ?? 0),
    name: bucket.key,
  })).reverse();

  // If view by number of projects
  let axis = 'Nombre de projets financés';
  let categories = categoriesProject;
  let dataLabel = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''}`;
  };
  let series = seriesProject;
  let stackLabel = function (this: any) {
    return `${this.total} projet${this.total > 1 ? 's' : ''}`;
  };
  let title = `Profils disciplinaires des établissements via les projets financés ${getYearRangeLabel({ yearMax, yearMin })}`;
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> projets ont débuté ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} grâce aux financements de <b>${this.series.name}</b> auxquels prend part <b>${categoriesProject[this.x]}</b>`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = 'Montants globaux financés (€)';
      categories = categoriesBudget;
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €`;
      };
      series = seriesBudget;
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      title = `Profils disciplinaires des établissements via le montant des projets financés ${getYearRangeLabel({ yearMax, yearMin })}`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été financés par <b>${this.series.name}</b> pour des projets débutés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} auxquels prend part <b>${categoriesBudget[this.x]}</b>`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = 'Montants financés pour cet établissement (€)';
      break;
  }

  const config = {
    comment: {
      "fr": <>Ce graphe présente, pour chaque établissement, la répartition des projets financés par AAP selon les grandes classifications disciplinaires.
        Chaque barre correspond à un établissement et est ventilée par discipline, permettant d’observer la structure scientifique de sa participation aux projets financés.
        L’analyse doit se concentrer sur la composition relative des barres, afin de comparer les profils disciplinaires indépendamment de la taille des établissements.
        Les montants indiqués correspondent au financement global des projets auxquels les établissements participent et ne reflètent pas les sommes effectivement perçues.
      </>
    },
    id: "classificationsByStructures",
  };
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
    series,
    tooltip: { formatter: tooltip },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", categories, "", axis), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="classifications-by-structures">
      <Title as="h2" look="h6">
        {title}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
}
