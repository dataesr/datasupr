function buildSeries(data) {
  const series = (data?.aggregations?.by_countries?.buckets ?? []).map((item) => ({
      color: item.key === 'France' ? '#cc0000' : '#808080',
      name: item.key,
      y: item.doc_count / data.hits.total.value * 100,
      number: item.doc_count
    }));
  const categories = series.map((country) => `${country.name} <br> (${country.number})`);

  return { series, categories};
};

export default buildSeries;