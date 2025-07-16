import * as Highcharts from "highcharts";

export const createEstablishmentTypeChartOptions = (
  categories: string[],
  data: number[]
): Highcharts.Options => ({
  chart: {
    type: "column" as const,
    backgroundColor: "transparent",
  },
  exporting: { enabled: false },
  title: {
    text: "",
    align: "left" as Highcharts.AlignValue,
    style: {
      fontWeight: "bold",
      fontSize: "16px",
    },
  },
  xAxis: {
    categories: categories,
    title: {
      text: null,
    },
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: "Nombre d'enseignants",
      align: "high" as const,
    },
    labels: {
      overflow: "justify" as const,
    },
  },
  tooltip: {
    valueSuffix: " enseignants",
    pointFormat: "<b>{point.category}</b>: {point.y:,.0f} enseignants",
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
          color: "white",
          textOutline: "1px contrast",
        },
      },
      colorByPoint: true,
      colors: [
        "var(--blue-cumulus-main-526)", // Université
        "var(--green-archipel-main-557)", // Grand établissement
        "var(--orange-terre-battue-main-645)", // École
        "var(--purple-glycine-main-494)", // Autre établissement
      ],
    },
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      name: "Effectif total",
      data: data,
      type: "column" as const,
    },
  ],
  credits: { enabled: false },
});
