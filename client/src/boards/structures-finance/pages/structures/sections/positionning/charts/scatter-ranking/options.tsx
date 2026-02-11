import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";

export function createRankingScatterOptions(
  rank: number,
  total: number,
  currentStructureName?: string
) {
  const mediane = Math.ceil(total * 0.5);

  return createChartOptions("scatter", {
    chart: {
      height: 100,
      marginBottom: 50,
      marginTop: 20,
      spacingLeft: 10,
      spacingRight: 10,
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
      min: 1,
      max: total,
      title: { text: undefined },
      labels: {
        formatter() {
          const v = this.value as number;
          if (v === 1) return "1<sup>er</sup>";
          if (v === mediane)
            return `${mediane}<sup>e</sup><br/><span style="font-size: 10px; color: var(--text-mention-grey);">(Médiane)</span>`;
          if (v === total) return `${total}<sup>e</sup>`;
          return "";
        },
        style: {
          fontSize: "12px",
          fontWeight: "600",
          color: "var(--text-default-grey)",
        },
        useHTML: true,
      },
      tickPositions: [1, mediane, total],
      lineWidth: 0,
      tickWidth: 0,
      gridLineWidth: 0,
    },
    yAxis: {
      visible: false,
      min: -1,
      max: 1,
      gridLineWidth: 0,
    },
    tooltip: {
      useHTML: true,
      borderWidth: 0,
      borderRadius: 8,
      backgroundColor: "var(--background-default-grey)",
      padding: 12,
      formatter() {
        return `
          <div style="font-family: Marianne, arial, sans-serif;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: var(--text-default-grey);">
              ${currentStructureName || "Structure actuelle"}
            </div>
            <div style="font-size: 13px; color: var(--text-mention-grey);">
              Position : <strong style="color: var(--text-label-blue-france);">${rank}<sup>${rank === 1 ? "er" : "e"}</sup></strong> / ${total}
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      series: { enableMouseTracking: true },
    },

    legend: { enabled: false },
    series: [
      {
        name: "Trait de positionnement",
        type: "line",
        data: [
          [1, 0],
          [total, 0],
        ],
        color: "var(--border-default-grey)",
        lineWidth: 3,
        marker: { enabled: false },
        enableMouseTracking: false,
        zIndex: 1,
      },
      {
        name: currentStructureName || "Structure actuelle",
        type: "scatter",
        data: [
          { x: rank, y: 0, name: currentStructureName || "Structure actuelle" },
        ],
        color: "var(--background-default-grey)",
        marker: {
          radius: 20,
          lineWidth: 3,
          lineColor: "var(--background-action-high-blue-france)",
          symbol: "circle",
        },
        dataLabels: {
          enabled: true,
          format: `${rank}`,
          align: "center",
          verticalAlign: "middle",
          y: 0,
          style: {
            fontSize: "13px",
            fontWeight: "700",
            color: "var(--text-label-blue-france)",
            textOutline: "none",
          },
        },
        zIndex: 1000,
      },
    ],
  });
}
