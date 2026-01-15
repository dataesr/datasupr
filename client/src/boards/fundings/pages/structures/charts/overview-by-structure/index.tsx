import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import "highcharts/modules/variwide";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getGeneralOptions } from "../../../../utils.ts";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function OverviewByStructure({ name }: { name: string }) {
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
          // {
          //   term: {
          //     participant_isFrench: true,
          //   },
          // },
          {
            term: {
              participant_status: "active",
            },
          },
          {
            term: {
              "participant_id.keyword": structure,
            },
          },
          {
            terms: {
              "project_type.keyword": ["ANR", "PIA ANR", "PIA hors ANR", "Horizon 2020", "Horizon Europe"],
            },
          },
        ]
      },
    },
    aggregations: {
      by_project_type: {
        terms: {
          field: "project_type.keyword",
          size: 30,
          // order: { "_count": "asc" }
        },
        aggregations: {
          sum_budget: {
            sum: {
              field: "project_budgetTotal",
            },
          },
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-overview-by-structure', structure, year],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const series = data.aggregations.by_project_type.buckets.map((bucket) =>
    [bucket.key, bucket.sum_budget.value, bucket.doc_count]
  );

  const config = {
    id: "overviewByStructure",
    integrationURL: `/integration?chart_id=overviewByStructure&${next.toString()}`,
    title: `Nombre de projets pour ${name} par financeur pour l'année ${year}`,
  };

  const options: object = {
    ...getGeneralOptions('', [], '', 'Montant total du projet'),
    tooltip: {
      format: `<b>{point.z}</b> projets pour un montant total de <b>{point.y} €</b> ont débuté en <b>${year}</b> grâce au financement de <b>{point.name}</b> dont au moins un participant est une institution française active`,
    },
    chart: {
      type: 'variwide'
    },
    legend: {
        enabled: false
    },
    series: [{
      // name: 'founders',
      data: series,
      borderRadius: 3,
      colorByPoint: true,
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      },
    }],
    xAxis: {
        type: 'category'
    },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="overview-by-structure">
      <ChartWrapper config={config} options={options} />
    </div>
  );
}
