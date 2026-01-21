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

export function createChartOptions(
  type: NonNullable<HighchartsInstance.Options["chart"]>["type"],
  options: NonNullable<HighchartsInstance.Options>
) {
  const rootStyles = getComputedStyle(document.documentElement);
  const labelColor = rootStyles.getPropertyValue("--text-default-grey").trim();

  const defaultOptions: HighchartsInstance.Options = {
    chart: {
      backgroundColor: rootStyles.getPropertyValue("--background-default-grey"),
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    title: {
      text: "",
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "var(--background-default-grey)",
      borderColor: "var(--border-default-grey)",
      borderWidth: 1,
      style: {
        color: "var(--text-default-grey)",
        zIndex: "999999",
        pointerEvents: "none",
      },
    },
    plotOptions: {
      series: {
        borderColor: "var(--border-default-grey)",
        states: {
          hover: {
            brightness: 0.1,
          },
        },
        dataLabels: {
          style: {
            textOutline: "none",
          },
          zIndex: 1,
        },
      },
    },
    exporting: { enabled: false },
    credits: { enabled: false },
  };

  const axisLabelStyle = {
    fontSize: "13px",
    fontFamily: "Marianne, sans-serif",
    color: labelColor,
  };

  const axisTitleStyle = {
    style: {
      color: labelColor,
    },
  };

  if (Array.isArray(options.xAxis) && options.xAxis.length > 0) {
    defaultOptions.xAxis = options.xAxis.map((axis) => {
      return {
        ...axis,
        labels: {
          autoRotation: [-45, -90],
          style: axisLabelStyle,
        },
        title: axisTitleStyle,
      };
    });
  } else {
    defaultOptions.xAxis = {
      labels: {
        autoRotation: [-45, -90],
        style: axisLabelStyle,
      },
      title: axisTitleStyle,
    };
  }

  if (Array.isArray(options.yAxis) && options.yAxis.length > 0) {
    defaultOptions.yAxis = options.yAxis.map((axis) => {
      return {
        ...axis,
        labels: {
          style: axisLabelStyle,
        },
        title: axisTitleStyle,
      };
    });
  } else {
    defaultOptions.yAxis = {
      labels: {
        style: axisLabelStyle,
      },
      title: axisTitleStyle,
    };
  }

  if (type !== "empty") {
    if (defaultOptions.chart) {
      defaultOptions.chart.type = type;
    }
  }

  const chartOptions = deepMerge(defaultOptions, options);

  return chartOptions;
}
