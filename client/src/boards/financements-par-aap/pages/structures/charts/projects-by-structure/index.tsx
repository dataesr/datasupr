import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import { deepMerge, formatCompactNumber, formatPercent, funders, getCssColor, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function ProjectsByStructure({ name }: { name: string | undefined }) {
  const [searchParams] = useSearchParams();
  const [selectedControl, setSelectedControl] = useState("projects");
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
    queryKey: ["fundings-projects-by-structure", structure, yearMax, yearMin],
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

  const series: any[] = [];
  const categories: string[] = [];
  let count = 0;
  let total = 0;
  funders.forEach((funder) => {
    const funderData = (data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder);
    if ((funderData?.unique_projects?.value ?? 0) > 0) {
      total += (selectedControl === "projects" ? funderData?.unique_projects?.value ?? 0 : funderData?.sum_budget?.value ?? 0);
    };
  });
  funders.forEach((funder) => {
    const funderData = (data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder);
    if ((funderData?.unique_projects?.value ?? 0) > 0) {
      const current_y = (selectedControl === "projects" ? funderData?.unique_projects?.value ?? 0 : funderData?.sum_budget?.value ?? 0);
      series.push({
        color: getCssColor({ name: funder, prefix: "funder" }),
        data: [{ x: count, y: current_y, y_perc: current_y / total, total }],
        name: funder,
      });
      categories.push(funder);
      count += 1;
    };
  });

  const config = {
    comment: { "fr": <>Ce graphique indique, par financeur, le nombre et le montant des projets auxquels participe l'établissement {name}. Les montants affichés ne correspondent pas aux financements effectivement perçus par l'établissement. Ils représentent le volume total de financement des projets auxquels l’établissement participe, indépendamment de la part réelle qui lui est attribuée. </> },
    id: "projectsByStructure",
  };

  // If view by number of projects
  let axis = 'Nombre de projets financés';
  let dataLabel = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''} (${formatPercent(this.y_perc)})`;
  };
  let title = `Nombre de projets financés auxquels l'établissement (${name}) participe, réparti par financeur ${getYearRangeLabel({ yearMax, yearMin })}`;
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.series.name}</b> auxquels participe <b>${name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}, soit ${formatPercent(this.y_perc)} (${this.y} / ${this.total} )`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = 'Montants globaux financés (€)';
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €  (${formatPercent(this.y_perc)})`;
      };
      title = `Montant total des projets auxquels l'établissement (${name}) participe, réparti par financeur ${getYearRangeLabel({ yearMax, yearMin })}`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> financés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} pour les projets <b>${this.series.name}</b> auxquels participe <b>${name}</b>, soit ${formatPercent(this.y_perc)} (${formatCompactNumber(this.y)} € / ${formatCompactNumber(this.total)}  €)`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = 'Montants financés pour cet établissement (€)';
      break;
  }

  const localOptions = {
    exporting: { chartOptions: { title: { text: title } } },
    plotOptions: {
      bar: {
        dataLabels: {
          align: "right",
          enabled: true,
          formatter: dataLabel,
        },
        grouping: false,
      },
    },
    series,
    tooltip: { formatter: tooltip },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", categories, "", axis), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-by-structure">
      <Title as="h2" look="h6">
        {title}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
}
