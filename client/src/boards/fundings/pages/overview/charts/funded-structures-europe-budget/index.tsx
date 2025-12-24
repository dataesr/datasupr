import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector";
import { getCategoriesAndSeriesBudget } from "../../../../utils";
import { getOptions } from "./utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function FundedStructuresEuropeBudget() {
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
              participant_isFrench: false
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
    queryKey: [`fundings-funded-structures-europe-budget`, selectedYearEnd, selectedYearStart],
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
  const { categories, series } = getCategoriesAndSeriesBudget(data);

  const config = {
    id: "fundedStructuresEuropeBudget",
    integrationURL: "/integration?chart_id=fundedStructuresEuropeBudget",
    title: `Top 25 des structures NON françaises par montant des financements des projets auxquels elles participent sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };

  const options: object = getOptions(
    series,
    categories,
    '',
    selectedYearEnd,
    selectedYearStart,
    '',
    'Montant des financements des projets auxquels la structure a participé',
  );

  return (
    <div className={`chart-container chart-container--${color}`} id="funded-structures-europe-budget">
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
