export default function Options(data) {
  if (!data) return null;

  const filteredData = data.filter((item) => item.country !== "all")[0].data;

  const years = new Set();
  filteredData.forEach((item) => years.add(item.year));

  const typesOfFinancing = {
    // COFUND: {
    //   color: "#000000",
    //   name: "COFUND",
    // },
    CSA: {
      color: "#F28E2B",
      name: "CSA",
    },
    EIC: {
      color: "#D5DBEF",
      name: "EIC",
    },
    ERC: {
      color: "#76B7B2",
      name: "ERC",
    },
    IA: {
      color: "#B07AA1",
      name: "IA",
    },
    // KICS: {
    //   color: "#000000",
    //   name: "KICS",
    // },
    MSCA: {
      color: "#EDC948",
      name: "MSCA",
    },
    // PCP: {
    //   color: "#000000",
    //   name: "PCP",
    // },
    RIA: {
      color: "#BAB0AC",
      name: "RIA",
    },
  };

  const series = Object.keys(typesOfFinancing).map((key) => ({
    name: typesOfFinancing[key].name,
    data: filteredData
      .filter((item) => item.action_id === key)
      .map((item) => item.total_evaluated / 1000000),
    color: typesOfFinancing[key].color,
  }));

  const series2 = Object.keys(typesOfFinancing).map((key) => ({
    name: typesOfFinancing[key].name,
    xAxis: 1,
    data: filteredData
      .filter((item) => item.action_id === key)
      .map((item) => item.total_successful / 1000000),
    color: typesOfFinancing[key].color,
  }));

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
          lineColor: null,
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return (this.y as number).toFixed(1);
          },
        },
      },
    },
    series: series.concat(series2),
  };
}
