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

function getLabel(id, currentLang) {
  return translations[id] ? translations[id][currentLang] : id;
}

export { getBuildQuery, getLabel };
