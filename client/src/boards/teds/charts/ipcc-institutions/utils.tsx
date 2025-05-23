import translations from "../../charts-config.json";

function getBuildQuery(bool, size) {
  return {
    size: 0,
    query: {
      bool,
    },
    aggs: {
      by_french_tutelles: {
        terms: {
          field: "french_tutelles.keyword",
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
          format: "{point.number}",
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

function getSeries(data) {
  const series = (data?.aggregations?.by_french_tutelles?.buckets ?? []).map(
    (item) => ({
      color: item.key === "FRA" ? "#cc0000" : "#808080",
      name: item.key,
      number: item.doc_count,
    })
  );
  const categories = series.map(
    (french_tutelles) =>
      `${french_tutelles.name} <br> (${french_tutelles.number})`
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
  const generalOptions = getGeneralOptions(
    title,
    categories,
    title_x_axis,
    title_y_axis
  );
  return {
    ...generalOptions,
    tooltip: {
      format: `<b>{point.name}</b> ${format1} <b>{point.number}</b> ${format2}`,
    },
    series: [{ data: series }],
  };
}

export { getSeries, getOptions, getBuildQuery, getLabel };
