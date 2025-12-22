import { formatCompactNumber, getColorFromFunder, getGeneralOptions } from '../../../../utils';

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

function getOptions(
  series: any,
  categories: any,
  title: string,
  selectedStructure: string,
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
      formatter: function (this: any) {
        return `${selectedStructure} a participé au projet <b>${this.point.name}</b> financé à hauteur de <b>${formatCompactNumber(this.point.y)} €</b> par ${this.point.type}.`
      },
    },
  };
}

export {
  getCategoriesAndSeries,
  getOptions,
};
