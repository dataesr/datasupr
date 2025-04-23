import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import { formatToMillions } from "../../../../../../utils/format";

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
        return `Total des subventions : <b>${formatToMillions(
          this.y ?? 0
        )}</b>`;
      },
    },
    plotOptions: {
      series: {
        dataLabels: { enabled: true },
      },
      // bar: {
      //   pointWidth: 50,
      // },
    },
    series: [
      {
        type: "bar",
        name: "Projets évalués",
        color: rootStyles.getPropertyValue("--evaluated-project-color"),
        groupPadding: 0,
        data: data.data
          .filter((item) => item.stage === "evaluated")
          .map((item) => [item.thema_name_fr, item.total_fund_eur]),
        dataLabels: {
          formatter: function () {
            return formatToMillions(this.y ?? 0);
          },
        },
      },
      {
        type: "bar",
        name: "Projets lauréats",
        color: rootStyles.getPropertyValue("--successful-project-color"),
        groupPadding: 0,
        data: data.data
          .filter((item) => item.stage === "successful")
          .map((item) => [item.thema_name_fr, item.total_fund_eur]),
        dataLabels: {
          formatter: function () {
            return formatToMillions(this.y ?? 0);
          },
        },
      },
    ],
  };

  return CreateChartOptions("bar", newOptions);
}
