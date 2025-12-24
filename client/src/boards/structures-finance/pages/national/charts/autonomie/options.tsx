import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../constants/colors";

interface AutonomieData {
  etablissement_actuel_lib: string;
  part_ressources_propres: number;
  charges_de_personnel_produits_encaissables: number;
  scsp_par_etudiants: number;
  taux_encadrement: number;
  type: string;
  region: string;
  effectif_sans_cpge: number;
}

export const createAutonomieFinanciereChartOptions = (
  data: AutonomieData[],
  groupBy: "type" | "region"
): Highcharts.Options => {
  const groups = new Map<string, AutonomieData[]>();

  data.forEach((item) => {
    const key = groupBy === "type" ? item.type : item.region;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });

  const colors = CHART_COLORS.palette;
  const series: Highcharts.SeriesScatterOptions[] = Array.from(
    groups.entries()
  ).map(([groupName, items], idx) => ({
    name: groupName,
    type: "scatter",
    color: colors[idx % colors.length],
    data: items.map((item) => ({
      x: item.part_ressources_propres || 0,
      y: item.charges_de_personnel_produits_encaissables || 0,
      name: item.etablissement_actuel_lib,
      effectifs: item.effectif_sans_cpge,
    })),
  }));

  return {
    chart: {
      type: "scatter",
      height: 550,
      backgroundColor: "transparent",
    },
    title: {
      text: undefined,
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
      title: {
        text: "Autonomie financière (%)",
        style: {
          color: "var(--text-default-grey)",
          fontWeight: "bold",
        },
      },
      labels: {
        formatter: function () {
          return `${this.value}%`;
        },
        style: {
          color: "var(--text-default-grey)",
        },
      },
      gridLineWidth: 1,
      gridLineColor: "var(--border-default-grey)",
    },
    yAxis: {
      title: {
        text: "Charges de personnel / Produits (%)",
        style: {
          color: "var(--text-default-grey)",
          fontWeight: "bold",
        },
      },
      labels: {
        formatter: function () {
          return `${this.value}%`;
        },
        style: {
          color: "var(--text-default-grey)",
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
          <div style="font-weight:bold;margin-bottom:5px;color:${this.color}">${
          this.series.name
        }</div>
          <div style="font-weight:bold;font-size:14px;margin-bottom:8px">${
            point.name
          }</div>
          <div style="margin-bottom:4px">
            <span style="color:var(--text-default-grey)">Autonomie financière :</span>
            <strong> ${point.x.toFixed(2)}%</strong>
          </div>
          <div style="margin-bottom:4px">
            <span style="color:var(--text-default-grey)">Charges personnel :</span>
            <strong> ${point.y.toFixed(2)}%</strong>
          </div>
          <div>
            <span style="color:var(--text-default-grey)">Effectifs :</span>
            <strong> ${Highcharts.numberFormat(
              point.effectifs,
              0,
              ",",
              " "
            )}</strong>
          </div>
        </div>`;
      },
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 5,
          states: {
            hover: {
              enabled: true,
              lineColor: "rgb(100,100,100)",
            },
          },
        },
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        fontSize: "11px",
        color: "var(--text-default-grey)",
      },
    },
    credits: {
      enabled: false,
    },
    series,
  };
};

export const createEfficienceChartOptions = (
  data: AutonomieData[],
  groupBy: "type" | "region"
): Highcharts.Options => {
  const groups = new Map<string, AutonomieData[]>();

  data.forEach((item) => {
    const key = groupBy === "type" ? item.type : item.region;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });

  const colors = CHART_COLORS.palette;
  const series: Highcharts.SeriesScatterOptions[] = Array.from(
    groups.entries()
  ).map(([groupName, items], idx) => ({
    name: groupName,
    type: "scatter",
    color: colors[idx % colors.length],
    data: items.map((item) => ({
      x: item.scsp_par_etudiants || 0,
      y: item.taux_encadrement || 0,
      name: item.etablissement_actuel_lib,
      effectifs: item.effectif_sans_cpge,
    })),
  }));

  return {
    chart: {
      type: "scatter",
      height: 550,
      backgroundColor: "transparent",
    },
    title: {
      text: undefined,
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
      title: {
        text: "SCSP par étudiant (€)",
        style: {
          color: "var(--text-default-grey)",
          fontWeight: "bold",
        },
      },
      labels: {
        formatter: function () {
          return (
            Highcharts.numberFormat(Number(this.value), 0, ",", " ") + " €"
          );
        },
        style: {
          color: "var(--text-default-grey)",
        },
      },
      gridLineWidth: 1,
      gridLineColor: "var(--border-default-grey)",
    },
    yAxis: {
      title: {
        text: "Taux d'encadrement (%)",
        style: {
          color: "var(--text-default-grey)",
          fontWeight: "bold",
        },
      },
      labels: {
        formatter: function () {
          return `${this.value}%`;
        },
        style: {
          color: "var(--text-default-grey)",
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
          <div style="font-weight:bold;margin-bottom:5px;color:${this.color}">${
          this.series.name
        }</div>
          <div style="font-weight:bold;font-size:14px;margin-bottom:8px">${
            point.name
          }</div>
          <div style="margin-bottom:4px">
            <span style="color:var(--text-default-grey)">SCSP/étudiant :</span>
            <strong> ${Highcharts.numberFormat(point.x, 0, ",", " ")} €</strong>
          </div>
          <div style="margin-bottom:4px">
            <span style="color:var(--text-default-grey)">Taux d'encadrement :</span>
            <strong> ${point.y.toFixed(2)}%</strong>
          </div>
          <div>
            <span style="color:var(--text-default-grey)">Effectifs :</span>
            <strong> ${Highcharts.numberFormat(
              point.effectifs,
              0,
              ",",
              " "
            )}</strong>
          </div>
        </div>`;
      },
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 5,
          states: {
            hover: {
              enabled: true,
              lineColor: "rgb(100,100,100)",
            },
          },
        },
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        fontSize: "11px",
        color: "var(--text-default-grey)",
      },
    },
    credits: {
      enabled: false,
    },
    series,
  };
};
