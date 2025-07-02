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
      colors: ["#000091", "#4B9DFF", "#FF6B6B"],
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
              color: "#4B9DFF",
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

  const categories = disciplines.map((d) => d.fieldLabel);
  const enseignantsChercheursData = disciplines.map(
    (d) => d.enseignantsChercheurs
  );
  const titulairesNonChercheursData = disciplines.map(
    (d) => d.titulairesNonChercheurs
  );
  const nonTitulairesData = disciplines.map((d) => d.nonTitulaires);

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "column",
      height: 450,
      marginLeft: 0,
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
          color: "#000000",
          fontWeight: "600",
          fontSize: "13px",
          textOutline: "1px contrast",
        },
        rotation: categories.length > 5 ? -45 : 0,
      },
    },
    yAxis: {
      min: 0,
      title: { text: null },
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
        const total = discipline.totalCount;
        const percentage = Math.round((pointY / total) * 100);

        const tooltipText = `<b>${pointCategory}</b><br>
                         ${seriesName}: ${pointY.toLocaleString()} (${percentage}%)<br>
                         Total: ${total.toLocaleString()}<br><br>`;

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
          style: {
            color: "white",
            textOutline: "1px contrast",
            fontWeight: "bold",
          },
        },
        borderRadius: 3,
        pointPadding: 0.1,
        groupPadding: 0.15,
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
      reversed: false,
    },
    credits: { enabled: false },
    series: [
      {
        name: "Non-titulaires",
        data: nonTitulairesData,
        color: "var(--blue-ecume-moon-675)",
        type: "column",
      },
      {
        name: "Titulaires",
        data: titulairesNonChercheursData,
        color: "var(--green-bourgeon-main-640)",
        type: "column",
      },
      {
        name: "Enseignants-chercheurs",
        data: enseignantsChercheursData,
        color: "var(--orange-terre-battue-main-645)",
        type: "column",
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}
