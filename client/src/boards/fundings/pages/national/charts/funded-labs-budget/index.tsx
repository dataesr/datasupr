import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector.tsx";
import { formatCompactNumber, getCategoriesAndSeriesBudget, getGeneralOptions } from "../../../../utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function FundedLabsBudget() {
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
              participant_type: "laboratory"
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
    queryKey: ['fundings-funded-labs-budget', selectedYearEnd, selectedYearStart],
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
    id: "fundedLabsBudget",
    integrationURL: "/integration?chart_id=fundedLabsBudget",
    title: `Top 25 des laboratoires français par montant des financements des projets auxquels elles participent sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };

  const options: object = {
    ...getGeneralOptions('', categories, '', 'Montant des financements des projets auxquels le laboratoire a participé'),
    tooltip: {
      formatter: function (this: any) {
        return `<b>${this.key}</b> a participé à des projets financés par ${this.series.name}, à hauteur de <b>${formatCompactNumber(this.y)} €</b> sur la période ${selectedYearStart}-${selectedYearEnd}`
      }
    },
    series,
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="funded-labs-budget">
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
