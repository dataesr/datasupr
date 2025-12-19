import { getGeneralOptions } from '../../../../utils';

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
  getOptions,
};
