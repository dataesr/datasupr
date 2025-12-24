import { useQuery } from "@tanstack/react-query";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, getColorFromFunder, getGeneralOptions } from "../../../../utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function ParticipationsOverTimeBudget() {
  const color = useChartColor();

  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            term: {
              participant_isFrench: true
            }
          },
          {
            term: {
              participant_status: "active"
            }
          },
          {
            term: {
              participant_type: "institution"
            }
          }
        ]
      }
    },
    aggregations: {
      by_project_type: {
        terms: {
          field: "project_type.keyword",
          size: 30
        },
        aggregations: {
          by_project_year: {
            terms: {
              field: "project_year",
              size: 30
            },
            aggs: {
              sum_budget: {
                sum: {
                  field: "project_budgetTotal"
                }
              }
            }
          }
        }
      }
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-participations-over-time-budget'],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-participations`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  const years = Array.from(Array(26).keys()).map((item) => item + 2000);

  if (isLoading || !data) return <DefaultSkeleton />;
  const series = data.aggregations.by_project_type.buckets.map((bucket) => ({
    color: getColorFromFunder(bucket.key),
    data: years.map((year) => bucket.by_project_year.buckets.find((item) => item.key === year)?.sum_budget.value ?? 0),
    marker: { enabled: false },
    name: bucket.key
  }));

  const config = {
    id: "participationsOverTimeBudget",
    integrationURL: "/integration?chart_id=participationsOverTimeBudget",
    title: `Montant total des projets par financeur sur la période ${years[0]}-${years[years.length - 1]}, par année de début du projet`,
  };

  const options: object = {
    ...getGeneralOptions('', [], 'Année de début du projet', 'Montant total des projets'),
    tooltip: {
      formatter: function(this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été financés par <b>${this.series.name}</b> pour des projets débutés en <b>${this.key}</b> dont au moins un participant est une institution française active.`
      }
    },
    chart: {
      height: '600px',
      type: 'area'
    },
    plotOptions: {
      series: {
        pointStart: years[0]
      },
      area: {
        stacking: 'normal',
        marker: {
          enabled: false,
          lineColor: '#666666',
          lineWidth: 1,
          symbol: 'circle'
        }
      }
    },
    series,
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="participations-over-time-budget">
      <ChartWrapper
        config={config}
        legend={null}
        options={options}
      />
    </div>
  );
}