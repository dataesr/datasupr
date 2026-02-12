import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import { deepMerge, formatCompactNumber, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

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
              size: structures.length,
            },
            aggregations: {
              unique_projects: {
                cardinality: {
                  field: "project_id.keyword",
                },
              },
              sum_budget: {
                sum: {
                  field: "project_budgetFinanced",
                },
              },
            },
          },
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-dispersion", structures, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
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

  const xs = series.map((funder) => funder.data.map((structure) => structure.x)).flat();
  const tickInterval = (Math.max.apply(null, xs) - Math.min.apply(null, xs)) / 10;
  const meanX = xs.length > 0 ? xs.reduce((prev, current) => prev + current) / xs.length : undefined;
  const ys = series.map((funder) => funder.data.map((structure) => structure.y)).flat();
  const meanY = ys.length > 0 ? ys.reduce((prev, current) => prev + current) / ys.length : undefined;

  const config = {
    comment: { "fr": <>Ce graphique positionne chaque établissement selon deux dimensions :
– en abscisse, le nombre de projets financés auxquels il participe ;
– en ordonnée, le montant total des projets correspondants. Il permet d’identifier différents profils :
des établissements impliqués dans un grand nombre de projets,
d'autres positionnés sur moins de projets mais de montant élevé,
et ceux combinant volume et intensité financière.</> },
    id: "dispersion",
    title: `Positionnement des établissements selon le nombre de projets et le montant associé ${getYearRangeLabel({ yearMax, yearMin })}`,
  };

  const localOptions = {
    chart: { plotBorderWidth: 1, type: "bubble", zooming: { type: "xy" } },
    legend: { enabled: true },
    plotOptions: { series: { dataLabels: { enabled: true, format: "{point.name}" } } },
    series,
    tooltip: {
      format: `<b>{point.name}</b> a participé à <b>{point.x} projets</b> dont le montant total représente <b>{point.yFormatted}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}</b>`,
    },
    xAxis: {
      gridLineWidth: 1,
      lineWidth: 1,
      plotLines: [{
        dashStyle: "dot",
        label: { rotation: 0, style: { fontStyle: "italic" }, text: `Nombre moyen de projets = ${Math.round(meanX || 0)}`, x: 10, y: 15 },
        value: meanX,
        width: 2,
        zIndex: 3,
      }],
      tickInterval,
      title: { text: "Nombre de projets financés" },
    },
    yAxis: {
      lineWidth: 1,
      plotLines: [{
        dashStyle: "dot",
        label: { align: "right", style: { fontStyle: "italic" }, text: `Montants moyen des projets = ${formatCompactNumber(meanY || 0)} €`, x: -8, y: -8 },
        value: meanY,
        width: 2,
        zIndex: 3
      }],
      title: { text: "Montants financés (€)" },
    }
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", [], "", "", "bubble"), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="dispersion">
      {isLoading ? <DefaultSkeleton height={ String(options?.chart?.height) } /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
}
