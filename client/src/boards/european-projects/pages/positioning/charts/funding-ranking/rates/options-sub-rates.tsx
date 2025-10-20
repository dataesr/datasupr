import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../../components/chart-ep";

export default function Options(data, currentLang) {
  if (!data) return null;

  const rootStyles = getComputedStyle(document.documentElement);
  const newOptions: HighchartsInstance.Options = {
    legend: {
      enabled: true,
      layout: "horizontal",
    },
    xAxis: {
      type: "category",
    },
    yAxis: [
      {
        min: 0,
        title: {
          text: "%",
        },
      },
    ],
    tooltip: {
      pointFormat: "Part des subventions : <b>{point.y:.2f} %</b>",
    },
    plotOptions: {
      series: { dataLabels: { enabled: true } },
    },
    series: [
      {
        name: "Projets évalués",
        type: "column",
        color: rootStyles.getPropertyValue("--evaluated-project-color"),
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}`],
          y: parseFloat(item.total_evaluated_ratio),
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
        name: "Projets lauréats",
        type: "column",
        color: rootStyles.getPropertyValue("--successful-project-color"),
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}`],
          y: parseFloat(item.total_successful_ratio),
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

  return CreateChartOptions("column", newOptions);
}
