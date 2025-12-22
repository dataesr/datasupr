import { getColorFromFunder } from "../../../../utils";

function getCategoriesAndSeries(data: { aggregations: { by_funder_type: { buckets: any; }; }; }) {
  const series = (data?.aggregations?.by_funder_type?.buckets ?? []).map(
    (item: {
      unique_projects: any; key: string; doc_count: number;
    }) => ({
      color: getColorFromFunder(item.key),
      name: item.key,
      y: item.unique_projects.value,
    })
  );

  const categories = series.map((item: { name: any; }) => item.name);

  return { categories, series };
}

export { getCategoriesAndSeries };
