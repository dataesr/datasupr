import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

export function createCategoryChartOptions(
  categories: string[],
  maleData: number[],
  femaleData: number[]
): Highcharts.Options {
  return createChartOptions("bar", {
    chart: {
      height: Math.max(220, categories.length * 44),
    },
    xAxis: {
      categories,
      title: { text: null },
    },
    yAxis: { visible: false, min: 0, max: 100 },
    plotOptions: {
      bar: {
        stacking: "percent",
        borderWidth: 0,
        borderRadius: 0,
        pointWidth: 28,
        dataLabels: {
          enabled: true,
          format: "{point.percentage:.0f}\u00a0%",
          style: {
            fontSize: "10px",
            fontWeight: "bold",
            textOutline: "none",
            color: getCssColor("text-inverted-grey"),
          },
          filter: { property: "percentage", operator: ">", value: 8 },
        },
      },
    },
    tooltip: {
      shared: true,
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormat:
        '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y:,.0f}</b> ({point.percentage:.1f}\u00a0%)<br/>',
    },
    legend: {
      enabled: true,
      reversed: true,
      itemStyle: { fontSize: "11px", fontWeight: "normal" },
    },
    series: [
      {
        type: "bar",
        name: "Hommes",
        data: maleData,
        color: getCssColor("fm-hommes"),
      },
      {
        type: "bar",
        name: "Femmes",
        data: femaleData,
        color: getCssColor("fm-femmes"),
      },
    ],
  });
}
