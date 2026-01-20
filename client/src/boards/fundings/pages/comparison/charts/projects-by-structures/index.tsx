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
      by_structure: {
        terms: {
          field: "participant_id_name_default.keyword",
        },
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
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-projects-by-structures', structures, yearMax, yearMin],
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

  // TODO: Can be improve to avoid to parse data aggregations multiple times
  let funders2 = (data?.aggregations?.by_structure?.buckets ?? []).map((bucket) => bucket.by_project_type.buckets.map((bucket2) => bucket2.key)).flat();
  funders2 = [...new Set(funders2)].reverse();
  const categories = (data?.aggregations?.by_structure?.buckets ?? []).map((item) => item.key.split('###')[1]);
  const series = funders2.map((funder) => ({
    color: getColorFromFunder(funder),
    data: data.aggregations.by_structure.buckets.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.[field === "projects" ? "unique_projects" : "sum_budget"]?.value ?? 0),
    name: funder,
  }));

  const titleProjects = `Nombre de projets par financeur entre ${yearMin} et ${yearMax}`;
  const titleBudget = `Montant total des projets par financeur entre ${yearMin} et ${yearMax}`;
  const axisProjects = "Nombre de projets financés";
  const axisBudget = "Montants financés";
  const tooltipProjects = function (this: any) {
    return `<b>${this.y}</b> projets ont débuté entre <b>${yearMin}</b> et <b>${yearMax}</b> grâce aux financements de <b>${this.series.name}</b> auxquels prend part <b>${categories[this.x]}</b>`;
  };
  const tooltipBudget = function (this: any) {
    return `<b>${formatCompactNumber(this.y)} €</b> ont été financés par <b>${this.series.name}</b> pour des projets débutés entre <b>${yearMin}</b> et <b>${yearMax}</b> auxquels prend part <b>${categories[this.x]}</b>`;
  };
  const config = {
    id: "projectsByStructures",
    sources: FundingsSources,
  };

  const options: object = {
    ...getGeneralOptions('', [], '', field === "projects" ? axisProjects : axisBudget),
    legend: { reversed: true },
    plotOptions: { series: { dataLabels: {
      enabled: true,
      formatter: function(this: any) { return field === "projects" ? this.y : `${formatCompactNumber(this.y)} €`},
    }, stacking: "normal" } },
    series,
    tooltip: { formatter: field === "projects" ? tooltipProjects : tooltipBudget },
    xAxis: { categories },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-by-structures">
      <Title as="h2" look="h6">
        {field === "projects" ? titleProjects : titleBudget}
      </Title>
      <SegmentedControl name="projects-by-structures-segmented">
        <SegmentedElement checked={field === "projects"} label="Nombre de projets financés" onClick={() => setField("projects")} value="projects" />
        <SegmentedElement checked={field === "budget"} label="Montant total" onClick={() => setField("budget")} value="budget" />
      </SegmentedControl>
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
}
