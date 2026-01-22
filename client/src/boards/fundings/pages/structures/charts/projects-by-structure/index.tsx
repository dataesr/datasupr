import { SegmentedControl, SegmentedElement, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { deepMerge, funders, formatCompactNumber, formatPerc, getColorByFunder, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";
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

  const series: any[] = [];
  const categories: string[] = [];
  let count = 0;
  let total = 0;
  funders.forEach((funder) => {
    const funderData = (data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder);
    if ((funderData?.unique_projects?.value ?? 0) > 0) {
      total += (field === "projects" ? funderData?.unique_projects?.value ?? 0 : funderData?.sum_budget?.value ?? 0);
    };
  });
  console.log('ttttt', total);
  funders.forEach((funder) => {
    const funderData = (data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder);
    if ((funderData?.unique_projects?.value ?? 0) > 0) {
      const current_y = ( field === "projects" ? funderData?.unique_projects?.value ?? 0 : funderData?.sum_budget?.value ?? 0);
      series.push({
        color: getColorByFunder(funder),
        data: [{ x: count, y: current_y, y_perc: current_y / total, total }],
        name: funder,
      });
      categories.push(funder);
      count += 1;
    };
  });
  console.log('ttt', series);
  const axisBudget = "Montants financés (€)";
  const axisProjects = "Nombre de projets financés";
  const datalabelBudget = function (this: any) {
    return `${formatCompactNumber(this.y)} €  (${formatPerc(this.y_perc, 0)})`;
  };
  const datalabelProject = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''} (${formatPerc(this.y_perc, 0)})`;
  };
  const titleBudget = `Montant total des projets auxquels l'établissement (${name}) participe, réparti par financeur ${getYearRangeLabel({ yearMax, yearMin })}`;
  const titleProjects = `Nombre de projets financés auxquels l'établissement (${name}) participe, réparti par financeur ${getYearRangeLabel({ yearMax, yearMin })}`;
  const tooltipBudget = function (this: any) {
    return `<b>${formatCompactNumber(this.y)} €</b> financés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} pour les projets <b>${this.series.name}</b> auxquels participe <b>${name}</b>, soit ${formatPerc(this.y_perc, 0)} (${formatCompactNumber(this.y)} € / ${formatCompactNumber(this.total)}  €)`;
  };
  const tooltipProjects = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.series.name}</b> auxquels participe <b>${name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}, soit ${formatPerc(this.y_perc, 0)} (${this.y} / ${this.total} )`;
  };

  const config = {
    id: "projectsByStructure",
    sources: FundingsSources,
  };

  const localOptions = {
    plotOptions: {
      bar: {
        dataLabels: {
          align: "right",
          enabled: true,
          formatter: field === "projects" ? datalabelProject : datalabelBudget,
        },
        grouping: false,
      },
    },
    series,
    tooltip: { formatter: field === "projects" ? tooltipProjects : tooltipBudget },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", categories, "", field === "projects" ? axisProjects : axisBudget), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-by-structure">
      <Title as="h2" look="h6">
        {field === "projects" ? titleProjects : titleBudget}
      </Title>
      <SegmentedControl name="projects-by-structure-segmented">
        <SegmentedElement checked={field === "projects"} label="Nombre de projets financés" onClick={() => setField("projects")} value="projects" />
        <SegmentedElement checked={field === "budget"} label="Montants financés" onClick={() => setField("budget")} value="budget" />
      </SegmentedControl>
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
}
