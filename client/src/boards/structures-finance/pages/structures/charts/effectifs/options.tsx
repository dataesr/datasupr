import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../constants/colors";
import { CreateChartOptions } from "../../../../chart-options";

interface EffectifsData {
  effectif_sans_cpge?: number;
  effectif_sans_cpge_l?: number;
  effectif_sans_cpge_m?: number;
  effectif_sans_cpge_d?: number;
  effectif_sans_cpge_dn?: number;
  effectif_sans_cpge_du?: number;
  effectif_sans_cpge_deg0?: number;
  effectif_sans_cpge_deg1?: number;
  effectif_sans_cpge_deg2?: number;
  effectif_sans_cpge_deg3?: number;
  effectif_sans_cpge_deg4?: number;
  effectif_sans_cpge_deg5?: number;
  effectif_sans_cpge_deg6?: number;
  effectif_sans_cpge_deg9?: number;
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
      name: "1er cycle (cursus L)",
      y: data.effectif_sans_cpge_l || 0,
      color: CHART_COLORS.primary,
      percentage: data.part_effectif_sans_cpge_l || 0,
      has: data.has_effectif_l,
    },
    {
      name: "2ème cycle (cursus M)",
      y: data.effectif_sans_cpge_m || 0,
      color: CHART_COLORS.secondary,
      percentage: data.part_effectif_sans_cpge_m || 0,
      has: data.has_effectif_m,
    },
    {
      name: "3ème cycle (cursus D)",
      y: data.effectif_sans_cpge_d || 0,
      color: CHART_COLORS.tertiary,
      percentage: data.part_effectif_sans_cpge_d || 0,
      has: data.has_effectif_d,
    },
  ].filter((item) => item.has);

  return CreateChartOptions("pie", {
    chart: {
      height: 350,
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    tooltip: {
      useHTML: true,
      borderWidth: 1,
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
        size: "75%",
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "",
        type: "pie",
        data: niveaux,
      },
    ],
  });
};

