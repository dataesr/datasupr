import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import { formatToRates } from "../../../../../../utils/format";

export default function Options(data) {
  if (!data) return null;

  const rootStyles = getComputedStyle(document.documentElement);

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
    tooltip: {
      pointFormatter: function () {
        return `Taux de succès : <b>${formatToRates(this.y ?? 0)}</b>`;
      },
    },
    plotOptions: {
      series: {
        dataLabels: { enabled: true },
      },
      bar: {
        pointWidth: 50,
      },
    },
    series: [
      {
        type: "bar",
        name: "Taux de succès",
        color: rootStyles.getPropertyValue("--successRate-color"),
        groupPadding: 0,
        data: data.successRateByPillar.map((item) => [
          item.pillar,
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
