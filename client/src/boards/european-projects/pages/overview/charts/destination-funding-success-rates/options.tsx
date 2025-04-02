import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import { formatToRates } from "../../../../../../utils/format";

export default function Options(data) {
  if (!data) return null;

  // const rootStyles = getComputedStyle(document.documentElement);

  const newOptions: HighchartsInstance.Options = {
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
    // tooltip: {
    //   pointFormatter: function () {
    //     return `Total des subventions : <b>${formatToMillions(
    //       this.y ?? 0
    //     )}</b>`;
    //   },
    // },
    plotOptions: {
      series: {
        dataLabels: { enabled: true },
      },
    },
    series: [
      {
        type: "bar",
        name: "Taux de succès",
        color: "#2ba241",
        groupPadding: 0,
        data: data.successRateByDestination.map((item) => [
          item.destination,
          item.successRate,
        ]),
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
