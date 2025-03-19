import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";

export default function Options(data) {
  if (!data) return null;

  const rootStyles = getComputedStyle(document.documentElement);
  // TODO : fix double "values" label
  const newOptions: HighchartsInstance.Options = {
    xAxis: {
      type: "category",
    },
    yAxis: [
      {
        min: 0,
        title: {
          text: "Euros € (millions)",
        },
      },
    ],
    tooltip: {
      pointFormat: "Total des subventions : <b>{point.y:.1f} €</b>",
    },
    plotOptions: {
      series: { dataLabels: { enabled: true } },
    },
    series: [
      {
        type: "bar",
        name: "Total subventions en euros",
        colors: [rootStyles.getPropertyValue("--evaluated-project-color")],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item.name,
          y: item.total_evaluated,
          rank_evaluated: item.rank_evaluated,
        })),
        dataLabels: [
          {
            align: "right",
            format: "{point.rank_evaluated}e",
          },
        ],
      },
      {
        type: "bar",
        name: "Total subventions en euros",
        colors: [rootStyles.getPropertyValue("--successful-project-color")],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item.name,
          y: item.total_successful,
          rank_successful: item.rank_successful,
        })),
        dataLabels: [
          {
            align: "right",
            format: "{point.rank_successful}e",
          },
        ],
      },
    ],
  };

  return CreateChartOptions("bar", newOptions);
}
