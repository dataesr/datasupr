export default function Options(data) {
  if (!data) return null;

  const filteredData = data.filter((item) => item.country !== "all")[0].data;

  const years = new Set();
  filteredData.forEach((item) => years.add(item.year));

  return {
    chart: {
      type: "line",
      height: 500,
      backgroundColor: "transparent",
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },

    xAxis: {
      categories: Array.from(years),
      crosshair: true,
      accessibility: {
        description: "Years",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "(M€)",
      },
    },
    tooltip: {
      valueSuffix: " (M€)",
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return (this.y as number).toFixed(1);
          },
        },
      },
    },
    series: [
      {
        name: "Europe plus innovante",
        data: filteredData
          .filter((item) => item.pilier_name_fr === "Europe plus innovante")
          .map((item) => item.total_evaluated / 1000000),
        color: "#A558A0",
      },
      {
        name: "Excellence scientifique",
        data: filteredData
          .filter((item) => item.pilier_name_fr === "Excellence scientifique")
          .map((item) => item.total_evaluated / 1000000),
        color: "#21AB8E",
      },
      {
        name: "Problématiques mondiales et compétitivité industrielle européenne",
        data: filteredData
          .filter(
            (item) =>
              item.pilier_name_fr ===
              "Problématiques mondiales et compétitivité industrielle européenne"
          )
          .map((item) => item.total_evaluated / 1000000),
        color: "#223F3A",
      },
      {
        name: "Élargir la participation et renforcer l'espace européen de la recherche",
        data: filteredData
          .filter(
            (item) =>
              item.pilier_name_fr ===
              "Élargir la participation et renforcer l'espace européen de la recherche"
          )
          .map((item) => item.total_evaluated / 1000000),
        color: "#E4794A",
      },
    ],
  };
}
