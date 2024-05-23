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
  return translations?.[graph]?.[id]?.[currentLang] ?? id;
}

function getGeneralOptions(title, categories, title_x_axis, title_y_axis) {
  return {
    title: { text: title },
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
    xAxis: { categories, title: { text: title_x_axis } },
    yAxis: {
      title: { text: title_y_axis },
    },
    credits: {
      enabled: false,
    },
  };
}

export { getBuildQuery, getLabel, getGeneralOptions };
