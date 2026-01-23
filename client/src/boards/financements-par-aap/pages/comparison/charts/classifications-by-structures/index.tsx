import { SegmentedControl, SegmentedElement, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { deepMerge, formatCompactNumber, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";
import { FundingsSources } from "../../../graph-config.js";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function ClassificationsByStructures() {
  const [field, setField] = useState("projects");
  const [searchParams] = useSearchParams();
  const structures = searchParams.getAll("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures, yearMax, yearMin }),
    aggregations: {
      by_classifications_project: {
        terms: {
          field: "project_classification.primary_field.keyword",
          size: 25,
        },
        aggregations: {
          by_structure: {
            terms: {
              field: "participant_id_name_default.keyword",
              size: structures.length,
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
      by_classifications_budget: {
        terms: {
          field: "project_classification.primary_field.keyword",
          order: { "sum_budget": "desc" },
          size: 25,
        },
        aggregations: {
          sum_budget: {
            sum: {
              field: "project_budgetTotal",
            },
          },
          by_structure: {
            terms: {
              field: "participant_id_name_default.keyword",
              size: structures.length,
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
      by_structure: {
        terms: {
          field: "participant_id_name_default.keyword",
          size: structures.length,
        },
      }
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-classifications-by-structures', structures, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  const categoriesStructures = (data?.aggregations?.by_structure?.buckets ?? []).map((structure) => ({
    id: structure.key.split("###")[0],
    name: structure.key.split("###")[1],
  }));
  const classificationsProject = data?.aggregations?.by_classifications_project?.buckets ?? [];
  const categoriesProject: string[] = [];
  const seriesProject = classificationsProject.map((classification) => ({
    data: classification?.by_structure?.buckets?.map((bucket) => {
      categoriesProject.push(categoriesStructures.find((structure) => structure.id === bucket.key.split("###")[0])?.name ?? "Structure inconnue");
      return bucket?.unique_projects?.value ?? 0;
    }),
    name: classification.key,
  })).reverse();
  const classificationsBudget = data?.aggregations?.by_classifications_budget?.buckets ?? [];
  const categoriesBudget: string[] = [];
  const seriesBudget = classificationsBudget.map((classification) => ({
    data: classification?.by_structure?.buckets?.map((bucket) => {
      categoriesBudget.push(categoriesStructures.find((structure) => structure.id === bucket.key.split("###")[0])?.name ?? "Structure inconnue");
      return bucket?.sum_budget?.value ?? 0;
    }),
    name: classification.key,
  })).reverse();

  const titleProjects = `Profils disciplinaires des établissements via les projets financés ${getYearRangeLabel({ yearMax, yearMin })}`;
  const titleBudget = `Profils disciplinaires des établissements via le montant des projets financés ${getYearRangeLabel({ yearMax, yearMin })}`;
  const axisProjects = "Nombre de projets financés";
  const axisBudget = "Montants financés (€)";
  const tooltipProjects = function (this: any) {
    return `<b>${this.y}</b> projets ont débuté ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} grâce aux financements de <b>${this.series.name}</b> auxquels prend part <b>${categoriesProject[this.x]}</b>`;
  };
  const tooltipBudget = function (this: any) {
    return `<b>${formatCompactNumber(this.y)} €</b> ont été financés par <b>${this.series.name}</b> pour des projets débutés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} auxquels prend part <b>${categoriesBudget[this.x]}</b>`;
  };
  const datalabelProject = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''}`;
  };
  const datalabelBudget = function (this: any) {
    return `${formatCompactNumber(this.y)} €`;
  };
  const stacklabelProject = function (this: any) {
    return `${this.total} projet${this.total > 1 ? 's' : ''}`;
  };
  const stacklabelBudget = function (this: any) {
    return `${formatCompactNumber(this.total)} €`;
  };

  const config = {
    comment: { "fr": <>Ce graphe présente, pour chaque établissement, la répartition des projets financés par AAP selon les grandes classifications disciplinaires.
Chaque barre correspond à un établissement et est ventilée par discipline, permettant d’observer la structure scientifique de sa participation aux projets financés.
L’analyse doit se concentrer sur la composition relative des barres, afin de comparer les profils disciplinaires indépendamment de la taille des établissements.
Les montants indiqués correspondent au financement global des projets auxquels les établissements participent et ne reflètent pas les sommes effectivement perçues.
</> },
    id: "classificationsByStructures",
    sources: FundingsSources,
  };
  const localOptions = {
    legend: { enabled: true, reversed: true },
    yAxis: {
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold'
        },
        formatter: field === "projects" ? stacklabelProject : stacklabelBudget,
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: field === "projects" ? datalabelProject : datalabelBudget,
        },
        stacking: "normal",
      }
    },
    series: field === "projects" ? seriesProject : seriesBudget,
    tooltip: { formatter: field === "projects" ? tooltipProjects : tooltipBudget },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", field === "projects" ? categoriesProject : categoriesBudget, "", field === "projects" ? axisProjects : axisBudget), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="classifications-by-structures">
      <Title as="h2" look="h6">
        {field === "projects" ? titleProjects : titleBudget}
      </Title>
      <SegmentedControl name="classifications-by-structures-segmented">
        <SegmentedElement checked={field === "projects"} label="Nombre de projets financés" onClick={() => setField("projects")} value="projects" />
        <SegmentedElement checked={field === "budget"} label="Montants financés" onClick={() => setField("budget")} value="budget" />
      </SegmentedControl>
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
}
