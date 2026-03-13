import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

interface EvolutionDataItem {
  exercice: number;
  sanfin_source?: string;
  droits_d_inscription?: number;
  formation_continue_diplomes_propres_et_vae?: number;
  taxe_d_apprentissage?: number;
  valorisation?: number;
  anr_hors_investissements_d_avenir?: number;
  anr_investissements_d_avenir?: number;
  contrats_et_prestations_de_recherche_hors_anr?: number;
  subventions_de_la_region?: number;
  subventions_union_europeenne?: number;
  autres_ressources_propres?: number;
  autres_subventions?: number;
}

const RESSOURCES_CATEGORIES = [
  {
    key: "droits_d_inscription",
    label: "Droits d'inscription",
    color: getCssColor("ress-droits-inscription"),
  },
  {
    key: "formation_continue_diplomes_propres_et_vae",
    label: "Formation continue",
    color: getCssColor("ress-formation-continue"),
  },
  {
    key: "taxe_d_apprentissage",
    label: "Taxe d'apprentissage",
    color: getCssColor("ress-taxe-apprentissage"),
  },
  {
    key: "valorisation",
    label: "Valorisation",
    color: getCssColor("ress-valorisation"),
  },
  {
    key: "anr_hors_investissements_d_avenir",
    label: "ANR hors IA",
    color: getCssColor("ress-anr-hors-ia"),
  },
  {
    key: "anr_investissements_d_avenir",
    label: "ANR IA",
    color: getCssColor("ress-anr-ia"),
  },
  {
    key: "contrats_et_prestations_de_recherche_hors_anr",
    label: "Contrats recherche",
    color: getCssColor("ress-contrats-recherche"),
  },
  {
    key: "subventions_de_la_region",
    label: "Subventions région",
    color: getCssColor("ress-subventions-region"),
  },
  {
    key: "subventions_union_europeenne",
    label: "Subventions UE",
    color: getCssColor("ress-subventions-ue"),
  },
  {
    key: "autres_ressources_propres",
    label: "Autres ressources",
    color: getCssColor("ress-autres-ressources"),
  },
  {
    key: "autres_subventions",
    label: "Autres subventions",
    color: getCssColor("ress-autres-subventions"),
  },
];

export { RESSOURCES_CATEGORIES };

export const createRessourcesPropresEvolutionChartOptions = (
  data: EvolutionDataItem[],
  mode: "value" | "percentage" = "value"
): Highcharts.Options => {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);
  const years = sortedData.map((d) =>
    d.sanfin_source === "Budget" ? `${d.exercice} (budget)` : String(d.exercice)
  );

  // Calculer les totaux par année pour le mode pourcentage
  const totalsPerYear = sortedData.map((d) =>
    RESSOURCES_CATEGORIES.reduce(
      (sum, cat) => sum + ((d as any)[cat.key] || 0),
      0
    )
  );

  const series: Highcharts.SeriesColumnOptions[] = RESSOURCES_CATEGORIES.map(
    (cat) => ({
      type: "column" as const,
      name: cat.label,
      color: cat.color,
      data: sortedData.map((d, index) => {
        const value = (d as any)[cat.key] || 0;
        if (mode === "percentage") {
          const total = totalsPerYear[index];
          return total > 0 ? (value / total) * 100 : 0;
        }
        return value;
      }),
    })
  );

  return createChartOptions("column", {
    chart: {
      type: "column",
      height: 450,
    },
    xAxis: {
      categories: years,
      title: {
        text: "Exercice",
      },
    },
    yAxis: {
      min: 0,
      max: mode === "percentage" ? 100 : undefined,
      title: {
        text: mode === "percentage" ? "Part (%)" : "Montant (€)",
      },
      stackLabels: {
        enabled: false,
      },
      labels: {
        formatter: function () {
          const value = this.value as number;
          if (mode === "percentage") {
            return value + " %";
          }
          if (value >= 1000000) {
            return (
              Highcharts.numberFormat(value / 1000000, 1, ",", " ") + " M€"
            );
          } else if (value >= 1000) {
            return Highcharts.numberFormat(value / 1000, 0, ",", " ") + " k€";
          }
          return Highcharts.numberFormat(value, 0, ",", " ") + " €";
        },
      },
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "var(--text-default-grey)",
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        const points = this.points || [];
        const year = points[0]?.key || this.x;
        let total = 0;

        let html = `<div style="padding:10px"><b>Exercice ${year}</b><br/><br/>`;

        points.forEach((point) => {
          const value = point.y || 0;
          total += value;
          if (value > 0) {
            if (mode === "percentage") {
              html += `<span style="color:${point.color}">●</span> ${
                point.series.name
              }: <b>${Highcharts.numberFormat(value, 1, ",", " ")} %</b><br/>`;
            } else {
              html += `<span style="color:${point.color}">●</span> ${
                point.series.name
              }: <b>${Highcharts.numberFormat(value, 0, ",", " ")} €</b><br/>`;
            }
          }
        });

        if (mode === "percentage") {
          html += `<br/><b>Total: ${Highcharts.numberFormat(total, 1, ",", " ")} %</b></div>`;
        } else {
          html += `<br/><b>Total: ${Highcharts.numberFormat(total, 0, ",", " ")} €</b></div>`;
        }

        return html;
      },
    },
    plotOptions: {
      column: {
        stacking: mode === "percentage" ? "percent" : "normal",
        dataLabels: {
          enabled: false,
        },
        borderWidth: 0,
        borderRadius: 0,
      },
    },
    series: series,
  });
};
