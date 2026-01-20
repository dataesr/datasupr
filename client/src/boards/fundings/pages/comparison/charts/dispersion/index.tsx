import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, getEsQuery, getGeneralOptions } from "../../../../utils.ts";
import { FundingsSources } from "../../../graph-config.js";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function Dispersion() {
  const [searchParams] = useSearchParams();
  const structures = searchParams.getAll("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures, yearMax, yearMin }),
    aggregations: {
      by_typology: {
        terms: {
          field: "participant_typologie_1.keyword",
        },
        aggregations: {
          by_structure: {
            terms: {
              field: "participant_id_name_default.keyword",
            },
            aggregations: {
              unique_projects: {
                cardinality: {
                  field: "project_id.keyword",
                },
              },
              sum_budget: {
                sum: {
                  field: "project_budgetTotal",
                },
              },
            },
          },
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ['dispersion', structures, yearMax, yearMin],
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

  const series = (data?.aggregations?.by_typology?.buckets ?? []).map((typology) => ({
    data: (typology?.by_structure?.buckets ?? []).map((structure) => ({
      name: structure.key.split("###")[1],
      x: structure?.unique_projects?.value ?? 0,
      y: structure?.sum_budget?.value ?? 0,
      yFormatted: `${formatCompactNumber(structure?.sum_budget?.value ?? 0)} €`,
    })),
    name: typology.key,
  }));

  const config = {
    id: "dispersion",
    sources: FundingsSources,
    title: `Nombre de projets financés et leurs montants par structure entre ${yearMin} et ${yearMax}`,
  };

  const options: object = {
    ...getGeneralOptions("", [], "Nombre de projets financés", ""),
    chart: { height: "600px", plotBorderWidth: 1, type: "bubble", zooming: { type: "xy" } },
    plotOptions: { series: { dataLabels: { enabled: true, format: "{point.name}" } } },
    series,
    tooltip: {
      format: `{point.typology} Entre <b>${yearMin}</b> et <b>${yearMax}</b>, <b>{point.name}</b> a reçu <b>{point.yFormatted}</b> pour financer <b>{point.x} projets</b>`,
    },
    yAxis: { labels: { formatter: function (this: any) { return `${formatCompactNumber(this.value)} €`; } }, title: { text: "Montants financés" } },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="dispersion">
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
}
