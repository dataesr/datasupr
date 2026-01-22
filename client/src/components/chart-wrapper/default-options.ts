import HighchartsInstance from "highcharts";

/**
 * From : https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 *
 * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).
 */
function deepMerge(target, source) {
  const isObject = (obj) => obj && typeof obj === "object";
  if (!isObject(target) || !isObject(source)) {
    return source;
  }
  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = deepMerge(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  return target;
};

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
      itemStyle: {
        color: labelColor,
      },
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "var(--background-default-grey)",
      borderColor: "var(--border-default-grey)",
      borderWidth: 1,
      style: {
        color: labelColor,
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
        gridLineColor: "var(--border-default-grey)",
        labels: {
          autoRotation: [-45, -90],
          style: axisLabelStyle,
        },
        title: axisTitleStyle,
      };
    });
  } else {
    defaultOptions.xAxis = {
      gridLineColor: "var(--border-default-grey)",
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
        gridLineColor: "var(--border-default-grey)",
        labels: {
          style: axisLabelStyle,
        },
        title: axisTitleStyle,
      };
    });
  } else {
    defaultOptions.yAxis = {
      gridLineColor: "var(--border-default-grey)",
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
