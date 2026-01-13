import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getColorFromFunder, getGeneralOptions, getLabelFromName } from "../../../../utils.ts";
import StructuresSelector from "../../components/structuresSelector";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function ParticipationsOverTimeByStructure() {
  const [selectedStructureId, setSelectedStructureId] = useState<string>(
    "180089013###FR_Centre national de la recherche scientifique|||EN_French National Centre for Scientific Research"
  );
  const color = useChartColor();
  const startYear = 2011;

  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              project_year: {
                gte: startYear,
              }
            }
          },
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
              "participant_id_name.keyword": selectedStructureId,
            },
          },
        ]
      }
    },
    aggregations: {
      by_project_type: {
        terms: {
          field: "project_type.keyword",
          size: 30,
          order: { "_count": "asc" }
        },
        aggregations: {
          by_project_year: {
            terms: {
              field: "project_year",
              size: 30
            },
            aggs: {
              unique_projects: {
                cardinality: {
                  field: "project_id.keyword"
                }
              }
            }
          }
        }
      }
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-participations-over-time-by-structure', selectedStructureId],
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

  if (isLoading || !data) return <DefaultSkeleton />;
  const allYears = data.aggregations.by_project_type.buckets
    .flatMap(bucket => bucket.by_project_year.buckets.map(b => b.key));
  const maxYear = Math.max(...allYears);
  const years = Array.from(Array(maxYear-startYear+1).keys()).map((item) => item + startYear);
  const series = data.aggregations.by_project_type.buckets.map((bucket) => ({
    color: getColorFromFunder(bucket.key),
    data: years.map((year) => bucket.by_project_year.buckets.find((item) => item.key === year)?.unique_projects.value ?? 0),
    marker: { enabled: false },
    name: bucket.key
  }));

  const config = {
    id: "participationsOverTimeByStructure",
    integrationURL: "/integration?chart_id=participationsOverTimeByStructure",
    title: `Nombre de projets pour ${getLabelFromName(selectedStructureId)} par financeur sur la période ${years[0]}-${years[years.length - 1]}, par année de début du projet`,
  };

  const options: object = {
    ...getGeneralOptions('', [], 'Année de début du projet', 'Nombre de projets'),
    tooltip: {
      format: `<b>{point.y}</b> projets ont débuté en <b>{key}</b> grâce au financement de <b>{series.name}</b> dont au moins un participant est une institution française active`,
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
    <div className={`chart-container chart-container--${color}`} id="participations-over-time-by-structure">
      <StructuresSelector selectedStructureId={selectedStructureId} setSelectedStructureId={setSelectedStructureId} />
      <ChartWrapper config={config} options={options} />
    </div>
  );
}
