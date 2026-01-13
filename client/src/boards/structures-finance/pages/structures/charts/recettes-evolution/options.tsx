import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../constants/colors";
import { CreateChartOptions } from "../../../../chart-options";

interface RecettesEvolutionData {
  exercice: number;
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
  ressources_propres?: number;
}

export const createRecettesEvolutionChartOptions = (
  data: RecettesEvolutionData[],
  mode: "value" | "percentage"
): Highcharts.Options => {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);
  const years = sortedData.map((d) => d.exercice);

  const colors = CHART_COLORS.palette;

  const series =
    mode === "value"
      ? [
          {
            name: "Droits d'inscription",
            data: sortedData.map((d) => d.droits_d_inscription || 0),
            color: colors[0],
          },
          {
            name: "Formation continue",
            data: sortedData.map(
              (d) => d.formation_continue_diplomes_propres_et_vae || 0
            ),
            color: colors[1],
          },
          {
            name: "Taxe d'apprentissage",
            data: sortedData.map((d) => d.taxe_d_apprentissage || 0),
            color: colors[2],
          },
          {
            name: "Valorisation",
            data: sortedData.map((d) => d.valorisation || 0),
            color: colors[3],
          },
          {
            name: "ANR hors IA",
            data: sortedData.map(
              (d) => d.anr_hors_investissements_d_avenir || 0
            ),
            color: colors[4],
          },
          {
            name: "ANR Investissements d'avenir",
            data: sortedData.map((d) => d.anr_investissements_d_avenir || 0),
            color: colors[5],
          },
          {
            name: "Contrats recherche hors ANR",
            data: sortedData.map(
              (d) => d.contrats_et_prestations_de_recherche_hors_anr || 0
            ),
            color: colors[6],
          },
          {
            name: "Subventions région",
            data: sortedData.map((d) => d.subventions_de_la_region || 0),
            color: colors[7],
          },
          {
            name: "Subventions UE",
            data: sortedData.map((d) => d.subventions_union_europeenne || 0),
            color: colors[8],
          },
          {
            name: "Autres ressources propres",
            data: sortedData.map((d) => d.autres_ressources_propres || 0),
            color: colors[9],
          },
          {
            name: "Autres subventions",
            data: sortedData.map((d) => d.autres_subventions || 0),
            color: colors[10],
          },
        ]
      : [
          {
            name: "Droits d'inscription",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0
                ? ((d.droits_d_inscription || 0) / total) * 100
                : 0;
            }),
            color: colors[0],
          },
          {
            name: "Formation continue",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0
                ? ((d.formation_continue_diplomes_propres_et_vae || 0) /
                    total) *
                    100
                : 0;
            }),
            color: colors[1],
          },
          {
            name: "Taxe d'apprentissage",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0
                ? ((d.taxe_d_apprentissage || 0) / total) * 100
                : 0;
            }),
            color: colors[2],
          },
          {
            name: "Valorisation",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0 ? ((d.valorisation || 0) / total) * 100 : 0;
            }),
            color: colors[3],
          },
          {
            name: "ANR hors IA",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0
                ? ((d.anr_hors_investissements_d_avenir || 0) / total) * 100
                : 0;
            }),
            color: colors[4],
          },
          {
            name: "ANR Investissements d'avenir",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0
                ? ((d.anr_investissements_d_avenir || 0) / total) * 100
                : 0;
            }),
            color: colors[5],
          },
          {
            name: "Contrats recherche hors ANR",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0
                ? ((d.contrats_et_prestations_de_recherche_hors_anr || 0) /
                    total) *
                    100
                : 0;
            }),
            color: colors[6],
          },
          {
            name: "Subventions région",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0
                ? ((d.subventions_de_la_region || 0) / total) * 100
                : 0;
            }),
            color: colors[7],
          },
          {
            name: "Subventions UE",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0
                ? ((d.subventions_union_europeenne || 0) / total) * 100
                : 0;
            }),
            color: colors[8],
          },
          {
            name: "Autres ressources propres",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0
                ? ((d.autres_ressources_propres || 0) / total) * 100
                : 0;
            }),
            color: colors[9],
          },
          {
            name: "Autres subventions",
            data: sortedData.map((d) => {
              const total = d.ressources_propres || 0;
              return total > 0
                ? ((d.autres_subventions || 0) / total) * 100
                : 0;
            }),
            color: colors[10],
          },
        ];

  return CreateChartOptions("column", {
    chart: {
      height: 500,
    },
    xAxis: {
      categories: years.map(String),
      title: {
        text: "Année d'exercice",
        style: {
          fontWeight: "bold",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: mode === "value" ? "Montant (€)" : "Pourcentage (%)",
        style: {
          fontWeight: "bold",
        },
      },
      labels: {
        formatter: function () {
          if (mode === "percentage") {
            return `${this.value}%`;
          }
          return Highcharts.numberFormat(Number(this.value), 0, ",", " ");
        },
      },
      stackLabels: {
        enabled: mode === "value",
        style: {
          fontWeight: "bold",
        },
        formatter: function () {
          return Highcharts.numberFormat(this.total || 0, 0, ",", " ") + " €";
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
        const index = point.point.index;
        const yearData = sortedData[index];

        if (mode === "value") {
          return `<div style="padding:10px">
                  <div style="font-weight:bold;margin-bottom:8px;font-size:14px">Exercice ${
                    point.x
                  }</div>
                  <div style="margin-bottom:4px">
                    <span style="color:${point.color};font-weight:bold">● ${
            point.series.name
          }</span>
                  </div>
                  <div style="font-size:16px;font-weight:bold;margin-bottom:8px">
                    ${Highcharts.numberFormat(point.y, 0, ",", " ")} €
                  </div>
                  <div style="border-top:1px solid #ddd;padding-top:8px;margin-top:8px">
                    <strong>Total ressources propres :</strong> ${Highcharts.numberFormat(
                      yearData.ressources_propres || 0,
                      0,
                      ",",
                      " "
                    )} €
                  </div>
                  </div>`;
        } else {
          const percentage = point.y;
          const value = (yearData.ressources_propres || 0) * (percentage / 100);
          return `<div style="padding:10px">
                  <div style="font-weight:bold;margin-bottom:8px;font-size:14px">Exercice ${
                    point.x
                  }</div>
                  <div style="margin-bottom:4px">
                    <span style="color:${point.color};font-weight:bold">● ${
            point.series.name
          }</span>
                  </div>
                  <div style="font-size:16px;font-weight:bold;margin-bottom:4px">
                    ${percentage.toFixed(2)}%
                  </div>
                  <div style="color:#666;font-size:13px;margin-bottom:8px">
                    ${Highcharts.numberFormat(value, 0, ",", " ")} €
                  </div>
                  <div style="border-top:1px solid #ddd;padding-top:8px;margin-top:8px">
                    <strong>Total ressources propres :</strong> ${Highcharts.numberFormat(
                      yearData.ressources_propres || 0,
                      0,
                      ",",
                      " "
                    )} €
                  </div>
                  </div>`;
        }
      },
    },
    plotOptions: {
      column: {
        stacking: mode === "percentage" ? "percent" : "normal",
        dataLabels: {
          enabled: false,
        },
      },
    },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "var(--text-default-grey)",
      },
    },
    series: series.map((s) => ({
      ...s,
      type: "column",
    })),
  });
};
