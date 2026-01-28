import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";

export interface PositioningComparisonBarConfig {
  metric: string;
  metricLabel: string;
  topN: number;
  format?: (value: number) => string;
}

export const createPositioningComparisonBarOptions = (
  config: PositioningComparisonBarConfig,
  data: any[],
  currentStructureId?: string,
  currentStructureName?: string
): Highcharts.Options => {
  const seenIds = new Set<string>();
  const uniqueData = data.filter((item) => {
    const itemId = item.etablissement_id_paysage_actuel;
    if (!itemId || seenIds.has(itemId)) return false;
    seenIds.add(itemId);
    return true;
  });

  // Mapper toutes les données
  const allChartData = uniqueData.map((item: any) => {
    const itemId = item.etablissement_id_paysage_actuel;
    const isCurrentStructure =
      currentStructureId && itemId === currentStructureId;

    return {
      name:
        item.etablissement_actuel_lib || item.etablissement_lib || "Sans nom",
      value: item[config.metric] || 0,
      isCurrentStructure,
    };
  });

  // Séparer l'établissement actuel
  const currentStructure = allChartData.find((d) => d.isCurrentStructure);

  // Filtrer les autres structures (avec valeurs > 0) et trier
  const otherStructures = allChartData
    .filter((d) => {
      if (d.isCurrentStructure) return false;
      const value = d.value;
      return value != null && !isNaN(value) && value > 0;
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, config.topN - 1);

  const chartData = currentStructure
    ? [currentStructure, ...otherStructures]
    : otherStructures.slice(0, config.topN);

  return createChartOptions("bar", {
    title: {
      text: "",
    },
    accessibility: {
      description: `Graphique en barres comparant ${config.metricLabel} pour ${chartData.length} établissements. ${currentStructureName || "L'établissement sélectionné"} est mis en évidence.`,
    },
    xAxis: {
      categories: chartData.map((d) => d.name),
      gridLineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },
      labels: {
        formatter: function () {
          if (config.format) {
            return config.format(this.value as number);
          }
          return String(this.value);
        },
      },
    },
    tooltip: {
      useHTML: true,
      borderWidth: 1,
      borderRadius: 8,
      shadow: false,
      formatter: function () {
        const point = this as any;
        const value = point.y as number;
        const formatted = config.format
          ? config.format(value)
          : value.toLocaleString("fr-FR");

        return `
          <div class="fr-p-2w">
            <div class="fr-text--bold fr-mb-1v">
              ${point.category}
            </div>
            <div class="fr-mt-1w">
              <strong>${config.metricLabel}:</strong> ${formatted}
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false,
        },
        borderRadius: 4,
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "bar",
        name: config.metricLabel,
        data: chartData.map((d) => ({
          y: d.value,
          color: d.isCurrentStructure
            ? "var(--background-flat-info)"
            : "var(--background-contrast-blue-france)",
        })),
      },
    ],
  });
};
