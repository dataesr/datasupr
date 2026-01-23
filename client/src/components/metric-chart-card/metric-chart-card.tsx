import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import { DSFR_COLORS } from "../../boards/structures-finance/constants/colors";

interface MetricChartCardProps {
  title: string;
  value: string | React.ReactNode;
  detail?: string;
  color?: string;
  evolutionData?: Array<{ exercice: number; value: number }>;
  unit?: string;
}

export function MetricChartCard({
  title,
  value,
  detail,
  color = "var(--blue-france-sun-113)",
  evolutionData,
  unit = "",
}: MetricChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Highcharts.Chart | null>(null);

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
        margin: [0, -40, 0, -45],
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
          } else {
            formattedValue = val.toLocaleString("fr-FR", {
              maximumFractionDigits: 1,
            });
          }
          return `<b>${year}</b><br/>${formattedValue}`;
        },
      },
      series: [
        {
          type: "areaspline",
          name: title,
          data: values,
          accessibility: {
            description: `${title}: Évolution de ${years[0]} à ${
              years[years.length - 1]
            }`,
          },
        },
      ],
      accessibility: {
        enabled: true,
        description: `Graphique montrant l'évolution de ${title} sur la période ${
          years[0]
        }-${years[years.length - 1]}`,
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [evolutionData, color, title, unit]);

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
  const chartHeight = 100;

  return (
    <div
      className="fr-card"
      tabIndex={0}
      role="article"
      aria-label={`${title}: ${value}${detail ? `, ${detail}` : ""}`}
      style={{
        height: "100%",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
        backgroundColor: DSFR_COLORS.backgroundAlt,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="fr-card__body fr-p-2w"
        style={{
          flex: "1 1 auto",
          order: 1,
        }}
      >
        <div className="fr-card__content">
          <p
            className="fr-text--sm fr-text--bold fr-mb-1v"
            style={{
              color: DSFR_COLORS.textDefault,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </p>
          <p className="fr-h5 fr-mb-1v" style={{ pointerEvents: "auto" }}>
            {value}
          </p>
          {detail && (
            <p
              className="fr-text--sm"
              style={{
                color: DSFR_COLORS.textDefault,
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
          ref={chartRef}
          style={{
            width: "100%",
            height: `${chartHeight}px`,
            flex: "0 0 auto",
            order: 2,
            marginBottom: -1,
          }}
        />
      )}
    </div>
  );
}
