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

function getSeries(data) {
  const series = (data?.aggregations?.by_countries?.buckets ?? []).map(
    (item) => ({
      color: item.key === "FRA" ? "#cc0000" : "#808080",
      name: item.key,
      y: (item.doc_count / data.hits.total.value) * 100,
      number: item.doc_count,
    })
  );
  const categories = series.map(
    (country) => `${country.name} <br> (${country.number})`
  );

  return { series, categories };
}

function getOptions(series, categories, ip) {
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
    tooltip: {
      format: `<b>{point.name}</b> is involved in <b>{point.y:.2f}%</b> of ${ip} publications`,
    },
    series: [{ data: series }],
    xAxis: { categories, title: { text: "Country" } },
    yAxis: {
      title: { text: `Part of ${ip} publications` },
    },
    credits: {
      enabled: false,
    },
  };
}

function getLabel(id, translations, currentLang) {
  return translations[id] ? translations[id][currentLang] : id;
}

export { getBuildQuery, getSeries, getOptions, getLabel };
