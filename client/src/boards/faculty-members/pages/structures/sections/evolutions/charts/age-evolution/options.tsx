import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

export const AGE_ORDER = [
  "35 ans et moins",
  "36-45 ans",
  "46-55 ans",
  "56-65 ans",
  "66 ans et plus",
];

const AGE_COLORS: Record<string, string> = {
  "35 ans et moins": "fm-age-35-et-moins",
  "36-45 ans": "fm-age-36-45",
  "46-55 ans": "fm-age-46-55",
  "56-65 ans": "fm-age-56-65",
  "66 ans et plus": "fm-age-66-et-plus",
};

export function createAgeEvolutionOptions(
  categories: string[],
  ageEvolution: any[]
): Highcharts.Options {
  const allAgeClasses = new Set<string>();
  ageEvolution.forEach((e: any) =>
    e.age_breakdown?.forEach((b: any) => allAgeClasses.add(b.age_class))
  );
  const sortedClasses = [...allAgeClasses].sort(
    (a, b) => AGE_ORDER.indexOf(a) - AGE_ORDER.indexOf(b)
  );

  const series: Highcharts.SeriesOptionsType[] = sortedClasses.map(
    (ageClass) => ({
      type: "area" as const,
      name: ageClass,
      color: getCssColor(AGE_COLORS[ageClass] || "fm-age-35-et-moins"),
      data: ageEvolution.map((e: any) => {
        const b = e.age_breakdown?.find(
          (a: any) => a.age_class === ageClass
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
    yAxis: {
      min: 0,
      title: { text: "Part (%)" },
      labels: { format: "{value}\u00a0%" },
    },
    plotOptions: {
      area: {
        stacking: "percent",
        lineWidth: 1,
        marker: { enabled: false, radius: 3 },
        fillOpacity: 0.5,
      },
    },
    tooltip: {
      shared: true,
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormat:
        '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:,.0f}</b> ({point.percentage:.1f}\u00a0%)<br/>',
    },
    legend: {
      enabled: true,
      itemStyle: { fontSize: "11px", fontWeight: "normal" },
    },
    series,
  });
}
