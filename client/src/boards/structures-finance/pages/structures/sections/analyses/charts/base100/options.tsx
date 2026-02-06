import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { calculateOptimalTickInterval } from "../../../../../../utils/chartUtils";

interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
  color: string;
}

export const createBase100ChartOptions = (
  data: any[],
  selectedMetrics: string[],
  metricsConfig: Record<string, MetricConfig>,
  xAxisField: "exercice" | "anuniv"
): Highcharts.Options => {
  const sortedData = [...data]
    .sort((a, b) => a.exercice - b.exercice)
    .filter((item) =>
      selectedMetrics.some((metric) => {
        const value = item[metric];
        return value != null && value !== 0;
      })
    );

  const baseValues: Record<string, number> = {};
  selectedMetrics.forEach((metricKey) => {
    const firstValue = sortedData[0][metricKey];
    if (typeof firstValue === "number" && firstValue !== 0) {
      baseValues[metricKey] = firstValue;
    }
  });

  const series = selectedMetrics.map((metricKey) => {
    const config = metricsConfig[metricKey];
    // En base 100, on retire les mentions "prix courant" / "prix constant"
    const cleanLabel = config.label
      .replace(/\s*\(à\sprix\scourants?\)/gi, "")
      .replace(/\s*\(à\sprix\sconstants?\)/gi, "")
      .replace(/\s*à\sprix\scourants?/gi, "")
      .replace(/\s*à\sprix\sconstants?/gi, "")
      .trim();

    return {
      name: cleanLabel,
      data: sortedData.map((item) => {
        const value = Number(item[metricKey]);
        if (isNaN(value) || !baseValues[metricKey]) return null;
        return (value / baseValues[metricKey]) * 100;
      }),
      color: config.color,
      lineWidth: 2,
      marker: {
        enabled: true,
        radius: 4,
        symbol: "circle",
      },
      type: "line" as const,
    };
  });

  let dataMin = Infinity,
    dataMax = -Infinity;
  series.forEach((s) => {
    s.data.forEach((val) => {
      if (val !== null) {
        dataMin = Math.min(dataMin, val);
        dataMax = Math.max(dataMax, val);
      }
    });
  });

  const tickInterval = calculateOptimalTickInterval(
    dataMin,
    dataMax,
    "decimal"
  );

  return createChartOptions("line", {
    chart: {
      height: 500,
    },
    xAxis: {
      categories: sortedData.map((item) => String(item[xAxisField])),
      title: {
        text: xAxisField === "anuniv" ? "Année universitaire" : "Exercice",
      },
      crosshair: true,
      lineWidth: 1,
    },
    yAxis: {
      title: {
        text: "Index (base 100 = première année)",
      },
      tickInterval: tickInterval,
      labels: {
        formatter: function (this: any) {
          return this.value.toFixed(1);
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      borderWidth: 1,
      borderRadius: 8,
      shadow: false,
      formatter: function () {
        const year = this.points?.[0]?.key || this.x;
        const yearIndex = sortedData.findIndex(
          (d) => String(d[xAxisField]) === String(year)
        );
        const etablissement =
          yearIndex >= 0 ? sortedData[yearIndex].etablissement_lib || "" : "";
        let tooltip = `<div style="padding:10px"><div style="font-weight:bold;margin-bottom:8px">${etablissement}</div>`;

        this.points?.forEach((point: any) => {
          const metricKey = selectedMetrics.find((key) => {
            const cleanLabel = metricsConfig[key].label
              .replace(/\s*\(à\sprix\scourants?\)/gi, "")
              .replace(/\s*\(à\sprix\sconstants?\)/gi, "")
              .replace(/\s*à\sprix\scourants?/gi, "")
              .replace(/\s*à\sprix\sconstants?/gi, "")
              .trim();
            return cleanLabel === point.series.name;
          });
          const config = metricKey ? metricsConfig[metricKey] : null;

          let valueStr = `${point.y.toFixed(1)} (base 100)`;

          if (yearIndex >= 0 && metricKey && config) {
            const originalValue = sortedData[yearIndex][metricKey];
            if (originalValue !== null) {
              let originalStr = "";
              if (config.format === "euro") {
                originalStr = `${Highcharts.numberFormat(
                  originalValue,
                  0,
                  ",",
                  " "
                )} €`;
              } else if (config.format === "percent") {
                originalStr = `${originalValue.toFixed(2)}%`;
              } else if (config.format === "decimal") {
                originalStr = originalValue.toFixed(2);
              } else {
                originalStr = Highcharts.numberFormat(
                  originalValue,
                  0,
                  ",",
                  " "
                );
              }
              valueStr += `<br/><span style="font-size:11px">${originalStr}</span>`;
            }
          }

          tooltip += `<div style="margin-top:4px">
            <span style="color:${point.series.color}">●</span> 
            <strong>${point.series.name}:</strong> ${valueStr}
          </div>`;
        });

        tooltip += `</div>`;
        return tooltip;
      },
    },
    legend: {
      enabled: selectedMetrics.length > 1,
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "var(--text-default-grey)",
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4,
        },
        lineWidth: 2,
      },
    },
    series: series as any,
  });
};
