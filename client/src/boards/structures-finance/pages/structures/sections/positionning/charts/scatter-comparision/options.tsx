import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { formatMetricValue } from "../../../../../../utils/utils";

export interface ComparisonScatterConfig {
  title: string;
  metric: string;
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
}

export type ScatterDataset = {
  data: any[];
  label: string;
  color?: string;
};

const DATASET_COLORS = [
  "var(--background-action-high-blue-france)",
  "var(--background-action-high-error)",
  "var(--background-action-high-success)",
  "var(--background-action-high-warning)",
];

export function createComparisonScatterOptions(
  config: ComparisonScatterConfig,
  datasets: ScatterDataset[],
  currentStructureId?: string,
  currentStructureName?: string
) {
  if (!datasets?.length) return createChartOptions("scatter", {});

  const multiLine = datasets.length > 1;
  const series: any[] = [];

  datasets.forEach((dataset, index) => {
    const seen = new Set<string>();
    const yPos = multiLine ? index : 0;
    const color =
      dataset.color || DATASET_COLORS[index % DATASET_COLORS.length];

    const otherPoints: any[] = [];
    let currentPoint: any = null;

    dataset.data.forEach((item) => {
      const id = item.etablissement_id_paysage_actuel;
      if (!id || seen.has(id)) return;
      seen.add(id);

      const value = item[config.metric];
      if (value == null || value === 0) return;

      const point = {
        x: value,
        y: yPos,
        name:
          item.etablissement_actuel_lib || item.etablissement_lib || "Inconnu",
        region: item.etablissement_actuel_region || item.region,
        type: item.etablissement_actuel_type || item.type,
      };

      if (currentStructureId && id === currentStructureId) {
        currentPoint = point;
      } else {
        otherPoints.push(point);
      }
    });

    if (otherPoints.length > 0) {
      series.push({
        name: dataset.label,
        type: "scatter",
        data: otherPoints,
        color,
        opacity: 0.6,
        marker: { radius: 4 },
      });
    }

    if (currentPoint) {
      series.push({
        name: currentStructureName || currentPoint.name,
        type: "scatter",
        data: [currentPoint],
        color: "var(--background-action-high-blue-france)",
        showInLegend: false,
        opacity: 1,
        marker: {
          radius: 8,
          lineWidth: 2,
          lineColor: "var(--border-action-high-blue-france)",
          symbol: "circle",
        },
        zIndex: 1000,
      });
    }
  });

  return createChartOptions("scatter", {
    chart: {
      height: multiLine ? 120 + datasets.length * 40 : 150,
      marginBottom: multiLine ? 80 : 60,
      marginLeft: multiLine ? 150 : 60,
    },

    yAxis: {
      visible: multiLine,
      min: -0.5,
      max: multiLine ? datasets.length - 0.5 : 1,
      title: { text: undefined },
      labels: {
        enabled: multiLine,
        formatter() {
          const i = Math.round(this.value as number);
          return datasets[i]?.label || "";
        },
        style: { fontSize: "11px" },
      },
      gridLineWidth: multiLine ? 1 : 0,
      tickInterval: 1,
    },
    tooltip: {
      useHTML: true,
      borderWidth: 1,
      borderRadius: 8,
      shadow: false,
      formatter() {
        const point = this as any;
        return `
          <div class="fr-p-2w">
            <div class="fr-text--bold fr-mb-1v">${point.name}</div>
            <div class="fr-text--sm text-mention-grey fr-mb-1v">${point.type} • ${point.region}</div>
            <div class="fr-mt-1w fr-pt-1w" style="border-top:1px solid var(--border-default-grey)">
              <div><strong>${config.label}:</strong> ${formatMetricValue(point.x, config.format)}</div>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      series: {
        states: { inactive: { opacity: 0.2 }, hover: { enabled: true } },
      },
    },
    legend: { enabled: false },
    series,
  });
}
