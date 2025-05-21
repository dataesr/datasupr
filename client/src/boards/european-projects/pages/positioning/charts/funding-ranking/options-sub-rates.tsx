import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";

export default function Options(data, currentLang) {
  if (!data) return null;

  const rootStyles = getComputedStyle(document.documentElement);
  const newOptions: HighchartsInstance.Options = {
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
        type: "column",
        // name: "Total subventions en euros",
        colors: [rootStyles.getPropertyValue("--evaluated-project-color")],
        colorByPoint: true,
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
        type: "column",
        // name: "Total subventions en euros",
        colors: [rootStyles.getPropertyValue("--successful-project-color")],
        colorByPoint: true,
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
