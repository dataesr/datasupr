import * as Highcharts from "highcharts";

export const createEstablishmentTypeChartOptions = (
  categories: string[],
  data: number[],
  displayMode: "effectif" | "percentage"
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
        color: "var(--text-default-grey)",
      },
    },
  },
  yAxis: {
    min: 0,
    max: displayMode === "percentage" ? 100 : undefined,
    title: {
      text:
        displayMode === "percentage"
          ? "Part des enseignants"
          : "Nombre d'enseignants",
      align: "high" as const,
      style: {
        color: "var(--text-default-grey)",
      },
    },
    labels: {
      overflow: "justify" as const,
      format: displayMode === "percentage" ? "{value}%" : "{value}",
      style: {
        color: "var(--text-default-grey)",
      },
    },
  },
  tooltip: {
    pointFormat: `<b>{point.category}</b>: {point.y:,.${
      displayMode === "percentage" ? 1 : 0
    }f}${displayMode === "percentage" ? "%" : " enseignants"}`,
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        format: `{point.y:,.${displayMode === "percentage" ? 1 : 0}f}${
          displayMode === "percentage" ? "%" : ""
        }`,
        style: {
          fontWeight: "bold",
          color: "var(--text-inverted-grey)",
          textOutline: "none",
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
