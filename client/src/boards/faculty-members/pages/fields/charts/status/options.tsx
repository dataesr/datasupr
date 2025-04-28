import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";

interface StatusOptionsProps {
  disciplines: Array<{
    fieldLabel: string;
    enseignantsChercheurs: number;
    autresTitulaires: number;
    nonTitulaires: number;
  }>;
  title?: string;
}

export default function StatusOptions({
  disciplines,
  title = "Répartition par statut du personnel enseignant",
}: StatusOptionsProps): HighchartsInstance.Options | null {
  if (!disciplines || disciplines.length === 0) return null;

  const isSingleDiscipline = disciplines.length === 1;

  if (isSingleDiscipline) {
    const discipline = disciplines[0];
    const totalCount =
      discipline.enseignantsChercheurs +
      discipline.autresTitulaires +
      discipline.nonTitulaires;

    const newOptions: HighchartsInstance.Options = {
      chart: {
        type: "pie",
        height: 400,
      },
      title: {
        text: title,
        style: { fontSize: "16px", fontWeight: "bold" },
      },
      subtitle: {
        text: `Total: ${totalCount.toLocaleString()} personnes`,
        style: { fontSize: "14px", color: "#666" },
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
      colors: ["#000091", "#4B9DFF", "#6a6a6a"],
      series: [
        {
          name: "Répartition",
          colorByPoint: true,
          type: "pie",
          innerSize: "40%",
          data: [
            {
              name: "Enseignants-chercheurs",
              y: discipline.enseignantsChercheurs,
              sliced: true,
              selected: true,
              dataLabels: {
                enabled: true,
                format:
                  "<b>Enseignants-chercheurs</b>: {point.percentage:.1f}%<br/>({point.y} pers.)",
              },
            },
            {
              name: "Autres titulaires",
              y: discipline.autresTitulaires,
              dataLabels: {
                format:
                  "<b>Autres titulaires</b>: {point.percentage:.1f}%<br/>({point.y} pers.)",
              },
            },
            {
              name: "Non-titulaires",
              y: discipline.nonTitulaires,
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

  const categories = disciplines.map((d) => d.fieldLabel);
  const enseignantsChercheursData = disciplines.map(
    (d) => d.enseignantsChercheurs
  );
  const autresTitulairesData = disciplines.map((d) => d.autresTitulaires);
  const nonTitulairesData = disciplines.map((d) => d.nonTitulaires);

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "column",
      height: 450,
      marginLeft: 50,
    },
    title: {
      text: title,
      style: { fontSize: "16px", fontWeight: "bold" },
    },
    xAxis: {
      categories,
      labels: {
        style: {
          color: "#000000",
          fontWeight: "600",
          fontSize: "13px",
          textOutline: "1px contrast",
        },
      },
    },
    yAxis: {
      min: 0,
      title: { text: null }, // Supprime le texte sur l'axe Y
      stackLabels: {
        enabled: true,
        format: "{total}",
        style: {
          fontWeight: "bold",
          textOutline: "1px white",
        },
      },
    },
    tooltip: {
      formatter: function () {
        const pointY = this.point?.y || 0;
        const pointCategory = this.point?.category || "";
        const seriesName = this.series?.name || "";

        const disciplineIndex = categories.indexOf(String(pointCategory));
        if (disciplineIndex < 0) return "";

        const discipline = disciplines[disciplineIndex];
        const total =
          discipline.enseignantsChercheurs +
          discipline.autresTitulaires +
          discipline.nonTitulaires;
        const percentage = Math.round((pointY / total) * 100);

        let tooltipText = `<b>${pointCategory}</b><br>
                         ${seriesName}: ${pointY.toLocaleString()} (${percentage}%)<br>
                         Total: ${total.toLocaleString()}`;

        if (seriesName === "Enseignants-chercheurs") {
          tooltipText += "<br><i>(Tous titulaires)</i>";
        }

        return tooltipText;
      },
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
          formatter: function () {
            const y = this.point?.y || 0;
            interface StackPoint extends Highcharts.Point {
              stackTotal?: number;
            }
            const total = (this.point as StackPoint)?.stackTotal || 1;
            const percentage = Math.round((y / total) * 100);
            return percentage > 5 ? `${percentage}%` : "";
          },
        },
        borderRadius: 3,
        pointPadding: 0.2,
        groupPadding: 0.1,
      },
      series: {
        borderWidth: 0,
        animation: {
          duration: 1000,
        },
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        fontWeight: "normal",
      },
    },
    credits: { enabled: false },
    series: [
      {
        name: "Enseignants-chercheurs",
        data: enseignantsChercheursData,
        color: "#000091",
        type: "column",
      },
      {
        name: "Autres titulaires",
        data: autresTitulairesData,
        color: "#4B9DFF",
        type: "column",
      },
      {
        name: "Non-titulaires",
        data: nonTitulairesData,
        color: "#6a6a6a",
        type: "column",
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}
