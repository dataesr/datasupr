import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../constants/colors";

interface EvolutionData {
  annee: number;
  recettes_propres: number;
  scsp: number;
}

interface EtablissementEvolution {
  nom: string;
  series: EvolutionData[];
  color: string;
}

export const createMultiEtablissementsChartOptions = (
  etablissements: EtablissementEvolution[],
  metric: "recettes_propres" | "scsp" | "total"
): Highcharts.Options => {
  const colors = CHART_COLORS.palette;

  const series: Highcharts.SeriesOptionsType[] = etablissements.map(
    (etab, idx) => {
      const data = etab.series.map((point) => {
        const value =
          metric === "total"
            ? point.recettes_propres + point.scsp
            : point[metric];
        return [point.annee, value];
      });

      return {
        name: etab.nom,
        type: "line",
        data,
        color: colors[idx % colors.length],
        marker: {
          enabled: true,
          radius: 4,
        },
      } as Highcharts.SeriesLineOptions;
    }
  );

  const metricLabel =
    metric === "recettes_propres"
      ? "Recettes propres"
      : metric === "scsp"
      ? "SCSP"
      : "Recettes totales (SCSP + Recettes propres)";

  return {
    chart: {
      type: "line",
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
      type: "category",
      title: {
        text: "Année d'exercice",
        style: {
          color: "var(--text-default-grey)",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          color: "var(--text-default-grey)",
        },
      },
      gridLineWidth: 0,
      lineColor: "var(--border-default-grey)",
    },
    yAxis: {
      title: {
        text: `${metricLabel} (€)`,
        style: {
          color: "var(--text-default-grey)",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          color: "var(--text-default-grey)",
        },
        formatter: function () {
          return (
            Highcharts.numberFormat(Number(this.value) / 1000000, 1) + " M€"
          );
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
      shared: true,
      formatter: function () {
        const points = this.points || [];
        let html = `<div style="padding:10px">
          <div style="font-weight:bold;margin-bottom:8px;font-size:14px">Année ${this.x}</div>`;

        points.forEach((point) => {
          html += `<div style="margin-bottom:4px">
            <span style="color:${point.color}">●</span>
            <span style="color:var(--text-default-grey)">${
              point.series.name
            }:</span>
            <strong> ${Highcharts.numberFormat(
              point.y!,
              0,
              ",",
              " "
            )} €</strong>
          </div>`;
        });

        html += "</div>";
        return html;
      },
    },
    plotOptions: {
      line: {
        lineWidth: 2,
        marker: {
          enabled: true,
          radius: 4,
          states: {
            hover: {
              enabled: true,
              lineColor: "var(--border-default-grey)",
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
        fontSize: "12px",
        color: "var(--text-default-grey)",
      },
    },
    credits: {
      enabled: false,
    },
    series,
  };
};

export const createTauxCroissanceChartOptions = (
  etablissements: EtablissementEvolution[],
  metric: "recettes_propres" | "scsp" | "total"
): Highcharts.Options => {
  const colors = CHART_COLORS.palette;

  const series: Highcharts.SeriesOptionsType[] = etablissements.map(
    (etab, idx) => {
      const tauxCroissance = etab.series.slice(1).map((point, i) => {
        const prev = etab.series[i];
        const prevValue =
          metric === "total" ? prev.recettes_propres + prev.scsp : prev[metric];
        const currentValue =
          metric === "total"
            ? point.recettes_propres + point.scsp
            : point[metric];

        const taux =
          prevValue > 0 ? ((currentValue - prevValue) / prevValue) * 100 : 0;
        return [point.annee, taux];
      });

      return {
        name: etab.nom,
        type: "column",
        data: tauxCroissance,
        color: colors[idx % colors.length],
      } as Highcharts.SeriesColumnOptions;
    }
  );

  const metricLabel =
    metric === "recettes_propres"
      ? "des recettes propres"
      : metric === "scsp"
      ? "du SCSP"
      : "des recettes totales";

  return {
    chart: {
      type: "column",
      height: 450,
      backgroundColor: "transparent",
    },
    title: {
      text: undefined,
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
      type: "category",
      title: {
        text: "Année d'exercice",
        style: {
          color: "var(--text-default-grey)",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          color: "var(--text-default-grey)",
        },
      },
      lineColor: "var(--border-default-grey)",
    },
    yAxis: {
      title: {
        text: `Taux de croissance ${metricLabel} (%)`,
        style: {
          color: "var(--text-default-grey)",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          color: "var(--text-default-grey)",
        },
        formatter: function () {
          return `${this.value}%`;
        },
      },
      gridLineColor: "var(--border-default-grey)",
      plotLines: [
        {
          value: 0,
          color: "var(--text-default-grey)",
          width: 2,
          zIndex: 2,
        },
      ],
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "var(--background-default-grey)",
      borderWidth: 1,
      borderColor: "var(--border-default-grey)",
      borderRadius: 8,
      shadow: false,
      shared: true,
      formatter: function () {
        const points = this.points || [];
        let html = `<div style="padding:10px">
          <div style="font-weight:bold;margin-bottom:8px;font-size:14px">Année ${this.x}</div>`;

        points.forEach((point) => {
          const sign = point.y! >= 0 ? "+" : "";
          const color = point.y! >= 0 ? "#27ae60" : "#e74c3c";
          html += `<div style="margin-bottom:4px">
            <span style="color:${point.color}">●</span>
            <span style="color:var(--text-default-grey)">${
              point.series.name
            }:</span>
            <strong style="color:${color}"> ${sign}${point.y!.toFixed(
            2
          )}%</strong>
          </div>`;
        });

        html += "</div>";
        return html;
      },
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderRadius: 3,
        groupPadding: 0.1,
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        fontSize: "12px",
        color: "var(--text-default-grey)",
      },
    },
    credits: {
      enabled: false,
    },
    series,
  };
};
