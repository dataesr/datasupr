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
    legend: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          format: "{point.y}",
        },
      },
    },
    series: [{ data: series }],
    tooltip: {
      format: `<b>{point.name}</b> ${format1} <b>{point.y}</b> ${format2}`,
    },
  };
}

export {
  getCategoriesAndSeries,
  getOptions,
};
