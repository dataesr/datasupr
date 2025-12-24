import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../constants/colors";

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
  data: RessourcesPropresData
): Highcharts.Options => {
  const categories = [
    "Autres subventions",
    "Autres ressources propres",
    "Subventions UE",
    "Subventions région",
    "Contrats & prestations",
    "ANR investissements",
    "ANR hors investissements",
    "Valorisation",
    "Taxe d'apprentissage",
    "Formation continue",
    "Droits d'inscription",
  ];

  const values = [
    data.autres_subventions || 0,
    data.autres_ressources_propres || 0,
    data.subventions_union_europeenne || 0,
    data.subventions_de_la_region || 0,
    data.contrats_et_prestations_de_recherche_hors_anr || 0,
    data.anr_investissements_d_avenir || 0,
    data.anr_hors_investissements_d_avenir || 0,
    data.valorisation || 0,
    data.taxe_d_apprentissage || 0,
    data.formation_continue_diplomes_propres_et_vae || 0,
    data.droits_d_inscription || 0,
  ];

  const percentages = [
    data.part_autres_subventions || 0,
    data.part_autres_ressources_propres || 0,
    data.part_subventions_union_europeenne || 0,
    data.part_subventions_de_la_region || 0,
    data.part_contrats_et_prestations_de_recherche_hors_anr || 0,
    data.part_anr_investissements_d_avenir || 0,
    data.part_anr_hors_investissements_d_avenir || 0,
    data.part_valorisation || 0,
    data.part_taxe_d_apprentissage || 0,
    data.part_formation_continue_diplomes_propres_et_vae || 0,
    data.part_droits_d_inscription || 0,
  ];

  const colors = CHART_COLORS.palette;

  const seriesData = categories.map((cat, idx) => ({
    name: cat,
    y: values[idx],
    color: colors[idx],
    percentage: percentages[idx],
  }));

  return {
    chart: {
      type: "bar",
      height: 500,
      backgroundColor: "transparent",
    },
    title: {
      text: undefined,
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
      categories,
      labels: {
        style: {
          fontSize: "13px",
          color: "var(--text-default-grey)",
        },
      },
      lineWidth: 1,
      lineColor: "var(--border-default-grey)",
    },
    yAxis: {
      title: {
        text: "Montant (€)",
        style: {
          color: "var(--text-default-grey)",
        },
      },
      labels: {
        style: {
          color: "var(--text-default-grey)",
        },
        formatter: function () {
          return Highcharts.numberFormat(Number(this.value), 0, ",", " ");
        },
      },
      gridLineColor: "var(--border-default-grey)",
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "var(--background-default-grey)",
      borderWidth: 1,
      borderColor: "var(--border-default-grey)",
      borderRadius: 8,
      shadow: false,
      formatter: function () {
        const point = this as any;
        return `<div style="padding:10px">
                <div style="font-weight:bold;margin-bottom:5px;font-size:14px">${
                  point.name
                }</div>
                <div style="font-size:16px;font-weight:bold;margin-bottom:8px">${Highcharts.numberFormat(
                  point.y,
                  0,
                  ",",
                  " "
                )} €</div>
                <div style="color:#666;font-size:13px">${point.percentage.toFixed(
                  2
                )}% des ressources propres</div>
                </div>`;
      },
    },
    plotOptions: {
      bar: {
        borderWidth: 0,
        borderRadius: 3,
        dataLabels: {
          enabled: true,
          formatter: function () {
            const point = this as any;
            return `${point.percentage.toFixed(1)}%`;
          },
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            textOutline: "none",
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Ressources propres",
        type: "bar",
        data: seriesData,
      },
    ],
  };
};
