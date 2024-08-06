export default function Options(data) {
  if (!data) return null;

  const filteredDataCountry = data.filter((item) => item.country !== "all")[0]
    .data;
  const filteredDataAll = data.filter((item) => item.country === "all")[0].data;

  const years = new Set();
  filteredDataCountry.forEach((item) => years.add(item.year));

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
        text: "(%)",
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
            return (this.y as number).toFixed(1) + " %";
          },
        },
      },
    },
    series: [
      {
        name: "Europe plus innovante",
        data: filteredDataCountry
          .filter((item) => item.pilier_name_fr === "Europe plus innovante")
          .map(
            (item) =>
              Math.round(
                ((item.total_successful * 100) /
                  filteredDataAll.find(
                    (itemAll) =>
                      itemAll.year === item.year &&
                      itemAll.pilier_name_fr === item.pilier_name_fr
                  ).total_successful) *
                  10
              ) / 10
          ),
        color: "#A558A0",
      },
      {
        name: "Excellence scientifique",
        data: filteredDataCountry
          .filter((item) => item.pilier_name_fr === "Excellence scientifique")
          .map(
            (item) =>
              (item.total_successful * 100) /
              filteredDataAll.find(
                (itemAll) =>
                  itemAll.year === item.year &&
                  itemAll.pilier_name_fr === item.pilier_name_fr
              ).total_successful
          ),
        color: "#21AB8E",
      },
      {
        name: "Problématiques mondiales et compétitivité industrielle européenne",
        data: filteredDataCountry
          .filter(
            (item) =>
              item.pilier_name_fr ===
              "Problématiques mondiales et compétitivité industrielle européenne"
          )
          .map(
            (item) =>
              (item.total_successful * 100) /
              filteredDataAll.find(
                (itemAll) =>
                  itemAll.year === item.year &&
                  itemAll.pilier_name_fr === item.pilier_name_fr
              ).total_successful
          ),
        color: "#223F3A",
      },
      {
        name: "Élargir la participation et renforcer l'espace européen de la recherche",
        data: filteredDataCountry
          .filter(
            (item) =>
              item.pilier_name_fr ===
              "Élargir la participation et renforcer l'espace européen de la recherche"
          )
          .map(
            (item) =>
              (item.total_successful * 100) /
              filteredDataAll.find(
                (itemAll) =>
                  itemAll.year === item.year &&
                  itemAll.pilier_name_fr === item.pilier_name_fr
              ).total_successful
          ),
        color: "#E4794A",
      },
    ],
  };
}
