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

function getOptions(
  series,
  categories,
  title,
  format1,
  format2,
  title_x_axis,
  title_y_axis
) {
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
    tooltip: {
      format: `<b>{point.name}</b> ${format1} <b>{point.y:.2f}%</b> ${format2}`,
    },
    series: [{ data: series }],
    xAxis: { categories, title: { text: title_x_axis } },
    yAxis: {
      title: { text: title_y_axis },
    },
    credits: {
      enabled: false,
    },
  };
}

function getLabel(graph, id, translations, currentLang) {
  return translations[graph] ? translations[graph][id][currentLang] : id;
}

export { getSeries, getOptions, getLabel };
