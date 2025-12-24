import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../constants/colors";

interface EvolutionNationaleData {
  exercice: number;
  scsp: number;
  recettes_propres: number;
  effectif_sans_cpge: number;
  emploi_etpt: number;
}

export const createEvolutionNationaleChartOptions = (
  data: EvolutionNationaleData[],
  metric: "finances" | "effectifs" | "taux"
): Highcharts.Options => {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);

  if (metric === "finances") {
    return {
      chart: {
        type: "line",
        height: 500,
        backgroundColor: "transparent",
      },
      title: {
        text: undefined,
      },
      exporting: { enabled: false },
      xAxis: {
        categories: sortedData.map((d) => String(d.exercice)),
        title: {
          text: "Année",
          style: { color: "var(--text-default-grey)" },
        },
        crosshair: true,
        labels: {
          style: { color: "var(--text-default-grey)" },
        },
        lineColor: "var(--border-default-grey)",
      },
      yAxis: [
        {
          title: {
            text: "SCSP (€)",
            style: { color: CHART_COLORS.primary },
          },
          labels: {
            style: { color: CHART_COLORS.primary },
            formatter: function () {
              return `€${Highcharts.numberFormat(
                Number(this.value),
                0,
                ",",
                " "
              )}`;
            },
          },
          gridLineColor: "var(--border-default-grey)",
        },
        {
          title: {
            text: "Recettes propres (€)",
            style: { color: CHART_COLORS.secondary },
          },
          labels: {
            style: { color: CHART_COLORS.secondary },
            formatter: function () {
              return `€${Highcharts.numberFormat(
                Number(this.value),
                0,
                ",",
                " "
              )}`;
            },
          },
          opposite: true,
          gridLineColor: "var(--border-default-grey)",
        },
      ],
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: "var(--background-default-grey)",
        borderColor: "var(--border-default-grey)",
        borderRadius: 8,
        formatter: function () {
          let tooltip = `<div style="padding:10px"><div style="font-weight:bold;margin-bottom:8px">${this.x}</div>`;
          this.points?.forEach((point: any) => {
            const value = Highcharts.numberFormat(point.y, 0, ",", " ");
            tooltip += `<div style="margin-top:4px">
              <span style="color:${point.series.color}">●</span> 
              <strong>${point.series.name}:</strong> ${value} €
            </div>`;
          });
          tooltip += `</div>`;
          return tooltip;
        },
      },
      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "bottom",
        itemStyle: { color: "var(--text-default-grey)" },
      },
      plotOptions: {
        line: {
          marker: { enabled: true, radius: 4 },
          lineWidth: 2,
        },
      },
      series: [
        {
          name: "SCSP",
          type: "line",
          data: sortedData.map((d) => d.scsp),
          color: CHART_COLORS.primary,
          yAxis: 0,
        },
        {
          name: "Recettes propres",
          type: "line",
          data: sortedData.map((d) => d.recettes_propres),
          color: CHART_COLORS.secondary,
          yAxis: 1,
        },
      ],
      credits: { enabled: false },
    };
  }

  if (metric === "effectifs") {
    return {
      chart: {
        type: "line",
        height: 500,
        backgroundColor: "transparent",
      },
      title: { text: undefined },
      exporting: { enabled: false },
      xAxis: {
        categories: sortedData.map((d) => String(d.exercice)),
        title: {
          text: "Année",
          style: { color: "var(--text-default-grey)" },
        },
        crosshair: true,
        labels: { style: { color: "var(--text-default-grey)" } },
        lineColor: "var(--border-default-grey)",
      },
      yAxis: [
        {
          title: {
            text: "Effectifs étudiants",
            style: { color: CHART_COLORS.tertiary },
          },
          labels: {
            style: { color: CHART_COLORS.tertiary },
            formatter: function () {
              return Highcharts.numberFormat(Number(this.value), 0, ",", " ");
            },
          },
          gridLineColor: "var(--border-default-grey)",
        },
        {
          title: {
            text: "Emplois (ETPT)",
            style: { color: CHART_COLORS.quaternary },
          },
          labels: {
            style: { color: CHART_COLORS.quaternary },
            formatter: function () {
              return Highcharts.numberFormat(Number(this.value), 0, ",", " ");
            },
          },
          opposite: true,
          gridLineColor: "var(--border-default-grey)",
        },
      ],
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: "var(--background-default-grey)",
        borderColor: "var(--border-default-grey)",
        borderRadius: 8,
        formatter: function () {
          let tooltip = `<div style="padding:10px"><div style="font-weight:bold;margin-bottom:8px">${this.x}</div>`;
          this.points?.forEach((point: any) => {
            const value = Highcharts.numberFormat(point.y, 0, ",", " ");
            tooltip += `<div style="margin-top:4px">
              <span style="color:${point.series.color}">●</span> 
              <strong>${point.series.name}:</strong> ${value}
            </div>`;
          });
          tooltip += `</div>`;
          return tooltip;
        },
      },
      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "bottom",
        itemStyle: { color: "var(--text-default-grey)" },
      },
      plotOptions: {
        line: {
          marker: { enabled: true, radius: 4 },
          lineWidth: 2,
        },
      },
      series: [
        {
          name: "Effectifs étudiants",
          type: "line",
          data: sortedData.map((d) => d.effectif_sans_cpge),
          color: CHART_COLORS.tertiary,
          yAxis: 0,
        },
        {
          name: "Emplois (ETPT)",
          type: "line",
          data: sortedData.map((d) => d.emploi_etpt || 0),
          color: CHART_COLORS.quaternary,
          yAxis: 1,
        },
      ],
      credits: { enabled: false },
    };
  }

  const tauxData = sortedData.map((d) => {
    const taux =
      d.emploi_etpt && d.effectif_sans_cpge
        ? (d.emploi_etpt / d.effectif_sans_cpge) * 100
        : 0;
    return { exercice: d.exercice, taux };
  });

  return {
    chart: {
      type: "line",
      height: 500,
      backgroundColor: "transparent",
    },
    title: { text: undefined },
    exporting: { enabled: false },
    xAxis: {
      categories: tauxData.map((d) => String(d.exercice)),
      title: {
        text: "Année",
        style: { color: "var(--text-default-grey)" },
      },
      crosshair: true,
      labels: { style: { color: "var(--text-default-grey)" } },
      lineColor: "var(--border-default-grey)",
    },
    yAxis: {
      title: {
        text: "Taux d'encadrement (%)",
        style: { color: CHART_COLORS.secondary },
      },
      labels: {
        style: { color: CHART_COLORS.secondary },
        formatter: function () {
          return `${Number(this.value).toFixed(1)}%`;
        },
      },
      gridLineColor: "var(--border-default-grey)",
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "var(--background-default-grey)",
      borderColor: "var(--border-default-grey)",
      borderRadius: 8,
      formatter: function () {
        return `<div style="padding:10px">
          <div style="font-weight:bold;margin-bottom:8px">${this.x}</div>
          <div><span style="color:${
            CHART_COLORS.secondary
          }">●</span> <strong>Taux d'encadrement:</strong> ${Number(
          this.y
        ).toFixed(2)}%</div>
        </div>`;
      },
    },
    legend: { enabled: false },
    plotOptions: {
      line: {
        marker: { enabled: true, radius: 4 },
        lineWidth: 2,
        color: CHART_COLORS.secondary,
      },
    },
    series: [
      {
        name: "Taux d'encadrement",
        type: "line",
        data: tauxData.map((d) => d.taux),
        color: CHART_COLORS.secondary,
      },
    ],
    credits: { enabled: false },
  };
};
