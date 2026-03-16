import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import "highcharts/modules/pattern-fill";
import { useSearchParams } from "react-router-dom";

import ChartWrapper, { HighchartsOptions } from "../../../../../../components/chart-wrapper/index.tsx";
import { createChartOptions } from "../../../../../../components/chart-wrapper/default-options.ts";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getI18nLabel } from "../../../../../../utils.tsx";
import { deepMerge } from "../../../../../../utils.tsx";
import i18n from "../../../../i18n.json";
import { formatPercent, getEsQuery, getYearRangeLabel } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_ORGANIZATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function StartupsByStructure({ name }: { name: string | undefined }) {
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
    aggregations: {
      by_creation_year: {
        terms: {
          field: "creationYear",
          order: { _key: "asc" },
          size: 25,
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-projects-by-structure", structure, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_ORGANIZATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  const categories = (data?.aggregations?.by_creation_year?.buckets ?? []).map((bucket) => bucket?.key);
  const series: string[] = (data?.aggregations?.by_creation_year?.buckets ?? []).map((bucket) => bucket?.doc_count);
  console.log(series);
  const axis = getI18nLabel(i18n, 'number_of_startups');
  const title = `Nombre de start-up par année de création ${getYearRangeLabel({ yearMax, yearMin })}`;
  const tooltip = function (this: any) {
    return `<b>${this.y}</b> start-ups <b>${this.series.name}</b> auxquelles participe <b>${name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}, soit ${formatPercent(this.y_perc)} (${this.y} / ${this.total} )`;
  };

  const config = {
    // comment: { "fr": <>Ce graphique indique, par financeur, le nombre, les financements globaux et les financements perçus des projets auxquels participe l'établissement {name}. Pour chaque financeur, la barre correspondante est subdivisée en deux en fonction du rôle de l'établissement : la partie pointillée quand l'établissement est coordinateur, en couleur simple quand il est partenaire non coordinateur. Le financement global représente le volume total de financements des projets auxquels participe l'établissement. Le financement perçu approxime la part réelle allouée à chaque établissement partenaire d’un projet (en assimilant consommation et subvention pour le PIA).</> },
    id: "startupsByStructure",
    integrationURL: `/integration?chart_id=startupsByStructure&${searchParams.toString()}`,
    title,
  };

  const options = {
    chart: { type: 'column' },
    legend: { enabled: false },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false,
        },
        stacking: 'normal',
      },
    },
    series: [{ data: series }],
    title: { text: "" },
    tooltip: { formatter: tooltip },
    xAxis: {
      categories,
      title: { text: "" },
    },
    yAxis: {
      stackLabels: { enabled: true },
      title: { text: axis },
    },
  };

  const optionsLocal: HighchartsOptions = deepMerge(createChartOptions("bar", { chart: { height: "600px" } }), options);

  return (
    <div className={`chart-container chart-container--${color}`} id="startups-by-structure">
      <Title as="h2" look="h6">
        {title}
      </Title>
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapper config={config} hideTitle options={optionsLocal} />}
    </div>
  );
}
