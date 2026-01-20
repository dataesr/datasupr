import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import "highcharts/modules/variwide";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, funders, getColorFromFunder, getGeneralOptions } from "../../../../utils.ts";
import { FundingsSources } from "../../../graph-config.js";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function OverviewByStructure({ name }: { name: string | undefined }) {
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const year = searchParams.get("year");
  const color = useChartColor();

  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            term: {
              project_year: year,
            },
          },
          {
            term: {
              participant_isFrench: true,
            },
          },
          {
            term: {
              participant_status: "active",
            },
          },
          {
            term: {
              "participant_id.keyword": structure,
            },
          },
          {
            terms: {
              "project_type.keyword": funders,
            },
          },
        ]
      },
    },
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
    queryKey: ['fundings-overview-by-structure', structure, year],
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

  const series = (data?.aggregations?.by_project_type?.buckets ?? []).map((bucket) =>
    [bucket.key, bucket.sum_budget.value, bucket.doc_count]
  );
  const colors = series.map((item) => getColorFromFunder(item[0]));

  const config = {
    id: "overviewByStructure",
    sources: FundingsSources,
    title: `Vue relative des financements de ${name} pour l'année ${year}`,
  };

  let hiddenPoints: string[] = [];

  const options: object = {
    ...getGeneralOptions('', [], '', 'Montant total'),
    chart: { height: '600px', type: 'variwide' },
    tooltip: {
      formatter: function (this: any) {
        return `<b>${this.z}</b> projets pour un montant total de <b>${formatCompactNumber(this.y)} €</b> ont débuté en <b>${year}</b> grâce au financement de <b>${this.name}</b> auxquels prend part <b>${name}</b>`;
      }
    },
    legend: { enabled: true },
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
      legendType: 'point',
      type: 'variwide',
    }],
    xAxis: {
      type: 'category',
      labels: {
        formatter: function (this: any) {
          return this.axis.series[0].points[this.pos].visible ? this.value : '';
        }
      }
    },
    plotOptions: {
      series: {
        point: {
          events: {
            legendItemClick: function(this: any, e: any) {
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
            }
          }
        }
      }
    },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="overview-by-structure">
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
}
