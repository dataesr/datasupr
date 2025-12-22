import { getColorFromFunder } from '../../../../utils';

function getCategoriesAndSeries(data: { hits: { hits: any[]; }; }) {
  const series = (data?.hits?.hits ?? []).map(
    (hit) => ({
      color: getColorFromFunder(hit._source.type),
      name: hit._source.label?.fr ?? hit._source.label?.en,
      type: hit._source.type,
      y: hit._source.budgetTotal,
    })
  );

  const categories = series.map((item: { name: any; }) => item.name);

  return { categories, series };
}

export { getCategoriesAndSeries };
