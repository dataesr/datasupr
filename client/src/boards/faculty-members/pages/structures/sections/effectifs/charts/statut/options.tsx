import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

const STATUS_LABELS: Record<string, string> = {
  enseignant_chercheur: "Enseignants-chercheurs",
  titulaire_non_chercheur: "Titulaires (non EC)",
  non_titulaire: "Non permanents",
};

const STATUS_COLORS: Record<string, string> = {
  enseignant_chercheur: "fm-statut-ec",
  titulaire_non_chercheur: "fm-statut-titulaire",
  non_titulaire: "fm-statut-non-permanent",
};

export function createStatusChartOptions(
  statusDistribution: any[]
): Highcharts.Options {
  const total = statusDistribution.reduce((sum, s) => sum + (s.count || 0), 0);
  const sorted = [...statusDistribution].sort(
    (a, b) => (b.count || 0) - (a.count || 0)
  );

  const data = sorted.map((s) => ({
    name: STATUS_LABELS[s._id] || s._id,
    y: s.count || 0,
    color: getCssColor(STATUS_COLORS[s._id] || "blue-france-main-525"),
    custom: {
      pct: total > 0 ? ((s.count / total) * 100).toFixed(1) : "0.0",
    },
  }));

  return createChartOptions("bar", {
    chart: { height: 220 },
    xAxis: {
      categories: data.map((d) => d.name),
      title: { text: null },
    },
    yAxis: { visible: false, min: 0 },
    plotOptions: {
      bar: {
        borderWidth: 0,
        borderRadius: 4,
        colorByPoint: true,
        pointWidth: 28,
        dataLabels: {
          enabled: true,
          format: "{point.y:,.0f} ({point.custom.pct}\u00a0%)",
          style: { fontSize: "11px", fontWeight: "bold" },
        },
      },
    },
    tooltip: {
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormat:
        "Effectif\u00a0: <b>{point.y:,.0f}</b> ({point.custom.pct}\u00a0%)",
    },
    legend: { enabled: false },
    series: [
      {
        type: "bar",
        name: "Effectif",
        data,
      },
    ],
  });
}
