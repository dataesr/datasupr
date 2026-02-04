import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../../../constants/colors";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";

interface EvolutionDataItem {
  exercice: number;
  valorisation?: number;
  anr_investissements_d_avenir?: number;
  anr_hors_investissements_d_avenir?: number;
  contrats_et_prestations_de_recherche_hors_anr?: number;
  part_valorisation?: number;
  part_anr_investissements_d_avenir?: number;
  part_anr_hors_investissements_d_avenir?: number;
  part_contrats_et_prestations_de_recherche_hors_anr?: number;
}

export const RECHERCHE_CATEGORIES = [
  {
    valueKey: "valorisation",
    partKey: "part_valorisation",
    label: "Valorisation",
    color: CHART_COLORS.palette[3],
  },
  {
    valueKey: "anr_hors_investissements_d_avenir",
    partKey: "part_anr_hors_investissements_d_avenir",
    label: "ANR hors investissements d'avenir",
    color: CHART_COLORS.palette[4],
  },
  {
    valueKey: "anr_investissements_d_avenir",
    partKey: "part_anr_investissements_d_avenir",
    label: "ANR investissements d'avenir",
    color: CHART_COLORS.palette[5],
  },
  {
    valueKey: "contrats_et_prestations_de_recherche_hors_anr",
    partKey: "part_contrats_et_prestations_de_recherche_hors_anr",
    label: "Contrats et prestations de recherche hors ANR",
    color: CHART_COLORS.palette[6],
  },
];

export const createRessourcesRechercheDecompositionChartOptions = (
  data: EvolutionDataItem[],
  mode: "value" | "percentage" = "value"
): Highcharts.Options => {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);
  const years = sortedData.map((d) => String(d.exercice));

  const series: Highcharts.SeriesColumnOptions[] = RECHERCHE_CATEGORIES.map(
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
