import HighchartsInstance from "highcharts";

import { deepMerge } from "../../../utils";


export function CreateChartOptions(
  type: NonNullable<HighchartsInstance.Options["chart"]>["type"],
  options: NonNullable<HighchartsInstance.Options>
) {
  const rootStyles = getComputedStyle(document.documentElement);

  const defaultOptions: HighchartsInstance.Options = {
    chart: {
      height: 500,
      backgroundColor: "transparent",
    },
    exporting: { enabled: false },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },
    xAxis: {
      labels: {
        autoRotation: [-45, -90],
        style: {
          fontSize: "13px",
          fontFamily: "Marianne, sans-serif",
          color: rootStyles.getPropertyValue("--label-color"),
        },
      },
    },
    yAxis: {
      labels: {
        style: {
          fontSize: "13px",
          fontFamily: "Marianne, sans-serif",
          color: rootStyles.getPropertyValue("--label-color"),
        },
      },
      title: {
        style: {
          fontSize: "16px",
          fontFamily: "Marianne, sans-serif",
          color: rootStyles.getPropertyValue("--label-color"),
        },
      },
    },
  };

  if (type !== "empty") {
    if (defaultOptions.chart) {
      defaultOptions.chart.type = type;
    }
  }

  const chartOptions = deepMerge(defaultOptions, options);

  return chartOptions;
}
