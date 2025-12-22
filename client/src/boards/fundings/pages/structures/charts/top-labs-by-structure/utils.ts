import { getGeneralOptions } from '../../../../utils';

function getCategoriesAndSeries(data: { aggregations: { by_funder_type: { buckets: any; }; }; }) {
  const series = (data?.aggregations?.by_funder_type?.buckets ?? []).map(
    (item: { key: string; doc_count: number; }) => ({
      name: item.key,
      y: item.doc_count,
    })
  );

  const categories = series.map((item: { name: any; }) => item.name);

  return { categories, series };
}

export { getCategoriesAndSeries };
