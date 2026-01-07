import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getColorFromFunder, getGeneralOptions, getLabelFromName, sortedFunders } from "../../../../utils";
import LaboratoriesSelector from "../../components/laboratoriesSelector";
import YearsSelector from "../../../../components/yearsSelector";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopFundersByLaboratory() {
  const [selectedLaboratoryId, setSelectedLaboratoryId] = useState<string>("200610854B###FR_Observatoire de Paris - PSL");
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
              "participant_id_name.keyword": selectedLaboratoryId
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
    queryKey: [`fundings-top-funders-by-laboratory`, selectedLaboratoryId, selectedYearEnd, selectedYearStart],
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

  const buckets = data?.aggregations?.by_funder_type?.buckets ?? [];
  const categories = buckets.map((item: { key: string; }) => item.key);
  const series = buckets.map(
    (item: {
      unique_projects: any; key: string; doc_count: number;
    }) => ({
      color: getColorFromFunder(item.key),
      data: [item.unique_projects.value],
      name: item.key,
    })
  );

  const config = {
    id: "topFundersByLaboratory",
    integrationURL: "/integration?chart_id=topFundersByLaboratory",
    title: `Top 25 des financeurs pour ${getLabelFromName(selectedLaboratoryId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };

  const options: object = {
    ...getGeneralOptions("", categories, "Financeurs", "Nombre de projets financés"),
    legend: {
      align: "center",
      enabled: true,
      layout: "horizontal",
      reversed: false,
      verticalAlign: "bottom",
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{series.name}",
        },
        stacking: undefined,
      },
    },
    series,
    tooltip: {
      format: `<b>{series.name}</b> a financé <b>{point.y}</b> projet(s) auquel(s) prend part <b>${getLabelFromName(selectedLaboratoryId)}</b> sur la période <b>${selectedYearStart}-${selectedYearEnd}</b>`,
    },
    xAxis: {
      categories,
      labels: { enabled: false },
      title: { text: "Financeurs" },
    },
  }

  return (
    <div className={`chart-container chart-container--${color}`} id="top-funders-by-laboratory">
      <LaboratoriesSelector
        selectedLaboratoryId={selectedLaboratoryId}
        setSelectedLaboratoryId={setSelectedLaboratoryId}
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
