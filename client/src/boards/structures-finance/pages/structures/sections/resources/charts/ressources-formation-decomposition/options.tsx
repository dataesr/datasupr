import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../../../constants/colors";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";

interface EvolutionDataItem {
  exercice: number;
  droits_d_inscription?: number;
  formation_continue_diplomes_propres_et_vae?: number;
  taxe_d_apprentissage?: number;
  part_droits_d_inscription?: number;
  part_formation_continue_diplomes_propres_et_vae?: number;
  part_taxe_d_apprentissage?: number;
}

const FORMATION_CATEGORIES = [
  {
    valueKey: "droits_d_inscription",
    partKey: "part_droits_d_inscription",
    label: "Droits d'inscription",
    color: CHART_COLORS.palette[0],
  },
  {
    valueKey: "formation_continue_diplomes_propres_et_vae",
    partKey: "part_formation_continue_diplomes_propres_et_vae",
    label: "Formation continue et VAE",
    color: CHART_COLORS.palette[1],
  },
  {
    valueKey: "taxe_d_apprentissage",
    partKey: "part_taxe_d_apprentissage",
    label: "Taxe d'apprentissage",
    color: CHART_COLORS.palette[2],
  },
];

export { FORMATION_CATEGORIES };

export const createRessourcesFormationDecompositionChartOptions = (
  data: EvolutionDataItem[],
  mode: "value" | "percentage" = "value"
): Highcharts.Options => {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);
  const years = sortedData.map((d) => String(d.exercice));

  const series: Highcharts.SeriesColumnOptions[] = FORMATION_CATEGORIES.map(
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
