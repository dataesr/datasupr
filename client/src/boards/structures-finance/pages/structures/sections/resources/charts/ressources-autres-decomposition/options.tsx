import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../../../constants/colors";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";

interface EvolutionDataItem {
  exercice: number;
  subventions_de_la_region?: number;
  subventions_union_europeenne?: number;
  autres_subventions?: number;
  autres_ressources_propres?: number;
  part_subventions_de_la_region?: number;
  part_subventions_union_europeenne?: number;
  part_autres_subventions?: number;
  part_autres_ressources_propres?: number;
}

export const AUTRES_CATEGORIES = [
  {
    valueKey: "subventions_de_la_region",
    partKey: "part_subventions_de_la_region",
    label: "Subventions de la région",
    color: CHART_COLORS.palette[7],
  },
  {
    valueKey: "subventions_union_europeenne",
    partKey: "part_subventions_union_europeenne",
    label: "Subventions Union Européenne",
    color: CHART_COLORS.palette[8],
  },
  {
    valueKey: "autres_subventions",
    partKey: "part_autres_subventions",
    label: "Autres subventions",
    color: CHART_COLORS.palette[10],
  },
  {
    valueKey: "autres_ressources_propres",
    partKey: "part_autres_ressources_propres",
    label: "Autres ressources propres",
    color: CHART_COLORS.palette[9],
  },
];

export const createRessourcesAutresDecompositionChartOptions = (
  data: EvolutionDataItem[],
  mode: "value" | "percentage" = "value"
): Highcharts.Options => {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);
  const years = sortedData.map((d) => String(d.exercice));

  const series: Highcharts.SeriesColumnOptions[] = AUTRES_CATEGORIES.map(
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
