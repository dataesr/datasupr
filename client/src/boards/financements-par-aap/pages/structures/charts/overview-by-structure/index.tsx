import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import "highcharts/es-modules/masters/modules/variwide.src.js";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getI18nLabel } from "../../../../../../utils";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import { formatCompactNumber, funders, getCssColor, getEsQuery, getYearRangeLabel, pattern } from "../../../../utils.ts";
import i18n from "../../../../i18n.json";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function OverviewByStructure({ name }: { name: string | undefined }) {
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
    aggregations: {
      by_project_type: {
        terms: {
          field: "project_type.keyword",
          size: 50,
        },
        aggregations: {
          is_coordinator: {
            terms: {
              field: "participation_is_coordinator",
            },
            aggregations: {
              sum_budget_participation: {
                sum: {
                  field: "participation_funding",
                },
              },
            },
          },
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-overview-by-structure", structure, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  const series = funders
    .map((funder) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder))
    // Filter on not empty item
    .filter((bucket) => !!bucket)
    .map((bucket) => [
      [[bucket.key, getI18nLabel(i18n, 'coordinator')].join(' - '), bucket?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget_participation?.value ?? 0, bucket?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.doc_count ?? 0],
      [[bucket.key, getI18nLabel(i18n, 'not-coordinator')].join(' - '), bucket?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget_participation?.value ?? 0, bucket?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.doc_count ?? 0],
    ])
    .flat();
  const colors = funders.map((funder) => [{ pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } }, getCssColor({ name: funder, prefix: "funder" })]).flat();

  const config = {
    comment: { "fr": <>Ce graphique met en regard le volume de projets et les financements perçus associés : la largeur des barres représente le nombre de projets, tandis que leur hauteur correspond au financement perçu. Le type de participation est distingué, en pointillé quand l'établissement est coordinateur, en couleur simple s'il est partenaire non-coordinateur. Le financement perçu approxime la part réelle allouée à chaque établissement partenaire d’un projet (en assimilant consommation et subvention pour le PIA). </> },
    id: "overviewByStructure",
    integrationURL: `/integration?chart_id=overviewByStructure&${searchParams.toString()}`,
    title: `Structure du financement : nombre de projets et financements perçus associés pour les projets auxquels participe l'établissement (${name}) ${getYearRangeLabel({ yearMax, yearMin })}`,
  };

  let hiddenPoints: string[] = [];
  const options = {
    chart: { type: "variwide" },
    legend: { enabled: true },
    plotOptions: {
      series: {
        point: {
          events: {
            legendItemClick: function (this: any, e: any) {
              var clic_id = e.target.name;
              this.series.points.forEach((point) => {
                if (point.name === clic_id) {
                  if (!hiddenPoints.includes(point.name)) {
                    hiddenPoints.push(point.name);
                  } else {
                    hiddenPoints = hiddenPoints.filter((hiddenPoint) => hiddenPoint !== point.name);
                  }
                  point.update({
                    oldY: point.y ? point.y : point.oldY,
                    y: point.y ? null : point.oldY,
                    oldZ: point.z ? point.z : point.oldZ,
                    z: point.z ? null : point.oldZ,
                    visible: !hiddenPoints.includes(point.name),
                  }, false);
                }
              });
              this.series.chart.redraw(true);
            },
          },
        },
      },
    },
    series: [{
      colorByPoint: true,
      colors,
      data: series,
      dataLabels: {
        enabled: true,
        formatter: function (this: any) {
          return `${formatCompactNumber(this.y)} €`;
        },
      },
      legendType: "point",
      type: "variwide",
    }],
    title: { text: "" },
    tooltip: {
      formatter: function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> financés pour <b>${this.z}</b> projets <b>${this.name}</b> auxquels participe <b>${name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
      },
    },
    xAxis: {
      categories: undefined,
      title: { text: "Nombre de projets" },
      type: "category",
    },
    yAxis: { title: { text: getI18nLabel(i18n, 'funding_by_structure') } },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="overview-by-structure">
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
}
