import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

const CATEGORY_COLORS: Array<{ pattern: RegExp; color: string }> = [
  { pattern: /professeur/i, color: getCssColor("fm-cat-pr") },
  { pattern: /ma[iî]tre.*conf[eé]rence|MCF/i, color: getCssColor("fm-cat-mcf") },
  { pattern: /2[eè]me degr[eé]|second degr[eé]/i, color: getCssColor("fm-cat-2nd-degre") },
  { pattern: /non.permanent|vacataire|ATER|contract/i, color: getCssColor("fm-cat-non-permanents") },
];

function getCategoryColor(name: string): string {
  const match = CATEGORY_COLORS.find(({ pattern }) => pattern.test(name));
  return match ? match.color : getCssColor("fm-cat-non-permanents");
}

export function createCategoryEvolutionOptions(
  categories: string[],
  categoryEvolution: any[]
): Highcharts.Options {
  const allCategories = new Set<string>();
  categoryEvolution.forEach((e: any) =>
    e.category_breakdown?.forEach((b: any) => allCategories.add(b.category))
  );

  const series: Highcharts.SeriesOptionsType[] = [...allCategories].map(
    (cat) => ({
      type: "area" as const,
      name: cat,
      color: getCategoryColor(cat),
      data: categoryEvolution.map((e: any) => {
        const b = e.category_breakdown?.find(
          (c: any) => c.category === cat
        );
        return b?.count || 0;
      }),
    })
  );

  return createChartOptions("area", {
    chart: { height: 350 },
    xAxis: {
      categories,
      title: { text: null },
      labels: { rotation: -45 },
    },
    yAxis: { min: 0, title: { text: "Effectif" } },
    plotOptions: {
      area: {
        stacking: "normal",
        lineWidth: 1,
        marker: { enabled: false, radius: 3 },
        fillOpacity: 0.4,
      },
    },
    tooltip: {
      shared: true,
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormat:
        '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:,.0f}</b><br/>',
    },
    legend: {
      enabled: true,
      itemStyle: { fontSize: "11px", fontWeight: "normal" },
    },
    series,
  });
}
