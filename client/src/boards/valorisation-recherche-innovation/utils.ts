import HighchartsInstance from "highcharts";

import { createChartOptions } from "../../components/chart-wrapper/default-options";
import { getCssColor as getCssColorGlobal } from "../../utils/colors";
import { deepMerge } from "../../utils";

const years: number[] = Array.from(Array(11).keys()).map((item) => item + 2015);

const formatCompactNumber = (number: number): string => {
  const formatter = Intl.NumberFormat("fr", { notation: "compact" });
  return formatter.format(number);
};

const formatPercent = (number: number, decimals: number = 0): string => {
  const formatter = new Intl.NumberFormat("fr", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
    style: "percent",
  });
  return formatter.format(number);
};

const getEsQuery = ({ structures, yearMax = years[years.length - 1], yearMin = years[0] }:
  { structures?: (string | null)[], yearMax?: number | string | null, yearMin?: number | string | null }) => {
  const query: any = {
    size: 0,
    query: {
      bool: {
        filter: [
          // { range: { project_year: { gte: yearMin, lte: yearMax } } },
          // { term: { participant_isFrench: true } },
          // { term: { participant_status: "active" } },
          // { term: { participant_type: "institution" } },
          // { term: { participant_is_main_parent: 1 } },
          // { term: { "participant_kind.keyword": "Secteur public" } },
          // { terms: { "project_type.keyword": funders } },
          // { bool: { must_not: { terms: { "participant_typologie_1.keyword": typologiesExcluded } } } },
        ],
      },
    },
  };
  if (structures?.length ?? 0 > 0) {
    query.query.bool.filter.push({ terms: { "participant_id.keyword": structures } });
  };
  return query;
};

const getCssColor = ({ name, prefix = "" }: { name: string, prefix?: string }) => {
  let variableName: string = "";
  if (prefix?.length > 0) variableName += `${prefix}-`;
  variableName += name.toLowerCase().replace(/[^0-9a-z ]/g, "").replace(/  +/g, " ").replaceAll(" ", "-");
  return getCssColorGlobal(variableName);
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
  formatPercent,
  getCssColor,
  getEsQuery,
  getGeneralOptions,
  getYearRangeLabel,
  years,
};
