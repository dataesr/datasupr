import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector.tsx";
import { getCategoriesAndSeries, getGeneralOptions } from "../../../../utils";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function FundedStructures() {
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
              participant_type: "institution"
            }
          }
        ]
      }
    },
    aggs: {
      by_participant: {
        terms: {
          field: "participant_id_name.keyword",
          size: 25
        },
        aggs: {
          by_funder: {
            terms: {
              field: "project_type.keyword"
            }
          }
        }
      }
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-funded-structures', selectedYearEnd, selectedYearStart],
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
    id: "fundedStructures",
    integrationURL: "/integration?chart_id=fundedStructures",
    title: `Top 25 des structures françaises par nombre de financements sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };

  const options: object = {
    ...getGeneralOptions('', categories, '', 'Nombre de projets financés'),
    tooltip: {
      format: `<b>{key}</b> a obtenu <b>{point.y}</b> financements sur la période ${selectedYearStart}-${selectedYearEnd} de la part <b>{series.name}</b>`,
    },
    series,
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="funded-structures">
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
