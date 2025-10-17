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
        name: "Projets évalués",
        color: rootStyles.getPropertyValue("--evaluated-project-color"),
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}`],
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
        name: "Projets lauréats",
        color: rootStyles.getPropertyValue("--successful-project-color"),
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}`],
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
