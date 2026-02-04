import Highcharts from "highcharts";
import { METRIC_COLORS } from "../../../../../../constants/colors";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";

interface EvolutionDataItem {
  exercice: number;
  tot_ress_formation?: number;
  tot_ress_recherche?: number;
  tot_ress_autres_recette?: number;
  part_ress_formation?: number;
  part_ress_recherche?: number;
  part_ress_autres_recette?: number;
}

const DECOMPOSITION_CATEGORIES = [
  {
    valueKey: "tot_ress_formation",
    partKey: "part_ress_formation",
    label: "Formation",
    color: METRIC_COLORS.droitsInscription,
  },
  {
    valueKey: "tot_ress_recherche",
    partKey: "part_ress_recherche",
    label: "Recherche",
    color: METRIC_COLORS.contratsRecherche,
  },
  {
    valueKey: "tot_ress_autres_recette",
    partKey: "part_ress_autres_recette",
    label: "Autres recettes",
    color: METRIC_COLORS.subventionsUE,
  },
];

export { DECOMPOSITION_CATEGORIES };

export const createRessourcesPropresDecompositionChartOptions = (
  data: EvolutionDataItem[],
  mode: "value" | "percentage" = "value"
): Highcharts.Options => {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);
  const years = sortedData.map((d) => String(d.exercice));

  const series: Highcharts.SeriesColumnOptions[] = DECOMPOSITION_CATEGORIES.map(
    (cat) => ({
      type: "column" as const,
      name: cat.label,
      color: cat.color,
      data: sortedData.map((d) => {
        const key = mode === "percentage" ? cat.partKey : cat.valueKey;
        return (d as any)[key] || 0;
      }),
    })
  );

  return createChartOptions("column", {
    chart: {
      type: "column",
      height: 450,
    },
    xAxis: {
      categories: years,
      title: {
        text: "Exercice",
      },
    },
    yAxis: {
      min: 0,
      max: mode === "percentage" ? 100 : undefined,
      title: {
        text: mode === "percentage" ? "Part (%)" : "Montant (€)",
      },
      stackLabels: {
        enabled: false,
      },
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
        },
      },
    },
    tooltip: {
      shared: true,
      formatter: function () {
        const points = this.points || [];
        const year = points[0]?.key || this.x;
        let s = `<b>${year}</b><br/>`;
        let total = 0;

        points.forEach((point) => {
          const value = point.y || 0;
          total += value;
          s += `<span style="color:${point.color}">●</span> ${point.series.name}: `;
          if (mode === "percentage") {
            s += `<b>${Highcharts.numberFormat(value, 1, ",", " ")} %</b><br/>`;
          } else {
            s += `<b>${Highcharts.numberFormat(value, 0, ",", " ")} €</b><br/>`;
          }
        });

        if (mode === "value") {
          s += `<br/>Total: <b>${Highcharts.numberFormat(total, 0, ",", " ")} €</b>`;
        }

        return s;
      },
    },
    series: series as any,
  });
};
