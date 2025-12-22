import { formatCompactNumber, getGeneralOptions } from '../../../../utils';

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
  getOptions,
};
