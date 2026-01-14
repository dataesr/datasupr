import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, getColorFromFunder, getGeneralOptions, getLabelFromName } from "../../../../utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function BudgetByStructure() {
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
          order: {
            "sum_budget": "desc"
          }
        },
        aggregations: {
          sum_budget: {
            sum: {
              field: "project_budgetTotal"
            }
          },
        }
      }
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-budget-by-structure', structure],
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
    value: bucket.sum_budget.value
  }));

  const config = {
    id: "budgetByStructure",
    integrationURL: "/integration?chart_id=budgetByStructure",
    title: `Montant total des projets pour ${getLabelFromName(structure)} par financeur pour l'année ${year}`,
  };

  const options: object = {
    ...getGeneralOptions('', [], 'Année de début du projet', 'Montant total des projets'),
    tooltip: {
      formatter: function(this: any) {
        return `<b>${formatCompactNumber(this.value)} €</b> ont été financés par <b>${this.name}</b> pour des projets débutés en <b>${year}</b> dont au moins un participant est une institution française active`
      }
    },
    series: [{ type: 'treemap', data: series }],
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="budget-by-structure">
      <ChartWrapper config={config} options={options} />
    </div>
  );
}
