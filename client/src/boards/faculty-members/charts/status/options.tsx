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
      exporting: { enabled: false },
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

  const sortedDisciplines = [...disciplines]
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 10);

  const categories = sortedDisciplines.map(d => d.fieldLabel);

  const enseignantsChercheursData = sortedDisciplines.map(d => ({
    y: Math.round((d.enseignantsChercheurs / d.totalCount) * 100 * 10) / 10,
    count: d.enseignantsChercheurs,
    total: d.totalCount
  }));

  const titulairesNonChercheursData = sortedDisciplines.map(d => ({
    y: Math.round((d.titulairesNonChercheurs / d.totalCount) * 100 * 10) / 10,
    count: d.titulairesNonChercheurs,
    total: d.totalCount
  }));

  const nonTitulairesData = sortedDisciplines.map(d => ({
    y: Math.round((d.nonTitulaires / d.totalCount) * 100 * 10) / 10,
    count: d.nonTitulaires,
    total: d.totalCount
  }));

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "bar",
    },
    exporting: { enabled: false },
    title: {
      text: "",
    },
    xAxis: {
      categories,
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: "500",
        },
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Pourcentage (%)",
        style: {
          fontSize: "12px",
        },
      },
      labels: {
        format: "{value}%",
      },
    },
    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.1f}%</b> ({point.count} sur {point.total})<br/>',
      shared: true,
    },
    plotOptions: {
      bar: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
          format: "{y:.1f}%",
          style: {
            fontSize: "10px",
            fontWeight: "bold",
            textOutline: "1px contrast",
          },
          filter: {
            property: "y",
            operator: ">" as HighchartsInstance.OptionsOperatorValue,
            value: 5,
          },
        },
      },
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        fontWeight: "normal",
        fontSize: "11px",
      },
    },
    series: [
      {
        name: "Enseignants-chercheurs",
        data: enseignantsChercheursData,
        color: "var(--orange-terre-battue-main-645)",
        zIndex: 3,
        type: "bar",
      },
      {
        name: "Titulaires non-chercheurs",
        data: titulairesNonChercheursData,
        color: "var(--green-bourgeon-main-640)",
        zIndex: 2,
        type: "bar",
      },
      {
        name: "Non-titulaires",
        data: nonTitulairesData,
        color: "var(--blue-ecume-moon-675)",
        zIndex: 1,
        type: "bar",
      },
    ] as HighchartsInstance.SeriesOptionsType[],
    credits: { enabled: false },
  };

  return CreateChartOptions("bar", newOptions);
}