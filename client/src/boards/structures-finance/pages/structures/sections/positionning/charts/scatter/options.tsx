import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../../../constants/colors";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";

export interface ScatterConfig {
  title: string;
  xMetric: string;
  yMetric: string;
  xLabel: string;
  yLabel: string;
}

export const createPositioningScatterOptions = (
  config: ScatterConfig,
  data: any[],
  currentStructureId?: string,
  currentStructureName?: string
): Highcharts.Options => {
  if (!data || !Array.isArray(data)) {
    return createChartOptions("bubble", {});
  }

  const seenIds = new Set<string>();
  const uniqueData = data.filter((item) => {
    const itemId = item.etablissement_id_paysage_actuel;
    if (!itemId || seenIds.has(itemId)) return false;
    seenIds.add(itemId);
    return true;
  });

  const regionGroups = new Map<string, any[]>();
  let currentStructureData: any = null;
  let matchedItems: any[] = [];

  uniqueData
    .filter(
      (item) => item[config.xMetric] != null && item[config.yMetric] != null
    )
    .forEach((item) => {
      const region =
        item.etablissement_actuel_region || item.region || "Non spécifié";
      const itemId = item.etablissement_id_paysage_actuel;

      const isCurrentStructure =
        currentStructureId && itemId === currentStructureId;

      if (isCurrentStructure) {
        matchedItems.push({
          id: itemId,
          name: item.etablissement_actuel_lib || item.etablissement_lib,
          region: region,
        });
      }

      if (!regionGroups.has(region)) {
        regionGroups.set(region, []);
      }

      const etablissementName =
        item.etablissement_actuel_lib ||
        item.etablissement_lib ||
        "Établissement inconnu";

      const point = {
        x: item[config.xMetric],
        y: item[config.yMetric],
        z: Math.sqrt(item[config.yMetric]) / 10,
        name: etablissementName,
        region: item.etablissement_actuel_region || item.region,
        type: item.etablissement_actuel_type || item.type,
        isCurrentStructure,
      };

      if (isCurrentStructure) {
        currentStructureData = point;
      }

      regionGroups.get(region)!.push(point);
    });

  const colors = CHART_COLORS.palette;
  const series = Array.from(regionGroups.entries())
    .sort(([regionA], [regionB]) =>
      regionA.localeCompare(regionB, "fr", { sensitivity: "base" })
    )
    .map(([region, items], index) => ({
      name: region,
      type: "bubble" as const,
      data: items.filter((item: any) => !item.isCurrentStructure),
      color: colors[index % colors.length],
      opacity: 0.6,
    }))
    .filter((serie) => serie.data.length > 0);

  if (currentStructureData) {
    series.push({
      name: currentStructureName || currentStructureData.name,
      type: "bubble" as const,
      data: [currentStructureData],
      color: "var(--background-open-blue-france)",
      opacity: 1,
      marker: {
        lineWidth: 4,
        lineColor: "var(--background-flat-info)",
        fillColor: "var(--background-active-blue-france)",
      },
      dataLabels: {
        enabled: true,
        format: "{point.name}",
        style: {
          color: "var(--text-default-grey)",
          fontSize: "12px",
          fontWeight: "bold",
        },
        y: -10,
      },
      zIndex: 1000,
    } as any);
  }

  return createChartOptions("bubble", {
    chart: {
      height: 600,
    },
    accessibility: {
      enabled: true,
      description: `Graphique de dispersion représentant ${config.title.toLowerCase()}. Chaque bulle représente un établissement, coloré par région. ${currentStructureName || "L'établissement sélectionné"} est mis en évidence.`,
      keyboardNavigation: {
        enabled: true,
      },
    },
    xAxis: {
      title: {
        text: config.xLabel,
        style: {
          fontSize: "13px",
          fontWeight: "500",
        },
      },
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: config.yLabel,
        style: {
          fontSize: "13px",
          fontWeight: "500",
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
        return `
          <div class="fr-p-2w">
            <div class="fr-text--bold fr-mb-1v">
              ${point.name}
            </div>
            <div class="fr-text--sm text-mention-grey fr-mb-1v">${
              point.type
            } • ${point.region}</div>
            <div class="fr-mt-1w fr-pt-1w" style="border-top:1px solid var(--border-default-grey)">
              <div class="fr-mb-1v"><strong>${
                config.xLabel
              }:</strong> ${Highcharts.numberFormat(point.x, 0, ",", " ")}</div>
              <div><strong>${config.yLabel}:</strong> ${Highcharts.numberFormat(
                point.y,
                2,
                ",",
                " "
              )}</div>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      bubble: {
        minSize: 8,
        maxSize: 50,
      },
      series: {
        states: {
          inactive: {
            opacity: 0.2,
          },
          hover: {
            enabled: true,
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    series: series as any,
  });
};
