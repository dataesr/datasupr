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
      valueSuffix: " (M€)",
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 3,
          // fillColor: "#FFFFFF",
          lineWidth: 2,
          lineColor: undefined,
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: any) {
            return (this.y as number).toFixed(1);
          },
        },
      },
    },
    series: [
      {
        name: "Europe plus innovante",
        data: filteredData.filter((item) => item.pilier_name_fr === "Europe plus innovante").map((item) => item.total_evaluated / 1000000),
        color: "#A558A0",
      },
      {
        name: "Excellence scientifique",
        data: filteredData.filter((item) => item.pilier_name_fr === "Excellence scientifique").map((item) => item.total_evaluated / 1000000),
        color: "#21AB8E",
      },
      {
        name: "Problématiques mondiales et compétitivité industrielle européenne",
        data: filteredData
          .filter((item) => item.pilier_name_fr === "Problématiques mondiales et compétitivité industrielle européenne")
          .map((item) => item.total_evaluated / 1000000),
        color: "#223F3A",
      },
      {
        name: "Élargir la participation et renforcer l'espace européen de la recherche",
        data: filteredData
          .filter((item) => item.pilier_name_fr === "Élargir la participation et renforcer l'espace européen de la recherche")
          .map((item) => item.total_evaluated / 1000000),
        color: "#E4794A",
      },

      {
        name: "Europe plus innovante",
        xAxis: 1,
        data: filteredData.filter((item) => item.pilier_name_fr === "Europe plus innovante").map((item) => item.total_successful / 1000000),
        color: "#A558A0",
      },
      {
        name: "Excellence scientifique",
        xAxis: 1,
        data: filteredData.filter((item) => item.pilier_name_fr === "Excellence scientifique").map((item) => item.total_successful / 1000000),
        color: "#21AB8E",
      },
      {
        name: "Problématiques mondiales et compétitivité industrielle européenne",
        xAxis: 1,
        data: filteredData
          .filter((item) => item.pilier_name_fr === "Problématiques mondiales et compétitivité industrielle européenne")
          .map((item) => item.total_successful / 1000000),
        color: "#223F3A",
      },
      {
        name: "Élargir la participation et renforcer l'espace européen de la recherche",
        xAxis: 1,
        data: filteredData
          .filter((item) => item.pilier_name_fr === "Élargir la participation et renforcer l'espace européen de la recherche")
          .map((item) => item.total_successful / 1000000),
        color: "#E4794A",
      },
    ],
  };
}
