import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector";
import { getColorFromFunder, getGeneralOptions, getLabelFromName, sortedFunders } from "../../../../utils";
import StructuresSelector from "../../components/structuresSelector";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopFundersByStructure() {
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
          field: "project_type.keyword",
          size: 25
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

  const series = (data?.aggregations?.by_funder_type?.buckets ?? []).map((item: { unique_projects: any; key: string; doc_count: number }) => ({
    color: getColorFromFunder(item.key),
    name: item.key,
    data: [item.unique_projects.value],
  }));
  const categories = series.map((item: { name: any }) => item.name);

  const config = {
    id: "topFundersByStructure",
    integrationURL: "/integration?chart_id=topFundersByStructure",
    title: `Top 25 des financeurs pour ${getLabelFromName(selectedStructureId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };
  console.log(series, categories);
  const options: object = {
    ...getGeneralOptions("", categories, "Financeurs", "Nombre de projets financés"),
    xAxis: {
      categories,
      labels: { enabled: false },
      title: { text: "Financeurs" },
    },
    legend: {
      enabled: true,
      reversed: false,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    plotOptions: {
      series: {
        stacking: undefined,
        dataLabels: {
          enabled: true,
          format: "{series.name}",
        },
      },
    },
    series: series,
    tooltip: {
      format: `<b>{series.name}</b> a financé <b>{point.y}</b> projet(s) auquel(s) prend part <b>${getLabelFromName(
        selectedStructureId
      )}</b> sur la période <b>${selectedYearStart}-${selectedYearEnd}</b>`,
    },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="top-funders-by-structure">
      <StructuresSelector selectedStructureId={selectedStructureId} setSelectedStructureId={setSelectedStructureId} />
      <YearsSelector
        selectedYearEnd={selectedYearEnd}
        selectedYearStart={selectedYearStart}
        setSelectedYearEnd={setSelectedYearEnd}
        setSelectedYearStart={setSelectedYearStart}
      />
      <ChartWrapper config={config} options={options} legend={null} />
    </div>
  );
}
