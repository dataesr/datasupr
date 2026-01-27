import { SegmentedControl, SegmentedElement, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings/index.tsx";
import { deepMerge, formatCompactNumber, funders, getCssColor, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function ProjectsByStructures() {
  const [field, setField] = useState("projects");
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
    queryKey: ["fundings-projects-by-structures", structures, yearMax, yearMin],
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

  const structuresProject = data?.aggregations?.by_structure_project?.buckets ?? [];
  const seriesProject = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: structuresProject.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.unique_projects?.value ?? 0),
    name: funder,
  })).reverse();
  const categoriesProject = structuresProject.map((item) => item.key.split('###')[1]);
  const structuresBudget = data?.aggregations?.by_structure_budget?.buckets ?? [];
  const seriesBudget = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: structuresBudget.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.sum_budget?.value ?? 0),
    name: funder,
  })).reverse();
  const categoriesBudget = structuresBudget.map((item) => item.key.split('###')[1]);

  const titleProjects = `Répartition des projets financés par type de financeur – comparaison entre établissements ${getYearRangeLabel({ yearMax, yearMin })}`;
  const titleBudget = `Montant total des projets par financeur – comparaison entre établissements ${getYearRangeLabel({ yearMax, yearMin })}`;
  const axisProjects = "Nombre de projets financés";
  const axisBudget = "Montants financés (€)";
  const tooltipProjects = function (this: any) {
    return `<b>${this.y}</b> projets ont débuté ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} grâce aux financements de <b>${this.series.name}</b> auxquels prend part <b>${categoriesProject[this.x]}</b>`;
  };
  const tooltipBudget = function (this: any) {
    return `<b>${formatCompactNumber(this.y)} €</b> ont été financés par <b>${this.series.name}</b> pour des projets débutés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} auxquels prend part <b>${categoriesProject[this.x]}</b>`;
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
    comment: { "fr": <>Ce graphique compare la répartition des projets financés par AAP selon les financeurs pour plusieurs établissements.
L’analyse doit porter en priorité sur les proportions relatives entre catégories de financeurs, plutôt que sur les volumes absolus, afin de comparer la structure des portefeuilles de projets entre établissements de tailles différentes. Les montants indiqués correspondent au financement global des projets auxquels les établissements participent et ne reflètent pas les sommes effectivement perçues.
</> },
    id: "projectsByStructures",
  };
  const localOptions = {
    legend: { enabled: true, reversed: true },
    yAxis: {
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
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
    <div className={`chart-container chart-container--${color}`} id="projects-by-structures">
      <Title as="h2" look="h6">
        {field === "projects" ? titleProjects : titleBudget}
      </Title>
      <SegmentedControl name="projects-by-structures-segmented">
        <SegmentedElement checked={field === "projects"} label="Nombre de projets financés" onClick={() => setField("projects")} value="projects" />
        <SegmentedElement checked={field === "budget"} label="Montants financés" onClick={() => setField("budget")} value="budget" />
      </SegmentedControl>
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
}
