import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import { formatToPercent } from "../../../../../../utils/format";

export default function Options(data) {
  if (!data) return null;

  const rootStyles = getComputedStyle(document.documentElement);

  const newOptions: HighchartsInstance.Options = {
    legend: { enabled: true },
    xAxis: {
      type: "category",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Euros € (millions)",
      },
    },
    tooltip: {
      pointFormatter: function () {
        return `Part des subventions : <b>${formatToPercent(this.y ?? 0)}%</b>`;
      },
    },
    plotOptions: {
      series: {
        dataLabels: { enabled: true },
      },
    },
    series: [
      {
        type: "column",
        name: "Projets évalués",
        color: rootStyles.getPropertyValue("--evaluated-project-color"),
        groupPadding: 0,
        data: data.data
          .filter((item) => item.stage === "evaluated")
          .map((item) => [item.destination, item.proportion]),
        dataLabels: {
          formatter: function () {
            return formatToPercent(this.y ?? 0);
          },
        },
      },
      {
        type: "column",
        name: "Projets lauréats",
        color: rootStyles.getPropertyValue("--successful-project-color"),
        groupPadding: 0,
        data: data.data
          .filter((item) => item.stage === "successful")
          .map((item) => [item.destination, item.proportion]),
        dataLabels: {
          formatter: function () {
            return formatToPercent(this.y ?? 0);
          },
        },
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}
