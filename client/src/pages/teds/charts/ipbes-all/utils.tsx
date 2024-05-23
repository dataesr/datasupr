import { getGeneralOptions } from "../utils";

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
  const generalOptions = getGeneralOptions(
    title,
    categories,
    title_x_axis,
    title_y_axis
  );
  return {
    ...generalOptions,
    legend: { enabled: false },
    tooltip: {
      format: `<b>{point.name}</b> ${format1} <b>{point.y:.2f}%</b> ${format2}`,
    },
    series: [{ data: series }],
  };
}

export { getSeries, getOptions };
