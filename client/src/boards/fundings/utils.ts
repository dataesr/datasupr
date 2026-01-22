import HighchartsInstance from "highcharts";

import { createChartOptions } from "../../components/chart-wrapper/default-options";

const funders = ["ANR", "PIA ANR", "PIA hors ANR", "Horizon 2020", "Horizon Europe"];

const sortedFunders = {
  "anr": "#738cff",
  "pia anr": "#3f5ffc",
  "pia hors anr": "#182a3d",
  "horizon 2020": "#ffd500",
  "horizon europe": "#e39700",
};

const typologies = ["Autres", "Ecoles et instituts", "Etablissements de santé",
  "Organismes de recherche", "Universités"];

const years: number[] = Array.from(Array(11).keys()).map((item) => item + 2015);

/**
 * From : https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 *
 * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).
 */
function deepMerge(target, source) {
  const isObject = (obj) => obj && typeof obj === "object";
  if (!isObject(target) || !isObject(source)) {
    return source;
  }
  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = deepMerge(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  return target;
};

const formatCompactNumber = (number: number): string => {
  const formatter = Intl.NumberFormat("fr", { notation: "compact" });
  return formatter.format(number);
};

const formatPerc = (number: number, decimals: number): string => {
  const formatter = new Intl.NumberFormat("fr", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(number);
};

const getColorByFunder = (funder: string): string => {
  const funderLowerCase = funder.toLowerCase();
  return Object.keys(sortedFunders).includes(funderLowerCase) ? sortedFunders[funderLowerCase] : "#ccc";
};

const getEsQuery = ({ structures, yearMax = years[years.length - 1], yearMin = years[0] }:
  { structures?: (string | null)[], yearMax?: number | string | null, yearMin?: number | string | null }) => {
  const query: any = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              project_year: {
                gte: yearMin,
                lte: yearMax,
              },
            },
          },
          {
            term: {
              participant_isFrench: true,
            },
          },
          {
            term: {
              participant_status: "active",
            },
          },
          {
            term: {
              participant_type: "institution",
            },
          },
          {
            term: {
              participant_is_main_parent: 1,
            },
          },
          {
            term: {
              "participant_kind.keyword": "Secteur public",
            },
          },
          {
            terms: {
              "project_type.keyword": funders,
            },
          },
          {
            terms: {
              "participant_typologie_1.keyword": typologies,
            },
          },
        ],
      },
    },
  };
  if (structures?.length ?? 0 > 0) {
    query.query.bool.filter.push({ terms: { "participant_id.keyword": structures } });
  };
  return query
};

const getGeneralOptions = (
  title: HighchartsInstance.TitleOptions["text"],
  categories: HighchartsInstance.XAxisOptions["categories"],
  title_x_axis: HighchartsInstance.XAxisTitleOptions["text"],
  title_y_axis: HighchartsInstance.YAxisTitleOptions["text"],
  type: HighchartsInstance.ChartOptions["type"] = "bar",
) => {
  return createChartOptions(type, {
    chart: { height: "600px" },
    title: { text: title },
    xAxis: { categories, title: { text: title_x_axis } },
    yAxis: { title: { text: title_y_axis } },
  });
};

const getYearRangeLabel = ({ isBold = false, yearMax, yearMin }: { isBold?: boolean, yearMax: string | null, yearMin: string | null }): string => {
  let label = "";
  if (yearMin === yearMax) {
    label += "en ";
    if (isBold) label += "<b>";
    label += `${yearMin}`;
    if (isBold) label += "</b>";
  } else {
    label += "entre ";
    if (isBold) label += "<b>";
    label += `${yearMin}`;
    if (isBold) label += "</b>";
    label += " et ";
    if (isBold) label += "<b>";
    label += `${yearMax}`;
    if (isBold) label += "</b>";
  }
  return label;
};

export {
  deepMerge,
  formatCompactNumber,
  formatPerc,
  funders,
  getColorByFunder,
  getEsQuery,
  getGeneralOptions,
  getYearRangeLabel,
  years,
};
