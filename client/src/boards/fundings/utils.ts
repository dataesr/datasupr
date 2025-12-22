const sortedFunders = {
  "anr": "#738cff",
  "pia anr": "#3f5ffc",
  "pia hors anr": "#182a3d",
  "inca": "#baff8c",
  "anses": "#002620",
  "sirano": "#4f8100",
  "iresp": "#2ac8b6",
  "phrc": "#7f7e53",
  "dim ile-de-france": "#e61e0b",
  "fp7": "#ffffb8",
  "h2020": "#ffd500",
  "horizon europe": "#e39700",
  "i-lab": "#d84ccc",
  "i-phd": "#642793",
  "partenariat hubet curien": "#704214",
  "thèses co-financées ademe": "#d1b38c",
};

const formatCompactNumber = (number: number) => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(number);
}

const getCategoriesAndSeries2 = (data: { aggregations: { by_participant: { buckets: any[]; }; }; }, getKey) => {
  const buckets = data?.aggregations?.by_participant?.buckets ?? [];
  const categories = buckets.map((item: { key: string; }) => getLabelFromName(item.key));
  let funders = buckets.map((items) => items.by_funder.buckets.map((item: { key: string; }) => item.key)).flat();
  // Remove duplicates
  funders =  [...new Set(funders)];
  // Sort accordung to object sortedFunders
  funders = Object.keys(sortedFunders).map((sortedFunder) => funders.find((funder) => sortedFunder === funder.toLowerCase()));
  funders = funders.filter((funder) => !!funder).reverse();
  const series: any[] = funders.map((type) => ({
    color: getColorFromFunder(type),
    data: buckets.map((item: { by_funder: { buckets: any[]; }; }) => {
      const tmp =  item.by_funder.buckets.find((i) => i.key === type);
      return getKey(tmp);
    }),
    name: type,
  }));
  return { categories, series };
}

const getCategoriesAndSeries = (data: { aggregations: { by_participant: { buckets: any[]; }; }; }) => getCategoriesAndSeries2(data, (item) => item?.doc_count ?? 0);

const getCategoriesAndSeriesBudget = (data: { aggregations: { by_participant: { buckets: any[]; }; }; }) => getCategoriesAndSeries2(data, (item) => item?.sum_budget?.value ?? 0)

const getColorFromFunder = (funder: string) => {
  const funderLowerCase = funder.toLowerCase();
  return Object.keys(sortedFunders).includes(funderLowerCase) ? sortedFunders[funderLowerCase] : "#ccc";
}

const getGeneralOptions = (title: string, categories: any[], title_x_axis: string, title_y_axis: string) => {
  return {
    chart: { height: "800px", type: "bar" },
    credits: { enabled: false },
    exporting: { enabled: false },
    legend: { reversed: true },
    plotOptions: { series: { stacking: "normal" } },
    title: { text: title },
    xAxis: { categories, title: { text: title_x_axis } },
    yAxis: { title: { text: title_y_axis } },
  };
}

const getIdFromName = (label: string | number) => label.toString().split('###')[0];
const getLabelFromName = (label: string | number) => label.toString().split('_')[1].split('|')[0];

const getYears = () => Array.from(Array(25).keys()).map((item) => item + 2000);

export {
  formatCompactNumber,
  getCategoriesAndSeries,
  getCategoriesAndSeriesBudget,
  getColorFromFunder,
  getGeneralOptions,
  getIdFromName,
  getLabelFromName,
  getYears,
  sortedFunders,
};
