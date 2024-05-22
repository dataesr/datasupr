import translations from "../charts-config.json";

function getBuildQuery(bool, size) {
  return {
    size: 0,
    query: {
      bool,
    },
    aggs: {
      by_countries: {
        terms: {
          field: "countries.keyword",
          size,
        },
      },
    },
    track_total_hits: true,
  };
}

function getLabel(graph, id, currentLang) {
  return translations[graph] ? translations[graph][id][currentLang] : id;
}

function getGeneralOptions() {
  return {
    chart: { type: "column" },
    legend: { enabled: false },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: "{point.y:.1f}%",
        },
      },
    },
    credits: {
      enabled: false,
    },
  };
}

export { getBuildQuery, getLabel, getGeneralOptions };
