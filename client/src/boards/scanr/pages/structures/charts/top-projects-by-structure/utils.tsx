import { formatCompactNumber } from '../../../../utils';

function getGeneralOptions(title: any, categories: any, title_x_axis: any, title_y_axis: any) {
  return {
    title: { text: title },
    chart: { height: "600px", type: "bar" },
    legend: { enabled: false },
    exporting: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          format: "{point.y}",
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

function getSeries(data: { hits: { hits: any[]; }; }) {
  const series = (data?.hits?.hits ?? []).map(
    (hit) => ({
      name: hit._source.label.en,
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
    tooltip: {
      formatter: function (this: any) {
        return `${selectedStructure} a participé au projet <b>${this.point.name}</b> financé à hauteur de <b>${formatCompactNumber(this.point.y)} €</b> par ${this.point.type}.`
      },
    },
    series: [{ data: series }],
  };
}

export {
  getSeries,
  getOptions,
};
