import { SegmentedControl, SegmentedElement, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { deepMerge, funders, formatCompactNumber, getColorByFunder, getEsQuery, getGeneralOptions, years } from "../../../../utils.ts";
import { FundingsSources } from "../../../graph-config.js";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function ProjectsOverTimeByStructure({ name }: { name: string | undefined }) {
  const [field, setField] = useState("projects");
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure] }),
    aggregations: {
      by_project_type: {
        terms: {
          field: "project_type.keyword",
          size: 50,
        },
        aggregations: {
          by_project_year: {
            terms: {
              field: "project_year",
            },
            aggregations: {
              unique_projects: {
                cardinality: {
                  field: "project_id.keyword",
                },
              },
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
    queryKey: ['funding-projects-over-time-by-structure', structure],
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

  const series = funders.map((funder) => ({
    color: getColorByFunder(funder),
    data: years.map((year) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder)?.by_project_year?.buckets.find((item) => item.key === year)?.[field === "projects" ? "unique_projects" : "sum_budget"]?.value ?? 0),
    marker: { enabled: false },
    name: funder
  })).reverse();

  const titleProjects = `Evolution temporelle du nombre de projets auxquels participe l'établissement (${name})`;
  const titleBudget = `Evolution temporelle du montant financé pour les projets auxquels participe l'établissement (${name})`;
  const axisProjects = "Nombre de projets financés";
  const axisBudget = "Montants financés (€)";
  const tooltipProjects = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.series.name}</b> en <b>${this.x}</b> auxquels prend part <b>${name}</b>`;
  };
  const tooltipBudget = function (this: any) {
    return `<b>${formatCompactNumber(this.y)} €</b> ont été financés en <b>${this.x}</b> pour les projets <b>${this.series.name}</b> auxquels participe <b>${name}</b>`;
  };
  const config = {
    comment: { "fr": <>Ce graphique présente l’évolution temporelle du nombre de projets ou de leurs montants associés, ventilée par financeur, à travers des lignes empilées permettant d’apprécier la contribution relative de chacun dans le temps. Pour les financements europées, Horizon 2020 couvre la période 2014–2020, tandis que son successeur, Horizon Europe couvre 2021-2027. Les montants indiqués reflètent le financement global des projets auxquels l’établissement participe et ne correspondent pas aux sommes effectivement perçues par celui-ci.</> },
    id: "projectsOverTimeByStructure",
    sources: FundingsSources,
  };

  const localOptions = {
    legend: { enabled: true, reversed: true },
    plotOptions: {
      series: { pointStart: Number(years[0]) },
      area: {
        stacking: "normal",
        marker: {
          enabled: false,
          lineColor: "#666666",
          lineWidth: 1,
          symbol: "circle"
        }
      }
    },
    series,
    tooltip: { formatter: field === "projects" ? tooltipProjects : tooltipBudget },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", [], "Année de début du projet", field === "projects" ? axisProjects : axisBudget, "area"), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-over-time-by-structure">
      <Title as="h2" look="h6">
        {field === "projects" ? titleProjects : titleBudget}
      </Title>
      <SegmentedControl name="projects-over-time-by-structure-segmented">
        <SegmentedElement checked={field === "projects"} label="Nombre de projets financés" onClick={() => setField("projects")} value="projects" />
        <SegmentedElement checked={field === "budget"} label="Montants financés" onClick={() => setField("budget")} value="budget" />
      </SegmentedControl>
      {isLoading ? <DefaultSkeleton height={ String(options?.chart?.height) } /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
}
