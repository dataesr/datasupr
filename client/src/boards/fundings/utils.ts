const sortedFunders = {
  "anr": "#738cff",
  "pia anr": "#3f5ffc",
  "pia hors anr": "#182a3d",
  "horizon 2020": "#ffd500",
  "horizon europe": "#e39700",
};

const years = Array.from(Array(11).keys()).map((item) => item + 2015).sort((a, b) => b - a);

const formatCompactNumber = (number: number): string => {
  const formatter = Intl.NumberFormat("fr", { notation: "compact" });
  return formatter.format(number);
}

const getColorFromFunder = (funder: string): string => {
  const funderLowerCase = funder.toLowerCase();
  return Object.keys(sortedFunders).includes(funderLowerCase) ? sortedFunders[funderLowerCase] : "#ccc";
}

const getGeneralOptions = (title: string, categories: any[], title_x_axis: string, title_y_axis: string) => {
  return {
    chart: { height: "600px", type: "bar" },
    credits: { enabled: false },
    exporting: { enabled: false },
    title: { text: title },
    xAxis: { categories, title: { text: title_x_axis } },
    yAxis: { title: { text: title_y_axis } },
  };
}

export {
  formatCompactNumber,
  getColorFromFunder,
  getGeneralOptions,
  years,
};
