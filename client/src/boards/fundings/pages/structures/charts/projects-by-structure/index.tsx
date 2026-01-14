import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getColorFromFunder, getGeneralOptions, getLabelFromName } from "../../../../utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function ProjectsByStructure() {
  const [searchParams] = useSearchParams();
  const next = new URLSearchParams(searchParams);
  const structure = next.get("structure")?.toString() ?? "";
  const year = next.get("year")?.toString() ?? "";
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
              "participant_id_name.keyword": structure,
            },
          },
          {
            terms: {
              "project_type.keyword": ["ANR", "PIA ANR", "PIA hors ANR", "Horizon 2020", "Horizon Europe"],
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
          // order: { "_count": "asc" }
        },
        aggregations: {
          unique_projects: {
            cardinality: {
              field: "project_id.keyword"
            }
          }
        }
      }
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-projects-by-structure', structure, year],
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

  const series = data.aggregations.by_project_type.buckets.map((bucket) => ({
    color: getColorFromFunder(bucket.key),
    name: bucket.key,
    value: bucket.unique_projects.value,
  }));

  const config = {
    id: "projectsByStructure",
    integrationURL: "/integration?chart_id=projectsByStructure",
    title: `Nombre de projets pour ${getLabelFromName(structure)} par financeur pour l'année ${year}`,
  };

  const options: object = {
    ...getGeneralOptions('', [], 'Année de début du projet', 'Nombre de projets'),
    tooltip: {
      format: `<b>{point.value}</b> projets ont débuté en <b>${year}</b> grâce au financement de <b>{point.name}</b> dont au moins un participant est une institution française active`,
    },
    chart: {
      height: '600px',
      type: 'area'
    },
    series: [{ type: 'treemap', data: series }],
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-by-structure">
      <ChartWrapper config={config} options={options} />
    </div>
  );
}
