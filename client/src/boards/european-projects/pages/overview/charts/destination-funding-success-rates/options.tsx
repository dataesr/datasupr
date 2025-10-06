import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import { formatToRates } from "../../../../../../utils/format";

export default function Options(data) {
  if (!data) return null;

  const rootStyles = getComputedStyle(document.documentElement);
  const height = data.data.length * 50;

  const newOptions: HighchartsInstance.Options = {
    chart: { height: height },
    legend: { enabled: true },
    xAxis: {
      labels: {
        enabled: false,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Taux de succès",
      },
    },
    tooltip: {
      pointFormatter: function () {
        return `Taux de succès : <b>${formatToRates(this.y ?? 0)}</b>`;
      },
    },
    plotOptions: {
      series: {
        dataLabels: { enabled: true },
      },
    },
    series: [
      {
        type: "bar",
        name: "Taux de succès",
        color: rootStyles.getPropertyValue("--successRate-color"),
        groupPadding: 0,
        data: data.successRateByDestination.map((item) => [item.destination, item.successRate]),
        dataLabels: {
          formatter: function () {
            return formatToRates(this.y ?? 0);
          },
        },
      },
    ],
  };

  return CreateChartOptions("bar", newOptions);
}
