import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../components/creat-chart-options";

interface StatusOptionsProps {
  disciplines: Array<{
    fieldLabel: string;
    totalCount: number;
    nonTitulaires: number;
    titulairesNonChercheurs: number;
    enseignantsChercheurs: number;
    totalTitulaires: number;
  }>;
}
export default function StatusOptions({
  disciplines,
}: StatusOptionsProps): HighchartsInstance.Options | null {
  if (!disciplines || disciplines.length === 0) return null;

  const isSingleDiscipline = disciplines.length === 1;

  if (isSingleDiscipline) {
    const discipline = disciplines[0];

    const newOptions: HighchartsInstance.Options = {
      chart: {
        type: "pie",
        height: 400,
      },
      title: {
        text: "",
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f}%",
            style: {
              textOutline: "1px contrast",
            },
          },
          showInLegend: true,
          size: "80%",
          innerSize: "40%",
          borderWidth: 3,
          borderColor: "#FFFFFF",
        },
        series: {
          animation: {
            duration: 800,
          },
        },
      },
      tooltip: {
        pointFormat:
          "{point.name}: <b>{point.y} personnes</b> ({point.percentage:.1f}%)",
      },
      legend: {
        enabled: true,
        layout: "horizontal",
        align: "center",
        verticalAlign: "bottom",
        itemStyle: {
          fontWeight: "normal",
        },
      },
      colors: [
        "var(--blue-cumulus-sun-368)",
        "var(--blue-cumulus-main-526)",
        "var(--blue-ecume-moon-675)",
      ],
      series: [
        {
          name: "Répartition par statut",
          colorByPoint: true,
          type: "pie",
          innerSize: "40%",
          data: [
            {
              name: "Enseignants-chercheurs",
              y: discipline.enseignantsChercheurs,
              sliced: true,
              selected: true,
              color: "var(--orange-terre-battue-main-645)",
              dataLabels: {
                enabled: true,
                format:
                  "<b>Enseignants-chercheurs</b>: {point.percentage:.1f}%<br/>({point.y} pers.)",
              },
            },
            {
              name: "Titulaires non-chercheurs",
              y: discipline.titulairesNonChercheurs,
              color: "var(--blue-cumulus-main-526)",
              dataLabels: {
                format:
                  "<b>Titulaires non-chercheurs</b>: {point.percentage:.1f}%<br/>({point.y} pers.)",
              },
            },
            {
              name: "Non-titulaires",
              y: discipline.nonTitulaires,
              color: "var(--blue-ecume-moon-675)",
              dataLabels: {
                format:
                  "<b>Non-titulaires</b>: {point.percentage:.1f}%<br/>({point.y} pers.)",
              },
            },
          ],
        } as HighchartsInstance.SeriesPieOptions,
      ],
      credits: { enabled: false },
    };

    return CreateChartOptions("pie", newOptions);
  }
  disciplines.sort((a, b) => b.totalCount - a.totalCount);

  const categories = disciplines.map((d) => d.fieldLabel);

  const colorEnseignantsChercheurs = "var(--orange-terre-battue-main-645)";
  const colorTitulaires = "var(--green-bourgeon-main-640)";
  const colorEffectifTotal = "var(--beige-gris-galet-950)";

  const backgroundData = disciplines.map((d) => ({
    y: d.totalCount,
  }));

  const titulairesData = disciplines.map((d) => ({
    y: d.enseignantsChercheurs + d.titulairesNonChercheurs,
  }));

  const enseignantsChercheursData = disciplines.map((d) => ({
    y: d.enseignantsChercheurs,
    percent: Math.round((d.enseignantsChercheurs / d.totalCount) * 100),
    percentOfTitulaires:
      d.enseignantsChercheurs + d.titulairesNonChercheurs > 0
        ? Math.round(
            (d.enseignantsChercheurs /
              (d.enseignantsChercheurs + d.titulairesNonChercheurs)) *
              100
          )
        : 0,
  }));

  const percentTitulaires = disciplines.map((d) =>
    Math.round(
      ((d.enseignantsChercheurs + d.titulairesNonChercheurs) / d.totalCount) *
        100
    )
  );

  const percentNonTitulaires = disciplines.map((d) =>
    Math.round((d.nonTitulaires / d.totalCount) * 100)
  );

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "column",
      height: Math.max(450, 100 + categories.length * 40),
      marginLeft: 120,
      marginRight: 200,
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    title: {
      text: "",
    },
    xAxis: {
      categories,
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: "500",
        },
        rotation: categories.length > 4 ? -45 : 0,
        align: categories.length > 4 ? "right" : "center",
      },
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'enseignants",
        style: {
          fontSize: "12px",
          color: "var(--label-color)",
        },
      },
      labels: {
        formatter: function () {
          return this.value.toLocaleString();
        },
        style: {
          fontSize: "11px",
        },
      },
      gridLineDashStyle: "Dash",
      gridLineColor: "var(--beige-gris-galet-975)",
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        const point = this.point as HighchartsInstance.Point & {
          percent?: number;
          percentOfTitulaires?: number;
        };
        const index = this.point.index;
        const discipline = disciplines[index];

        if (this.series.name === "Enseignants-chercheurs") {
          return `
            <div style="padding:10px; min-width:200px;">
              <h4 style="margin:0 0 8px 0">${categories[index]}</h4>
              <div style="margin-bottom:8px;">
                <b>Enseignants-chercheurs:</b> ${point.y?.toLocaleString() || 0}
                <br><small>(${point.percent}% du total, ${
            point.percentOfTitulaires
          }% des titulaires)</small>
              </div>
              <hr style="margin:8px 0; border-top:1px solid var(--beige-gris-galet-975)">
              <div>
                <b>Titulaires:</b> ${(
                  discipline.enseignantsChercheurs +
                  discipline.titulairesNonChercheurs
                ).toLocaleString()}
                <br><small>(${percentTitulaires[index]}% du total)</small>
              </div>
              <div>
                <b>Non-titulaires:</b> ${discipline.nonTitulaires.toLocaleString()}
                <br><small>(${percentNonTitulaires[index]}% du total)</small>
              </div>
              <hr style="margin:8px 0; border-top:1px solid var(--beige-gris-galet-975)">
              <div><b>Total:</b> ${discipline.totalCount.toLocaleString()}</div>
            </div>
          `;
        }

        return false;
      },
      backgroundColor: "var(--beige-gris-galet-975)",
      borderWidth: 1,
      borderColor: "var(--beige-gris-galet-950)",
      borderRadius: 6,
      shadow: true,
    },
    plotOptions: {
      column: {
        grouping: false,
        borderWidth: 0,
        pointPadding: 0.05,
        shadow: false,
      },
      series: {
        animation: {
          duration: 700,
        },
        states: {
          hover: {
            brightness: 0.1,
          },
        },
      },
    },
    legend: {
      enabled: true,
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      itemStyle: {
        fontWeight: "normal",
        fontSize: "11px",
        color: "var(--text-mention-grey)",
      },
      itemDistance: 10,
      symbolRadius: 2,
      symbolHeight: 8,
      symbolWidth: 8,
      padding: 10,
      itemMarginTop: 5,
      itemMarginBottom: 5,
      margin: 15,
      backgroundColor: "transparent",
      x: 20,
      floating: true,
      useHTML: true,
      width: 150,
    },
    credits: { enabled: false },
    series: [
      {
        name: "Effectif total",
        data: backgroundData,
        pointPadding: 0,
        groupPadding: 0.05,
        pointWidth: 45,
        enableMouseTracking: false,
        states: {
          hover: { enabled: false },
        },
        type: "column",
        showInLegend: true,
        legendIndex: 3,
        color: colorEffectifTotal,
      },
      {
        name: "Titulaires",
        data: titulairesData,
        pointPadding: 0.05,
        groupPadding: 0.05,
        pointWidth: 45,
        enableMouseTracking: false,
        pointPlacement: 0.1,
        states: {
          hover: { enabled: false },
        },
        type: "column",
        zIndex: 0,
        showInLegend: true,
        legendIndex: 2,
        color: colorTitulaires,
      },
      {
        name: "Enseignants-chercheurs",
        data: enseignantsChercheursData,
        pointWidth: 25,
        pointPadding: 0.05,
        groupPadding: 0.05,
        pointPlacement: 0.1,
        zIndex: 2,
        showInLegend: true,
        legendIndex: 1,
        color: colorEnseignantsChercheurs,
        dataLabels: {
          enabled: true,
          formatter: function () {
            const point = this.point as HighchartsInstance.Point & {
              percent?: number;
            };
            return `${point.percent}%`;
          },
          style: {
            fontSize: "11px",
            fontWeight: "bold",
            color: "#FFF",
            textOutline: "1px contrast",
          },
          y: -5,
        },
        type: "column",
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}
