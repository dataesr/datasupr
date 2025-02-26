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
    xAxis: [
      {
        type: "category",
        categories: Array.from(years),
        width: "48%",
        title: {
          text: "Projets évalués",
        },
      },
      {
        type: "category",
        categories: Array.from(years),
        offset: 0,
        left: "50%",
        width: "48%",
        title: {
          text: "Projets lauréats",
        },
      },
    ],
    yAxis: [
      {
        lineWidth: 1,
        lineColor: "#E6E6E6",
        min: 0,
        title: {
          text: "M€",
        },
      },
      {
        min: 0,
        title: {
          text: "",
        },
        lineWidth: 1,
        lineColor: "#E6E6E6",
        left: "75%",
      },
    ],
    tooltip: {
      valueSuffix: "",
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 3,
          // fillColor: "#FFFFFF",
          lineWidth: 2,
          lineColor: null,
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return this.y as number;
          },
        },
      },
    },
    series: [
      {
        name: "Europe plus innovante",
        data: filteredData
          .filter((item) => item.pilier_name_fr === "Europe plus innovante")
          .map((item) => item.total_coordination_number_evaluated),
        color: "#A558A0",
      },
      {
        name: "Excellence scientifique",
        data: filteredData
          .filter((item) => item.pilier_name_fr === "Excellence scientifique")
          .map((item) => item.total_coordination_number_evaluated),
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
          .map((item) => item.total_coordination_number_evaluated),
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
          .map((item) => item.total_coordination_number_evaluated),
        color: "#E4794A",
      },

      {
        name: "Europe plus innovante",
        xAxis: 1,
        data: filteredData
          .filter((item) => item.pilier_name_fr === "Europe plus innovante")
          .map((item) => item.total_coordination_number_successful),
        color: "#A558A0",
      },
      {
        name: "Excellence scientifique",
        xAxis: 1,
        data: filteredData
          .filter((item) => item.pilier_name_fr === "Excellence scientifique")
          .map((item) => item.total_coordination_number_successful),
        color: "#21AB8E",
      },
      {
        name: "Problématiques mondiales et compétitivité industrielle européenne",
        xAxis: 1,
        data: filteredData
          .filter(
            (item) =>
              item.pilier_name_fr ===
              "Problématiques mondiales et compétitivité industrielle européenne"
          )
          .map((item) => item.total_coordination_number_successful),
        color: "#223F3A",
      },
      {
        name: "Élargir la participation et renforcer l'espace européen de la recherche",
        xAxis: 1,
        data: filteredData
          .filter(
            (item) =>
              item.pilier_name_fr ===
              "Élargir la participation et renforcer l'espace européen de la recherche"
          )
          .map((item) => item.total_coordination_number_successful),
        color: "#E4794A",
      },
    ],
  };
}
