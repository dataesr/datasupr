import HighchartsInstance from "highcharts";

function deepMerge(obj1, obj2) {
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (obj2[key] instanceof Object && obj1[key] instanceof Object) {
        obj1[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        obj1[key] = obj2[key];
      }
    }
  }
  return obj1;
}

export function CreateChartOptions(
  type: NonNullable<HighchartsInstance.Options["chart"]>["type"],
  options: NonNullable<HighchartsInstance.Options>
) {
  const rootStyles = getComputedStyle(document.documentElement);

  const defaultOptions: HighchartsInstance.Options = {
    chart: {
      backgroundColor: "transparent",
    },
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
  };

  if (type !== "empty") {
    if (defaultOptions.chart) {
      defaultOptions.chart.type = type;
    }
  }

  const chartOptions = deepMerge(defaultOptions, options);

  return chartOptions;
}