export const createEffectifsSpecifiquesChartOptions = (
  data: EffectifsData
): Highcharts.Options => {
  const colors = CHART_COLORS.palette;

  const specifiques = [
    {
      name: "Formations d'IUT",
      y: data.effectif_sans_cpge_iut || 0,
      has: data.has_effectif_iut,
      color: colors[0],
    },
    {
      name: "Formations d'ingénieurs",
      y: data.effectif_sans_cpge_ing || 0,
      has: data.has_effectif_ing,
      color: colors[10],
    },
    {
      name: "Formation de santé",
      y: data.effectif_sans_cpge_sante || 0,
      has: data.has_effectif_sante,
      color: colors[7],
    },
  ].filter((item) => item.has && item.y > 0);

  const categories = specifiques.map((item) => item.name);
  const values = specifiques.map((item) => ({
    y: item.y,
    color: item.color,
    name: item.name,
  }));

  return CreateChartOptions("column", {
    chart: {
      height: 300,
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    xAxis: {
      categories: categories,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },
      labels: {
        formatter: function () {
          return Highcharts.numberFormat(this.value as number, 0, ",", " ");
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
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        groupPadding: 0.1,
        pointWidth: 40,
        dataLabels: {
          enabled: true,
          useHTML: true,
          formatter: function () {
            const value = Highcharts.numberFormat(
              this.y as number,
              0,
              ",",
              " "
            );
            return `<span style="color: var(--text-default-grey); font-size: 13px; font-weight: bold;">${value}</span>`;
          },
        },
      },
    },
    series: [
      {
        name: "Effectifs",
        type: "column",
        data: values,
        colorByPoint: true,
        showInLegend: false,
      },
      ...specifiques.map((item) => ({
        name: item.name,
        type: "column" as const,
        color: item.color,
        data: [],
        showInLegend: true,
      })),
    ],
  });
};

export const createEffectifsDisciplinesChartOptions = (
  data: EffectifsData
): Highcharts.Options => {
  const colors = CHART_COLORS.palette;

  const disciplines = [
    {
      name: "Droit, sciences économiques, AES",
      y: data.effectif_sans_cpge_dsa || 0,
      percentage: data.part_effectif_sans_cpge_dsa || 0,
      has: data.has_effectif_dsa,
      color: colors[1],
    },
    {
      name: "Lettres, langues et sciences humaines",
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
      name: "Sciences et sciences de l'ingénieur",
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
      name: "Formation de santé",
      y: data.effectif_sans_cpge_sante || 0,
      percentage: data.part_effectif_sans_cpge_sante || 0,
      has: data.has_effectif_sante,
      color: colors[7],
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

  return CreateChartOptions("pie", {
    chart: {
      height: 350,
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    tooltip: {
      useHTML: true,
      borderWidth: 1,
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
        size: "75%",
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "",
        type: "pie",
        data: disciplines,
      },
    ],
  });
};

export const createEffectifsDiplomesChartOptions = (
  data: EffectifsData
): Highcharts.Options => {
  const totalEffectif =
    (data.effectif_sans_cpge_dn || 0) + (data.effectif_sans_cpge_du || 0);
  const diplomes = [
    {
      name: "Diplômes nationaux",
      y: data.effectif_sans_cpge_dn || 0,
      color: CHART_COLORS.primary,
      percentage:
        totalEffectif > 0
          ? ((data.effectif_sans_cpge_dn || 0) / totalEffectif) * 100
          : 0,
    },
    {
      name: "Diplômes d'établissement",
      y: data.effectif_sans_cpge_du || 0,
      color: CHART_COLORS.secondary,
      percentage:
        totalEffectif > 0
          ? ((data.effectif_sans_cpge_du || 0) / totalEffectif) * 100
          : 0,
    },
  ].filter((item) => item.y > 0);

  return CreateChartOptions("pie", {
    chart: {
      height: 350,
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    title: {
      text: undefined,
    },
    tooltip: {
      pointFormat:
        "<b>{point.y:,.0f}</b> étudiants<br><b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        size: "75%",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "",
        type: "pie",
        data: diplomes,
      },
    ],
  });
};

export const createEffectifsDegreesChartOptions = (
  data: EffectifsData
): Highcharts.Options => {
  const colors = CHART_COLORS.palette;

  const degrees = [
    {
      name: "BAC ou inférieur",
      y: data.effectif_sans_cpge_deg0 || 0,
      color: colors[0],
    },
    {
      name: "BAC + 1",
      y: data.effectif_sans_cpge_deg1 || 0,
      color: colors[1],
    },
    {
      name: "BAC + 2",
      y: data.effectif_sans_cpge_deg2 || 0,
      color: colors[2],
    },
    {
      name: "BAC + 3",
      y: data.effectif_sans_cpge_deg3 || 0,
      color: colors[3],
    },
    {
      name: "BAC + 4",
      y: data.effectif_sans_cpge_deg4 || 0,
      color: colors[4],
    },
    {
      name: "BAC + 5",
      y: data.effectif_sans_cpge_deg5 || 0,
      color: colors[5],
    },
    {
      name: "BAC + 6 et plus",
      y: data.effectif_sans_cpge_deg6 || 0,
      color: colors[6],
    },
    {
      name: "Non renseigné",
      y: data.effectif_sans_cpge_deg9 || 0,
      color: colors[8],
    },
  ].filter((item) => item.y > 0);

  const categories = degrees.map((item) => item.name);
  const values = degrees.map((item) => ({
    y: item.y,
    color: item.color,
    name: item.name,
  }));

  return CreateChartOptions("column", {
    chart: {
      height: 300,
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    xAxis: {
      categories: categories,
      crosshair: true,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },
      labels: {
        formatter: function () {
          return Highcharts.numberFormat(this.value as number, 0, ",", " ");
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
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        groupPadding: 0.1,
        pointWidth: 40,
        dataLabels: {
          enabled: true,
          useHTML: true,
          formatter: function () {
            const value = Highcharts.numberFormat(
              this.y as number,
              0,
              ",",
              " "
            );
            return `<span style="color: var(--text-default-grey); font-size: 13px; font-weight: bold;">${value}</span>`;
          },
        },
      },
    },
    series: [
      {
        name: "Effectifs",
        type: "column",
        data: values,
        colorByPoint: true,
        showInLegend: false,
      },
      ...degrees.map((item) => ({
        name: item.name,
        type: "column" as const,
        color: item.color,
        data: [],
        showInLegend: true,
      })),
    ],
  });
};
