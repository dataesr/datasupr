const formatCompactNumber = (number: number) => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(number);
}

const getGeneralOptions = (title: string, categories: any[], title_x_axis: string, title_y_axis: string) => {
  return {
    title: { text: title },
    chart: { height: "800px", type: "bar" },
    credits: { enabled: false },
    exporting: { enabled: false },
    legend: { reversed: true },
    plotOptions: {
      series: {
        stacking: "normal"
      }
    },
    xAxis: { categories, title: { text: title_x_axis } },
    yAxis: { title: { text: title_y_axis } },
  };
}

const getLabelFromName = (label: string | number) => label.toString().split('_')[1].split('|')[0];

const getYears = () => Array.from(Array(25).keys()).map((item) => item + 2000);

export {
  formatCompactNumber,
  getGeneralOptions,
  getLabelFromName,
  getYears,
};
