import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

const GROUPS = [
  {
    id: "g-formation",
    name: "Formation",
    colorKey: "ress-groupe-formation",
    items: [
      { key: "droits_d_inscription", partKey: "part_droits_d_inscription", label: "Droits d'inscription" },
      { key: "formation_continue_diplomes_propres_et_vae", partKey: "part_formation_continue_diplomes_propres_et_vae", label: "Formation continue" },
      { key: "taxe_d_apprentissage", partKey: "part_taxe_d_apprentissage", label: "Taxe d'apprentissage" },
    ],
  },
  {
    id: "g-recherche",
    name: "Recherche",
    colorKey: "ress-groupe-recherche",
    items: [
      { key: "valorisation", partKey: "part_valorisation", label: "Valorisation" },
      { key: "anr_hors_investissements_d_avenir", partKey: "part_anr_hors_investissements_d_avenir", label: "ANR hors investissements d'avenir" },
      { key: "anr_investissements_d_avenir", partKey: "part_anr_investissements_d_avenir", label: "ANR investissements d'avenir" },
      { key: "contrats_et_prestations_de_recherche_hors_anr", partKey: "part_contrats_et_prestations_de_recherche_hors_anr", label: "Contrats & prestations" },
    ],
  },
  {
    id: "g-autres",
    name: "Autres",
    colorKey: "ress-groupe-autres",
    items: [
      { key: "subventions_de_la_region", partKey: "part_subventions_de_la_region", label: "Subventions région" },
      { key: "subventions_union_europeenne", partKey: "part_subventions_union_europeenne", label: "Subventions UE" },
      { key: "autres_subventions", partKey: "part_autres_subventions", label: "Autres subventions" },
      { key: "autres_ressources_propres", partKey: "part_autres_ressources_propres", label: "Autres ressources" },
    ],
  },
];

export { GROUPS };

export const createRessourcesPropresChartOptions = (
  data: Record<string, any>,
  viewMode: "value" | "percentage" = "value"
): Highcharts.Options => {
  const flatData: any[] = [];
  const legendItems: Array<{ name: string; color: string }> = [];

  for (const group of GROUPS) {
    const color = getCssColor(group.colorKey);
    legendItems.push({ name: group.name, color });
    for (const item of group.items) {
      const value = data[item.key] || 0;
      const part = data[item.partKey] || 0;
      if (value === 0) continue;
      flatData.push({
        name: item.label,
        value: viewMode === "percentage" ? part : value,
        custom: { actualValue: value, part, groupe: group.name },
        color,
      });
    }
  }

  return createChartOptions("treemap", {
    chart: {
      height: 530,
      spacing: [0, 0, 0, 0],
      margin: [0, 0, 30, 0],
      events: {
        render: function () {
          const chart = this as any;
          if (chart._customLegend) {
            chart._customLegend.forEach((el: any) => el.destroy());
          }
          chart._customLegend = [];

          const y = chart.chartHeight - 12;
          let x = chart.plotLeft;

          legendItems.forEach(({ name, color }) => {
            const dot = chart.renderer
              .circle(x + 6, y, 6)
              .attr({ fill: color, zIndex: 5 })
              .add();
            const label = chart.renderer
              .text(name, x + 16, y + 4)
              .css({ fontSize: "12px", color: "var(--text-default-grey)", fontFamily: "Marianne, sans-serif" })
              .attr({ zIndex: 5 })
              .add();
            chart._customLegend.push(dot, label);
            x += name.length * 8 + 30;
          });
        },
      },
    },
    tooltip: {
      shadow: false,
      formatter: function () {
        const point = (this as any).point ?? this;
        if (!point.custom) return `<b>${point.name}</b>`;
        const { actualValue, part, groupe } = point.custom;
        const valStr = Highcharts.numberFormat(actualValue, 0, ",", "\u00a0") + "\u00a0\u20ac";
        return viewMode === "value"
          ? `<b>${point.name}</b><br/><i>${groupe}</i><br/>${valStr}<br/>${part.toFixed(1)}\u00a0% des ressources propres`
          : `<b>${point.name}</b><br/><i>${groupe}</i><br/>${part.toFixed(1)}\u00a0%<br/>${valStr}`;
      },
    },
    plotOptions: {
      treemap: {
        layoutAlgorithm: "squarified",
        dataLabels: {
          enabled: true,
          style: { fontSize: "11px", fontWeight: "400", color: "var(--text-inverted-grey)", textOutline: "none" },
        },
      },
    },
    series: [{ name: "Ressources propres", type: "treemap", data: flatData }],
  });
};
