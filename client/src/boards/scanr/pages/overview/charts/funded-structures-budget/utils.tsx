import { formatCompactNumber, getGeneralOptions, getLabelFromName } from '../../../../utils';

function getSeries(data: { aggregations: { by_participant: { buckets: any[]; }; }; }) {
  const buckets = data?.aggregations?.by_participant?.buckets ?? [];
  const categories = buckets.map((item: { key: string; }) => getLabelFromName(item.key));
  let allTypes = buckets.map((items) => items.by_type.buckets.map((item: { key: string; }) => item.key)).flat();
  allTypes = Array.from(new Set(allTypes)).reverse();
  const series = allTypes.map((type) => ({
    name: type,
    data: buckets.map((item: { by_type: { buckets: any[]; }; }) => item.by_type.buckets.find((i) => i.key === type)?.sum_budget.value ?? 0),
  }));
  return { categories, series };
}

function getOptions(
  series: any,
  categories: any,
  title: string,
  selectedYearEnd: string,
  selectedYearStart: string,
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
        return `<b>${this.key}</b> a participé à des projets financés par ${this.series.name}, à hauteur de <b>${formatCompactNumber(this.y)} €</b> sur la période ${selectedYearStart}-${selectedYearEnd}`
      }
    },
    series,
  };
}

export {
  getSeries,
  getOptions,
};
