import { getGeneralOptions, getLabelFromName } from '../../../../utils';

function getSeries(data: { aggregations: { by_participant: { buckets: any[]; }; }; }) {
  const buckets = data?.aggregations?.by_participant?.buckets ?? [];
  const categories = buckets.map((item: { key: string; }) => getLabelFromName(item.key));
  let allTypes = buckets.map((items) => items.by_type.buckets.map((item: { key: string; }) => item.key)).flat();
  allTypes = Array.from(new Set(allTypes)).reverse();
  const series = allTypes.map((type) => ({
    name: type,
    data: buckets.map((item: { by_type: { buckets: any[]; }; }) => item.by_type.buckets.find((i) => i.key === type)?.doc_count ?? 0),
  }));
  return { categories, series };
}

function getOptions(
  series: any,
  categories: any,
  title: string,
  format1: string,
  format2: string,
  title_x_axis: string,
  title_y_axis: string
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
      format: `<b>{key}</b> ${format1} <b>{point.y}</b> ${format2} de la part <b>{series.name}</b>`,
    },
    series,
  };
}

export {
  getSeries,
  getOptions,
};
