import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

export function createGenderEvolutionOptions(
  categories: string[],
  maleData: number[],
  femaleData: number[]
): Highcharts.Options {
  return createChartOptions("column", {
    chart: { height: 350 },
    xAxis: {
      categories,
      title: { text: null },
      labels: { rotation: -45 },
    },
    yAxis: {
      min: 0,
      title: { text: "Effectif" },
      stackLabels: {
        enabled: true,
        format: "{total:,.0f}",
        style: { fontSize: "9px", fontWeight: "bold" },
      },
    },
    plotOptions: {
      column: { stacking: "normal", borderWidth: 0, borderRadius: 2 },
    },
    tooltip: {
      shared: true,
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormat:
        '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:,.0f}</b><br/>',
    },
    legend: {
      enabled: true,
      reversed: true,
      itemStyle: { fontSize: "11px", fontWeight: "normal" },
    },
    series: [
      {
        type: "column",
        name: "Hommes",
        data: maleData,
        color: getCssColor("fm-hommes"),
      },
      {
        type: "column",
        name: "Femmes",
        data: femaleData,
        color: getCssColor("fm-femmes"),
      },
    ],
  });
}
