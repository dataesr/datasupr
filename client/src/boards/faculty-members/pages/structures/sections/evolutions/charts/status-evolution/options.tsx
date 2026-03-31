import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  enseignant_chercheur: {
    label: "Enseignants-chercheurs",
    color: "fm-statut-ec",
  },
  titulaire_non_chercheur: {
    label: "Titulaires (non EC)",
    color: "fm-statut-titulaire",
  },
  non_titulaire: {
    label: "Non permanents",
    color: "fm-statut-non-permanent",
  },
};

export function createStatusEvolutionOptions(
  categories: string[],
  statusEvolution: any[]
): Highcharts.Options {
  const statusKeys = Object.keys(STATUS_CONFIG);

  const series: Highcharts.SeriesOptionsType[] = statusKeys.map((key) => ({
    type: "area" as const,
    name: STATUS_CONFIG[key].label,
    color: getCssColor(STATUS_CONFIG[key].color),
    data: statusEvolution.map((e: any) => {
      const s = e.status_breakdown?.find((b: any) => b.status === key);
      return s?.count || 0;
    }),
  }));

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
