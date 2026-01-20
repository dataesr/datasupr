import { SegmentedControl, SegmentedElement, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, getColorFromFunder, getEsQuery, getGeneralOptions } from "../../../../utils.ts";
import { FundingsSources } from "../../../graph-config.js";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function ProjectsByStructure({ name }: { name: string | undefined }) {
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
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-projects-by-structure', structure, yearMax, yearMin],
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

  const series = (data?.aggregations?.by_project_type?.buckets ?? []).map((bucket, index) => ({
    color: getColorFromFunder(bucket.key),
    data: [{ x: index, y: field === "projects" ? bucket.unique_projects.value : bucket.sum_budget.value }],
    name: bucket.key,
  }));
  const categories: string[] = series.map((item: { name: string }) => item.name);

  const titleProjects = `Nombre de projets de ${name} par financeur entre ${yearMin} et ${yearMax}`;
  const titleBudget = `Montant total des projets de ${name} par financeur entre ${yearMin} et ${yearMax}`;
  const axisProjects = "Nombre de projets financés";
  const axisBudget = "Montant total";
  const tooltipProjects = function (this: any) {
    return `<b>${this.y}</b> projets ont débuté entre <b>${yearMin}</b> et <b>${yearMax}</b> grâce aux financements de <b>${this.series.name}</b> auxquels prend part <b>${name}</b>`;
  };
  const tooltipBudget = function (this: any) {
    return `<b>${formatCompactNumber(this.y)} €</b> ont été financés par <b>${this.series.name}</b> pour des projets débutés entre <b>${yearMin}</b> et <b>${yearMax}</b> auxquels prend part <b>${name}</b>`;
  };
  const config = {
    id: "projectsByStructure",
    sources: FundingsSources,
  };

  const options: object = {
    ...getGeneralOptions('', [], '', field === "projects" ? axisProjects : axisBudget),
    plotOptions: { bar: { grouping: false } },
    series,
    tooltip: { formatter: field === "projects" ? tooltipProjects : tooltipBudget },
    xAxis: { categories },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-by-structure">
      <Title as="h2" look="h6">
        {field === "projects" ? titleProjects : titleBudget}
      </Title>
      <SegmentedControl name="projects-by-structure-segmented">
        <SegmentedElement checked={field === "projects"} label=" financés" onClick={() => setField("projects")} value="projects" />
        <SegmentedElement checked={field === "budget"} label="Montant total" onClick={() => setField("budget")} value="budget" />
      </SegmentedControl>
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
}
