import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { deepMerge, funders, formatCompactNumber, getColorByFunder, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";
import { FundingsSources } from "../../../graph-config.js";

import "highcharts/modules/variwide";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function OverviewByStructure({ name }: { name: string | undefined }) {
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
    queryKey: ['fundings-overview-by-structure', structure, yearMax, yearMin],
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

  const series = funders
    .map((funder) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder))
    .filter((item) => !!item)
    .map((bucket) => [bucket.key, bucket.sum_budget.value, bucket.doc_count]);
  const colors = series.map((item) => getColorByFunder(item[0]));

  const config = {
    comment: { "fr": <>Ce graphique met en regard le volume de projets et les montants de financement associés : la largeur des barres représente le nombre de projets, tandis que leur hauteur correspond au montant total de financement. Les montants indiqués reflètent le financement global des projets auxquels l’établissement participe et ne correspondent pas aux sommes effectivement perçues par celui-ci.</> },
    id: "overviewByStructure",
    sources: FundingsSources,
    title: `Structure du financement : nombre de projets et montants associés pour les projets auxquels participe l'établissement (${name}) ${getYearRangeLabel({ yearMax, yearMin })}`,
  };

  let hiddenPoints: string[] = [];

  const localOptions = {
    legend: { enabled: true },
    plotOptions: {
      series: {
        point: {
          events: {
            legendItemClick: function (this: any, e: any) {
              var clic_id = e.target.name;
              this.series.points.forEach((point) => {
                if (point.name === clic_id) {
                  if (!hiddenPoints.includes(point.name)) {
                    hiddenPoints.push(point.name);
                  } else {
                    hiddenPoints = hiddenPoints.filter((item) => item !== point.name);
                  }
                  point.update({
                    oldY: point.y ? point.y : point.oldY,
                    y: point.y ? null : point.oldY,
                    oldZ: point.z ? point.z : point.oldZ,
                    z: point.z ? null : point.oldZ,
                    visible: !hiddenPoints.includes(point.name),
                  }, false);
                }
              });
              this.series.chart.redraw(true);
            },
          },
        },
      },
    },
    series: [{
      data: series,
      colorByPoint: true,
      colors,
      dataLabels: {
        enabled: true,
        formatter: function (this: any) {
          return `${formatCompactNumber(this.y)} €`;
        }
      },
      legendType: "point",
      type: "variwide",
    }],
    tooltip: {
      formatter: function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> financés pour <b>${this.z}</b> projets <b>${this.name}</b> auxquels participe <b>${name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
      },
    },
    xAxis: {
      type: "category",
    },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", undefined, "Nombre de projets", "Montants financés (€)", "variwide"), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="overview-by-structure">
      {isLoading ? <DefaultSkeleton height={ String(options?.chart?.height) } /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
}
