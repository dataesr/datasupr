import { useEffect, useRef } from "react";
import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
import { BUDGET_SENSITIVE_METRICS } from "../../../components/budget-warning/budgetIndicators";
import { getCssColor } from "../../../../../utils/colors";
import { Title } from "@dataesr/dsfr-plus";

interface MetricChartCardProps {
  title: string;
  value: string | React.ReactNode;
  detail?: string;
  color?: string;
  evolutionData?: Array<{
    exercice: number;
    value: number;
    sanfin_source?: string;
    anuniv?: number;
  }>;
  unit?: string;
  metricKey?: string;
  titleAs?: "h2" | "h3" | "h4" | "h5" | "h6";
}

export function MetricChartCard({
  title,
  value,
  detail,
  color = getCssColor("blue-france"),
  evolutionData,
  unit = "",
  metricKey,
  titleAs = "h2",
}: MetricChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Highcharts.Chart | null>(null);

  const hasBudgetData =
    metricKey &&
    BUDGET_SENSITIVE_METRICS.has(metricKey) &&
    evolutionData?.some((item) => item.sanfin_source === "Budget");

  const displayTitle = hasBudgetData ? `${title} (budget)` : title;

  useEffect(() => {
    if (!chartRef.current || !evolutionData || evolutionData.length === 0)
      return;

    const years = evolutionData.map((item) => String(item.exercice));
    const values = evolutionData.map((item) => item.value);

    const resolvedColor = color.startsWith("var(")
      ? getComputedStyle(document.documentElement)
        .getPropertyValue(color.slice(4, -1))
        .trim()
      : color;

    chartInstance.current = Highcharts.chart({
      chart: {
        renderTo: chartRef.current,
        type: "areaspline",
        height: 80,
        backgroundColor: "transparent",
        margin: [2, -45, 2, -45],
        spacing: [0, 0, 0, 0],
      },
      title: {
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: years,
        visible: false,
        labels: {
          enabled: false,
        },
        lineWidth: 0,
        tickLength: 0,
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickmarkPlacement: "on",
      },
      yAxis: {
        visible: false,
        title: {
          text: undefined,
        },
        labels: {
          enabled: false,
        },
        gridLineWidth: 0,
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        areaspline: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [
                0,
                Highcharts.color(resolvedColor)
                  .setOpacity(0.8)
                  .get("rgba") as string,
              ],
              [
                0.4,
                Highcharts.color(resolvedColor)
                  .setOpacity(0.15)
                  .get("rgba") as string,
              ],
              [
                1,
                Highcharts.color(resolvedColor)
                  .setOpacity(0.02)
                  .get("rgba") as string,
              ],
            ],
          },
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 4,
                fillColor: resolvedColor,
                lineWidth: 2,
                lineColor: "#fff",
              },
            },
          },
          lineWidth: 3,
          lineColor: resolvedColor,
          states: {
            hover: {
              lineWidth: 3,
            },
          },
          threshold: null,
          enableMouseTracking: true,
          stickyTracking: true,
          trackByArea: true,
        },
      },
      exporting: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        useHTML: true,
        outside: true,
        backgroundColor: "var(--background-contrast-grey)",
        borderColor: "var(--border-default-grey)",
        style: {
          color: "var(--text-default-grey)",
          zIndex: 9999,
        },
        positioner: function (labelWidth, labelHeight, point) {
          const chart = this.chart;
          let x = point.plotX + chart.plotLeft - labelWidth / 2;
          let y = point.plotY + chart.plotTop - labelHeight - 10;

          if (x < 5) x = 5;
          if (x + labelWidth > chart.chartWidth - 5)
            x = chart.chartWidth - labelWidth - 5;
          if (y < 5) y = point.plotY + chart.plotTop + 10;

          return { x, y };
        },
        formatter: function () {
          const val = this.y as number;
          const year = years[this.index];
          let formattedValue = "";
          if (unit === "€") {
            formattedValue =
              val.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";
          } else if (unit === "%") {
            formattedValue = val.toFixed(1) + " %";
          } else if (unit) {
            formattedValue =
              val.toLocaleString("fr-FR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
              }) +
              " " +
              unit;
          } else {
            formattedValue = val.toLocaleString("fr-FR", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 1,
            });
          }
          return `<b>${year}</b><br/>${formattedValue}`;
        },
      },
      series: [
        {
          type: "areaspline",
          name: displayTitle,
          data: values,
        },
      ],
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [evolutionData, color, displayTitle, unit]);

  // const trend =
  //   evolutionData && evolutionData.length >= 2 && evolutionData[0].value !== 0
  //     ? ((evolutionData[evolutionData.length - 1].value -
  //         evolutionData[0].value) /
  //         evolutionData[0].value) *
  //       100
  //     : null;

  // const trendFormatted =
  //   trend !== null && isFinite(trend)
  //     ? `${trend > 0 ? "+" : ""}${trend.toFixed(1)}%`
  //     : null;

  const hasChart = evolutionData && evolutionData.length > 0;

  return (
    <div
      className="fr-card"
      role="article"
      aria-label={`${displayTitle}: ${value}${detail ? `, ${detail}` : ""}`}
      style={{
        height: "100%",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        paddingBottom: 0,
      }}
    >
      <div
        className="fr-card__body fr-p-2w"
        style={{
        }}
      >
        <div >
          <Title
            className="fr-card__title fr-text--sm fr-text--bold fr-mb-1v"
            as={titleAs}
            style={{ color: "var(--text-active-blue-france)", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            {displayTitle}
          </Title>
          <p className="fr-h5 fr-mb-1v" style={{ pointerEvents: "auto" }}>
            {value}
          </p>
          {detail && (
            <p
              className="fr-text--sm"
              style={{
                color: "var(--text-default-grey)",
                margin: 0,
              }}
            >
              {detail}
            </p>
          )}
        </div>
      </div>

      {hasChart && (
        <div
          style={{
            position: "relative",
            flex: "0 0 auto",
            order: 2,
          }}
        >
          <div
            ref={chartRef}
            aria-hidden="true"
            style={{
              width: "100%",
            }}
          />
          {evolutionData && evolutionData.length >= 2 && (
            <div
              style={{
                position: "absolute",
                bottom: 2,
                left: 8,
                right: 8,
                display: "flex",
                justifyContent: "space-between",
                pointerEvents: "none",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "10px", color: "var(--text-mention-grey)" }}>
                {evolutionData[0].exercice}
              </span>
              <span style={{ fontWeight: "bold", fontSize: "10px", color: "var(--text-mention-grey)" }}>
                {evolutionData[evolutionData.length - 1].exercice}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
