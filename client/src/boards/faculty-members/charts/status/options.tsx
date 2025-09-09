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
  displayAsPercentage: boolean;
}

export default function StatusOptions({
  disciplines,
  displayAsPercentage,
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
            format: displayAsPercentage
              ? "<b>{point.name}</b>: {point.percentage:.1f} %"
              : "<b>{point.name}</b>: {point.y} personnes",
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
        pointFormat: displayAsPercentage
          ? "{point.name}: <b>{point.y} personnes</b> ({point.percentage:.1f} %)"
          : "{point.name}: <b>{point.options.absoluteValue} personnes</b>",
        formatter: function () {
          const point = this.point as Highcharts.Point;
          if (displayAsPercentage) {
            return `${point.name}: <b>${(point.y ?? 0).toLocaleString(
              "fr-FR"
            )} personnes</b> (${
              point.percentage !== undefined
                ? point.percentage.toFixed(1)
                : "0.0"
            } %)`;
          } else {
            return `${point.name}: <b>${(point.y ?? 0).toLocaleString(
              "fr-FR"
            )} personnes</b>`;
          }
        },
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
              y: displayAsPercentage
                ? (discipline.enseignantsChercheurs / discipline.totalCount) *
                  100
                : discipline.enseignantsChercheurs,
              absoluteValue: discipline.enseignantsChercheurs,
              sliced: true,
              selected: true,
              color: "var(--orange-terre-battue-main-645)",
              dataLabels: {
                enabled: true,
                format: displayAsPercentage
                  ? "<b>Enseignants-chercheurs</b>: {point.percentage:.1f} %<br/>({point.absoluteValue} pers.)"
                  : "<b>Enseignants-chercheurs</b>: {point.y} pers.",
              },
            } as HighchartsInstance.PointOptionsObject,
            {
              name: "Titulaires non-chercheurs",
              y: displayAsPercentage
                ? (discipline.titulairesNonChercheurs / discipline.totalCount) *
                  100
                : discipline.titulairesNonChercheurs,
              absoluteValue: discipline.titulairesNonChercheurs,
              color: "var(--blue-cumulus-main-526)",
              dataLabels: {
                format: displayAsPercentage
                  ? "<b>Titulaires non-chercheurs</b>: {point.percentage:.1f} %<br/>({point.absoluteValue} pers.)"
                  : "<b>Titulaires non-chercheurs</b>: {point.y} pers.",
              },
            } as HighchartsInstance.PointOptionsObject,
            {
              name: "Non-permanents",
              y: displayAsPercentage
                ? (discipline.nonTitulaires / discipline.totalCount) * 100
                : discipline.nonTitulaires,
              absoluteValue: discipline.nonTitulaires,
              color: "var(--blue-ecume-moon-675)",
              dataLabels: {
                format: displayAsPercentage
                  ? "<b>Non-permanents</b>: {point.percentage:.1f} %<br/>({point.absoluteValue} pers.)"
                  : "<b>Non-permanents</b>: {point.y} pers.",
              },
            } as HighchartsInstance.PointOptionsObject,
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

  const categories = sortedDisciplines.map((d) => d.fieldLabel);

  const enseignantsChercheursData = sortedDisciplines.map((d) => ({
    y: displayAsPercentage
      ? Math.round((d.enseignantsChercheurs / d.totalCount) * 100 * 10) / 10
      : d.enseignantsChercheurs,
    count: d.enseignantsChercheurs,
    total: d.totalCount,
  }));

  const titulairesNonChercheursData = sortedDisciplines.map((d) => ({
    y: displayAsPercentage
      ? Math.round((d.titulairesNonChercheurs / d.totalCount) * 100 * 10) / 10
      : d.titulairesNonChercheurs,
    count: d.titulairesNonChercheurs,
    total: d.totalCount,
  }));

  const nonTitulairesData = sortedDisciplines.map((d) => ({
    y: displayAsPercentage
      ? Math.round((d.nonTitulaires / d.totalCount) * 100 * 10) / 10
      : d.nonTitulaires,
    count: d.nonTitulaires,
    total: d.totalCount,
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
      max: displayAsPercentage ? 100 : undefined,
      title: {
        text: displayAsPercentage ? "Pourcentage (%)" : "Nombre d'enseignants",
        style: {
          fontSize: "12px",
        },
      },
      labels: {
        format: displayAsPercentage ? "{value} %" : "{value}",
        formatter: function () {
          return displayAsPercentage
            ? `${this.value} %`
            : Number(this.value).toLocaleString("fr-FR");
        },
      },
    },
    tooltip: {
      useHTML: true,
      shared: true,
      formatter: function () {
        let s = `<span style="font-size: 10px">${this.x}</span><br/>`;
        let totalSum = 0;

        if (this.points) {
          type CustomPoint = Highcharts.Point & { count?: number };
          this.points.forEach(function (point) {
            totalSum += (point.point as CustomPoint).count ?? 0;
          });

          this.points.forEach(function (point) {
            const seriesName = point.series.name;
            const absoluteValue = (point.point as CustomPoint).count ?? 0;
            const percentage = (absoluteValue / totalSum) * 100;

            if (displayAsPercentage) {
              s += `<span style="color:${
                point.color
              }">\u25CF</span> ${seriesName}: <b>${(point.y ?? 0).toFixed(
                1
              )} %</b> (${absoluteValue.toLocaleString(
                "fr-FR"
              )} personnes)<br/>`;
            } else {
              s += `<span style="color:${
                point.color
              }">\u25CF</span> ${seriesName}: <b>${absoluteValue.toLocaleString(
                "fr-FR"
              )} personnes</b> (${percentage.toFixed(1)} %)<br/>`;
            }
          });
        }
        return s;
      },
    },
    plotOptions: {
      bar: {
        stacking: displayAsPercentage ? "normal" : undefined,
        dataLabels: {
          enabled: true,
          format: displayAsPercentage ? "{y:.1f} %" : "{point.count}",
          formatter: function () {
            if (displayAsPercentage) {
              return `${(this.y ?? 0).toFixed(1)} %`;
            } else {
              return Number(
                (this.point as { count?: number }).count
              ).toLocaleString("fr-FR");
            }
          },
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
        name: "Non-permanents",
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
