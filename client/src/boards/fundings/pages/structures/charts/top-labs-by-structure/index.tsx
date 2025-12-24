import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector";
import { getGeneralOptions, getLabelFromName } from "../../../../utils";
import StructuresSelector from "../../components/structuresSelector";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopLabsByStructure() {
  const [selectedStructureId, setSelectedStructureId] = useState<string>("180089013###FR_Centre national de la recherche scientifique|||EN_French National Centre for Scientific Research");
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2022");
  const color = useChartColor();

  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              project_year: {
                gte: selectedYearStart,
                lte: selectedYearEnd
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
              "participant_id_name.keyword": selectedStructureId
            }
          }
        ]
      }
    },
    aggs: {
      by_funder_type: {
        terms: {
          field: "project_type.keyword"
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

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-top-funders-by-structure', selectedStructureId, selectedYearEnd, selectedYearStart],
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
  
  const series = (data?.aggregations?.by_funder_type?.buckets ?? []).map(
    (item: { key: string; doc_count: number; }) => ({
      name: item.key,
      y: item.doc_count,
    })
  );
  const categories = series.map((item: { name: any; }) => item.name);

  const config = {
    id: "topFundersByStructure",
    integrationURL: "/integration?chart_id=topFundersByStructure",
    title: `Top 20 laboratoires pour ${getLabelFromName(selectedStructureId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };

  const options: object = {
    ...getGeneralOptions(
      '',
      categories,
      '',
      'Nombre de projets financés'
    ),
    legend: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          format: "{point.y}",
        },
      },
    },
    series: [{ data: series }],
    tooltip: {
      format: `<b>{point.name}</b> a financé <b>{point.y}</b> projet(s) auquel(s) prend part ${getLabelFromName(selectedStructureId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
    },
  }

  return (
    <div className={`chart-container chart-container--${color}`} id="top-funders-by-structure">
      <StructuresSelector
        selectedStructureId={selectedStructureId}
        setSelectedStructureId={setSelectedStructureId}
      />
      <YearsSelector
        selectedYearEnd={selectedYearEnd}
        selectedYearStart={selectedYearStart}
        setSelectedYearEnd={setSelectedYearEnd}
        setSelectedYearStart={setSelectedYearStart}
      />
      <ChartWrapper
        config={config}
        legend={null}
        options={options}
      />
    </div>
  );
}
