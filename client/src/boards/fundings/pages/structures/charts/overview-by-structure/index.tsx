import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import "highcharts/modules/variwide";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, getColorFromFunder, getGeneralOptions } from "../../../../utils.ts";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function OverviewByStructure({ name }: { name: string | undefined }) {
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
  const colors = series.map((item) => getColorFromFunder(item[0]));

  const config = {
    id: "overviewByStructure",
    sources: [{
      label: {
        fr: <>ANR (ANR DGDS)</>,
      },
      update: new Date("2026-01-09"),
      url: {
        fr: "https://www.data.gouv.fr/datasets/anr-01-projets-anr-dos-et-dgds-detail-des-projets-et-des-partenaires",
      },
    }],
    title: `Vue relative des financements de ${name} pour l'année ${year}`,
  };

  const options: object = {
    ...getGeneralOptions('', [], '', 'Montant total'),
    chart: { height: '600px', type: 'variwide' },
    tooltip: {
      formatter: function (this: any) {
        return `<b>${this.z}</b> projets pour un montant total de <b>${formatCompactNumber(this.y)} €</b> ont débuté en <b>${year}</b> grâce au financement de <b>${this.name}</b> avec la participation de <b>${name}</b>`;
      }
    },
    legend: { enabled: false },
    series: [{
      data: series,
      colorByPoint: true,
      colors,
      dataLabels: {
        enabled: true,
        formatter: function (this: any) {
          return `${formatCompactNumber(this.y)} €`;
        }
      },
    }],
    xAxis: { type: 'category' },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="overview-by-structure">
      <ChartWrapper config={config} options={options} />
    </div>
  );
}
