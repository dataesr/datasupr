import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../constants/colors";

interface EffectifsData {
  effectif_sans_cpge?: number;
  effectif_sans_cpge_l?: number;
  effectif_sans_cpge_m?: number;
  effectif_sans_cpge_d?: number;
  part_effectif_sans_cpge_l?: number;
  part_effectif_sans_cpge_m?: number;
  part_effectif_sans_cpge_d?: number;
  effectif_sans_cpge_iut?: number;
  effectif_sans_cpge_ing?: number;
  effectif_sans_cpge_dsa?: number;
  effectif_sans_cpge_llsh?: number;
  effectif_sans_cpge_theo?: number;
  effectif_sans_cpge_si?: number;
  effectif_sans_cpge_staps?: number;
  effectif_sans_cpge_sante?: number;
  effectif_sans_cpge_veto?: number;
  effectif_sans_cpge_interd?: number;
  part_effectif_sans_cpge_iut?: number;
  part_effectif_sans_cpge_ing?: number;
  part_effectif_sans_cpge_dsa?: number;
  part_effectif_sans_cpge_llsh?: number;
  part_effectif_sans_cpge_theo?: number;
  part_effectif_sans_cpge_si?: number;
  part_effectif_sans_cpge_staps?: number;
  part_effectif_sans_cpge_sante?: number;
  part_effectif_sans_cpge_veto?: number;
  part_effectif_sans_cpge_interd?: number;
  has_effectif_l?: boolean;
  has_effectif_m?: boolean;
  has_effectif_d?: boolean;
  has_effectif_iut?: boolean;
  has_effectif_ing?: boolean;
  has_effectif_dsa?: boolean;
  has_effectif_llsh?: boolean;
  has_effectif_theo?: boolean;
  has_effectif_si?: boolean;
  has_effectif_staps?: boolean;
  has_effectif_sante?: boolean;
  has_effectif_veto?: boolean;
  has_effectif_interd?: boolean;
  emploi_etpt?: number;
  taux_encadrement?: number;
}

export const createEffectifsNiveauChartOptions = (
  data: EffectifsData
): Highcharts.Options => {
  const niveaux = [
    {
      name: "Licence",
      y: data.effectif_sans_cpge_l || 0,
      color: CHART_COLORS.primary,
      percentage: data.part_effectif_sans_cpge_l || 0,
      has: data.has_effectif_l,
    },
    {
      name: "Master",
      y: data.effectif_sans_cpge_m || 0,
      color: CHART_COLORS.secondary,
      percentage: data.part_effectif_sans_cpge_m || 0,
      has: data.has_effectif_m,
    },
    {
      name: "Doctorat",
      y: data.effectif_sans_cpge_d || 0,
      color: CHART_COLORS.tertiary,
      percentage: data.part_effectif_sans_cpge_d || 0,
      has: data.has_effectif_d,
    },
  ].filter((item) => item.has);

  return {
    chart: {
      type: "pie",
      height: 400,
      backgroundColor: "transparent",
    },
    title: {
      text: undefined,
    },
    exporting: {
      enabled: false,
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
                )} étudiants</div>
                <div style="color:#666;font-size:13px">${point.percentage.toFixed(
                  2
                )}% du total</div>
                </div>`;
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
          style: {
            fontSize: "13px",
            textOutline: "none",
          },
        },
        showInLegend: true,
      },
    },
    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Effectifs",
        type: "pie",
        data: niveaux,
      },
    ],
  };
};

export const createEffectifsSpecifiquesChartOptions = (
  data: EffectifsData
): Highcharts.Options => {
  const colors = CHART_COLORS.palette;

  const specifiques = [
    {
      name: "IUT",
      y: data.effectif_sans_cpge_iut || 0,
      has: data.has_effectif_iut,
      color: colors[0],
    },
    {
      name: "Ingénieur",
      y: data.effectif_sans_cpge_ing || 0,
      has: data.has_effectif_ing,
      color: colors[10],
    },
    {
      name: "Santé",
      y: data.effectif_sans_cpge_sante || 0,
      has: data.has_effectif_sante,
      color: colors[7],
    },
  ].filter((item) => item.has && item.y > 0);

  return {
    chart: {
      type: "pie",
      height: 400,
      backgroundColor: "transparent",
    },
    title: {
      text: undefined,
    },
    exporting: {
      enabled: false,
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
                )} étudiants</div>
                </div>`;
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          useHTML: true,
          formatter: function () {
            const point = this as any;
            return `<b>${point.name}</b><br>${Highcharts.numberFormat(
              point.y,
              0,
              ",",
              " "
            )} étudiants`;
          },
          style: {
            fontSize: "13px",
            textOutline: "none",
          },
        },
        showInLegend: true,
      },
    },
    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Effectifs",
        type: "pie",
        data: specifiques,
      },
    ],
  };
};

export const createEffectifsDisciplinesChartOptions = (
  data: EffectifsData
): Highcharts.Options => {
  const colors = CHART_COLORS.palette;

  const disciplines = [
    {
      name: "Droit, Sciences Éco, AES",
      y: data.effectif_sans_cpge_dsa || 0,
      percentage: data.part_effectif_sans_cpge_dsa || 0,
      has: data.has_effectif_dsa,
      color: colors[1],
    },
    {
      name: "Lettres, Langues, SHS",
      y: data.effectif_sans_cpge_llsh || 0,
      percentage: data.part_effectif_sans_cpge_llsh || 0,
      has: data.has_effectif_llsh,
      color: colors[2],
    },
    {
      name: "Théologie",
      y: data.effectif_sans_cpge_theo || 0,
      percentage: data.part_effectif_sans_cpge_theo || 0,
      has: data.has_effectif_theo,
      color: colors[4],
    },
    {
      name: "Sciences et Ingénierie",
      y: data.effectif_sans_cpge_si || 0,
      percentage: data.part_effectif_sans_cpge_si || 0,
      has: data.has_effectif_si,
      color: colors[5],
    },
    {
      name: "STAPS",
      y: data.effectif_sans_cpge_staps || 0,
      percentage: data.part_effectif_sans_cpge_staps || 0,
      has: data.has_effectif_staps,
      color: colors[6],
    },
    {
      name: "Vétérinaire",
      y: data.effectif_sans_cpge_veto || 0,
      percentage: data.part_effectif_sans_cpge_veto || 0,
      has: data.has_effectif_veto,
      color: colors[8],
    },
    {
      name: "Interdisciplinaire",
      y: data.effectif_sans_cpge_interd || 0,
      percentage: data.part_effectif_sans_cpge_interd || 0,
      has: data.has_effectif_interd,
      color: colors[9],
    },
  ].filter((item) => item.has && item.y > 0);

  return {
    chart: {
      type: "pie",
      height: 400,
      backgroundColor: "transparent",
    },
    title: {
      text: undefined,
    },
    exporting: {
      enabled: false,
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
                )} étudiants</div>
                <div style="color:#666;font-size:13px">${point.percentage.toFixed(
                  1
                )}% du total</div>
                </div>`;
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          useHTML: true,
          formatter: function () {
            const point = this as any;
            return `<b>${point.name}</b><br>${point.percentage.toFixed(1)}%`;
          },
          style: {
            fontSize: "13px",
            textOutline: "none",
          },
        },
        showInLegend: true,
      },
    },
    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Effectifs",
        type: "pie",
        data: disciplines,
      },
    ],
  };
};
