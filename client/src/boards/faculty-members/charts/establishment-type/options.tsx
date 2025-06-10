export const createEstablishmentTypeChartOptions = (
  categories: string[],
  data: number[],
  year: string
) => ({
  chart: {
    type: "column" as const,
  },
  title: {
    text: "Répartition du personnel enseignant par type d'établissement",
  },
  subtitle: {
    text: `Année universitaire ${year}`,
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
