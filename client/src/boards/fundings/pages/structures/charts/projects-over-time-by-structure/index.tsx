import { SegmentedControl, SegmentedElement, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, getColorFromFunder, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";
import { FundingsSources } from "../../../graph-config.js";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function ProjectsOverTimeByStructure({ name }: { name: string | undefined }) {
  const [field, setField] = useState("projects");
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
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
            aggs: {
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
    queryKey: ['funding-projects-over-time-by-structure', structure, yearMax, yearMin],
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


  const years: number[] = Array.from(Array(Number(yearMax) - Number(yearMin) + 1).keys()).map((item) => item + Number(yearMin));
  const series = (data?.aggregations?.by_project_type?.buckets ?? []).map((bucket) => ({
    color: getColorFromFunder(bucket.key),
    data: years.map((year) => bucket.by_project_year.buckets.find((item) => item.key === year)?.[field === "projects" ? "unique_projects" : "sum_budget"]?.value ?? 0),
    marker: { enabled: false },
    name: bucket.key
  }));

  const titleProjects = `Nombre de projets de ${name} par financeur ${getYearRangeLabel({ yearMax, yearMin })}, par année de début du projet`;
  const titleBudget = `Montant total des projets de ${name} par financeur ${getYearRangeLabel({ yearMax, yearMin })}, par année de début du projet`;
  const axisProjects = "Nombre de projets financés";
  const axisBudget = "Montants financés (€)";
  const tooltipProjects = function (this: any) {
    return `<b>${this.y}</b> projets ont débuté en <b>${this.x}</b> grâce aux financements de <b>${this.series.name}</b> auxquels prend part <b>${name}</b>`;
  };
  const tooltipBudget = function (this: any) {
    return `<b>${formatCompactNumber(this.y)} €</b> ont été financés par <b>${this.series.name}</b> pour des projets débutés en <b>${this.x}</b> auxquels prend part <b>${name}</b>`;
  };
  const config = {
    id: "projectsOverTimeByStructure",
    sources: FundingsSources,
  };

  const options: object = {
    ...getGeneralOptions("", [], "Année de début du projet", field === "projects" ? axisProjects : axisBudget, "area"),
    tooltip: { formatter: field === "projects" ? tooltipProjects : tooltipBudget },
    plotOptions: {
      series: {
        pointStart: Number(yearMin)
      },
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
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-over-time-by-structure">
      <Title as="h2" look="h6">
        {field === "projects" ? titleProjects : titleBudget}
      </Title>
      <SegmentedControl name="projects-over-time-by-structure-segmented">
        <SegmentedElement checked={field === "projects"} label="Nombre de projets financés" onClick={() => setField("projects")} value="projects" />
        <SegmentedElement checked={field === "budget"} label="Montants financés" onClick={() => setField("budget")} value="budget" />
      </SegmentedControl>
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
}