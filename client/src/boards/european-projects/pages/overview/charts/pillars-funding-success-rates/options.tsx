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
        text: "%",
      },
      gridLineColor: "#5f5f5f",
      gridLineWidth: 0.5,
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
        pointWidth: 25,
        borderWidth: 0,
        borderRadius: 0,
      },
    },
    series: [
      {
        type: "bar",
        name: "Taux de succès",
        color: {
          linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
          stops: [
            [0, "#1f8d49"],
            [1, "#0d4a24"],
          ],
        },
        groupPadding: 0,
        data: data.successRateByPillar.map((item) => ({
          name: item.pillar,
          y: item.successRate,
        })),
        dataLabels: [
          {
            formatter: function () {
              return this.name;
            },
            inside: true,
            align: "left",
          },
          {
            formatter: function () {
              return formatToRates(this.y ?? 0);
            },
            inside: false,
            align: "right",
          },
        ],
      },
    ],
  };

  return CreateChartOptions("bar", newOptions);
}
