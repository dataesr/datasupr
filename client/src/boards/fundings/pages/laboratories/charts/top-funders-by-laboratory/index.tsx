import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getGeneralOptions, getLabelFromName } from "../../../../utils";
import LaboratoriesSelector from "../../components/laboratoriesSelector";
import YearsSelector from "../../../../components/yearsSelector";
import { getCategoriesAndSeries } from "./utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopFundersByLaboratory() {
  const [selectedLaboratoryId, setSelectedLaboratoryId] = useState<string>("265906719###FR_Centre hospitalier régional universitaire de Lille");
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

  const { categories, series } = getCategoriesAndSeries(data);

  const config = {
    id: "topFundersByLaboratory",
    integrationURL: "/integration?chart_id=topFundersByLaboratory",
    title: `Top 25 financeurs pour ${getLabelFromName(selectedLaboratoryId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
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
      format: `<b>{point.name}</b> a financé <b>{point.y}</b> projet(s) auquel(s) prend part ${getLabelFromName(selectedLaboratoryId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
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
