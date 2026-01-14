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
  "horizon 2020": "#ffd500",
  "horizon europe": "#e39700",
  "i-lab": "#de5b91",
  "i-nov": "#ad5096",
  "i-phd": "#7f4596",
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
  // Sort according to object sortedFunders
  funders = Object.keys(sortedFunders).map((sortedFunder) => funders.find((funder) => sortedFunder === funder.toLowerCase()));
  funders = funders.filter((funder) => !!funder).reverse();
  const series: any[] = funders.map((type) => ({
    color: getColorFromFunder(type),
    data: buckets.map((item: { by_funder: { buckets: any[]; }; }) => getKey(item.by_funder.buckets.find((i) => i.key === type))),
    name: type
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

const getLabelFromGps = (label: string) => {
  const allNames = label.toString().split('###')[1].split('|||').map((item) => ({
    label: item.split('_')[1],
    lang: item.split('_')[0]?.toLowerCase(),
  }));
  return allNames.find((item) => item.lang === 'fr')?.label ?? allNames.find((item) => item.lang === 'en')?.label;
}
const getLabelFromName = (label: string | number) => {
  try {
    return label.toString().split('_')[1].split('|')[0];
  } catch (error) {
    return label.toString();
  }
};

export {
  formatCompactNumber,
  getCategoriesAndSeries,
  getCategoriesAndSeriesBudget,
  getColorFromFunder,
  getGeneralOptions,
  getLabelFromGps,
  getLabelFromName,
  sortedFunders,
};
