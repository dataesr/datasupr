const sortedFunders = {
  "anr": "#738cff",
  "pia anr": "#3f5ffc",
  "pia hors anr": "#182a3d",
  "horizon 2020": "#ffd500",
  "horizon europe": "#e39700",
};

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

const getIdFromStructure = (structure: string): string => {
  return structure?.split('###')?.[0] ?? structure;
}

const getLabelFromStructure = (structure: string): string => {
  return structure?.split('###')?.[1]?.split('|||')?.[0]?.split('_')?.[1] ?? structure;
}

export {
  formatCompactNumber,
  getColorFromFunder,
  getGeneralOptions,
  getIdFromStructure,
  getLabelFromStructure,
};
