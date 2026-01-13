import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../constants/colors";
import { CreateChartOptions } from "../../../../chart-options";

interface RessourcesPropresData {
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
  part_droits_d_inscription?: number;
  part_formation_continue_diplomes_propres_et_vae?: number;
  part_taxe_d_apprentissage?: number;
  part_valorisation?: number;
  part_anr_hors_investissements_d_avenir?: number;
  part_anr_investissements_d_avenir?: number;
  part_contrats_et_prestations_de_recherche_hors_anr?: number;
  part_subventions_de_la_region?: number;
  part_subventions_union_europeenne?: number;
  part_autres_ressources_propres?: number;
  part_autres_subventions?: number;
}

export const createRessourcesPropresChartOptions = (
  data: RessourcesPropresData,
  viewMode: "value" | "percentage" = "value"
): Highcharts.Options => {
  const categories = [
    "Droits d'inscription",
    "Formation continue",
    "Taxe d'apprentissage",
    "Valorisation",
    "ANR hors investissements d'avenir",
    "ANR investissements d'avenir",
    "Contrats & prestations",
    "Subventions région",
    "Subventions UE",
    "Autres ressources",
    "Autres subventions",
  ];

  const values = [
    data.droits_d_inscription || 0,
    data.formation_continue_diplomes_propres_et_vae || 0,
    data.taxe_d_apprentissage || 0,
    data.valorisation || 0,
    data.anr_hors_investissements_d_avenir || 0,
    data.anr_investissements_d_avenir || 0,
    data.contrats_et_prestations_de_recherche_hors_anr || 0,
    data.subventions_de_la_region || 0,
    data.subventions_union_europeenne || 0,
    data.autres_ressources_propres || 0,
    data.autres_subventions || 0,
  ];

  const percentages = [
    data.part_droits_d_inscription || 0,
    data.part_formation_continue_diplomes_propres_et_vae || 0,
    data.part_taxe_d_apprentissage || 0,
    data.part_valorisation || 0,
    data.part_anr_hors_investissements_d_avenir || 0,
    data.part_anr_investissements_d_avenir || 0,
    data.part_contrats_et_prestations_de_recherche_hors_anr || 0,
    data.part_subventions_de_la_region || 0,
    data.part_subventions_union_europeenne || 0,
    data.part_autres_ressources_propres || 0,
    data.part_autres_subventions || 0,
  ];

  const colors = CHART_COLORS.palette;

  const seriesData = categories.map((cat, idx) => ({
    name: cat,
    value: viewMode === "value" ? values[idx] : percentages[idx],
    actualValue: values[idx],
    color: colors[idx],
    percentage: percentages[idx],
  }));

  return CreateChartOptions("treemap", {
    chart: {
      height: 500,
    },
    tooltip: {
      useHTML: true,
      borderWidth: 1,
      borderRadius: 8,
      shadow: false,
      formatter: function () {
        const point = this as any;
        if (viewMode === "value") {
          return `<div style="padding:10px">
                  <div style="font-weight:bold;margin-bottom:5px;font-size:14px">${
                    point.name
                  }</div>
                  <div style="font-size:16px;font-weight:bold;margin-bottom:8px">${Highcharts.numberFormat(
                    point.actualValue,
                    0,
                    ",",
                    " "
                  )} €</div>
                  <div style="color:#666;font-size:13px">${point.percentage.toFixed(
                    2
                  )}% des ressources propres</div>
                  </div>`;
        } else {
          return `<div style="padding:10px">
                  <div style="font-weight:bold;margin-bottom:5px;font-size:14px">${
                    point.name
                  }</div>
                  <div style="font-size:16px;font-weight:bold;margin-bottom:8px">${point.percentage.toFixed(
                    2
                  )}%</div>
                  <div style="color:#666;font-size:13px">${Highcharts.numberFormat(
                    point.actualValue,
                    0,
                    ",",
                    " "
                  )} €</div>
                  </div>`;
        }
      },
    },
    plotOptions: {
      treemap: {
        layoutAlgorithm: "squarified",
        dataLabels: {
          enabled: true,
          useHTML: true,
          formatter: function () {
            const point = this as any;
            if (point.value === 0) return null;
            if (viewMode === "value") {
              return `<div style="text-align:center">
                        <div style="font-weight:bold;font-size:12px;margin-bottom:2px">${
                          point.name
                        }</div>
                        <div style="font-size:11px">${Highcharts.numberFormat(
                          point.actualValue,
                          0,
                          ",",
                          " "
                        )} €</div>
                        <div style="font-size:10px">${point.percentage.toFixed(
                          1
                        )}%</div>
                      </div>`;
            } else {
              return `<div style="text-align:center">
                        <div style="font-weight:bold;font-size:12px;margin-bottom:2px">${
                          point.name
                        }</div>
                        <div style="font-size:11px">${point.percentage.toFixed(
                          1
                        )}%</div>
                      </div>`;
            }
          },
          style: {
            textOutline: "none",
            color: "#ffffff",
          },
        },
      },
    },
    series: [
      {
        name: "Ressources propres",
        type: "treemap",
        data: seriesData,
      },
    ],
  });
};
