import type HighchartsInstance from "highcharts/es-modules/masters/highcharts.src.js";

import { createChartOptions } from "../../components/chart-wrapper/default-options";
import { getCssColor as getCssColorGlobal } from "../../utils/colors";

const YEAR_MIN = 2009;
const YEAR_MAX = 2025;
const years: number[] = Array.from(Array(YEAR_MAX - YEAR_MIN + 1).keys()).map((item) => item + YEAR_MIN);

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

const getEsQueryPatents = ({
  structureIds,
  yearMax = years[years.length - 1],
  yearMin = years[0],
}: {
  structureIds?: (string | null)[];
  yearMax?: number | string | null;
  yearMin?: number | string | null;
}) => {
  const query: any = {
    size: 0,
    query: {
      bool: {
        filter: [{ range: { "patents.yearPublication": { gte: yearMin, lte: yearMax } } }, { terms: { "applicants.ids.id.keyword": structureIds } }],
      },
    },
  };
  return query;
};

const getEsQueryPublications = ({
  structureIds,
  yearMax = years[years.length - 1],
  yearMin = years[0],
}: {
  structureIds?: (string | null)[];
  yearMax?: number | string | null;
  yearMin?: number | string | null;
}) => {
  const query: any = {
    size: 0,
    query: {
      bool: {
        filter: [
          { range: { year: { gte: yearMin, lte: yearMax } } },
          { terms: { "affiliations.id.keyword": structureIds } },
          { wildcard: { "structured_acknowledgments.private_companies.entity": "*" } },
        ],
      },
    },
  };
  return query;
};

const getEsQueryStartups = ({
  structures,
  yearMax = years[years.length - 1],
  yearMin = years[0],
}: {
  structures?: (string | null)[];
  yearMax?: number | string | null;
  yearMin?: number | string | null;
}) => {
  const query: any = {
    size: 0,
    query: {
      bool: {
        filter: [
          { range: { creationYear: { gte: yearMin, lte: yearMax } } },
          { term: { "startup_links.denormalized.isFrench": true } },
          { term: { "startup_links.denormalized.is_main_parent": 1 } },
          { term: { "startup_links.denormalized.kind.keyword": "Secteur public" } },
        ],
      },
    },
  };
  if (structures?.length ?? 0 > 0) {
    query.query.bool.filter.push({ terms: { "startup_links.structure.keyword": structures } });
  }
  return query;
};

const getCssColor = ({ name, prefix = "" }: { name: string; prefix?: string }) => {
  let variableName: string = "";
  if (prefix?.length > 0) variableName += `${prefix}-`;
  variableName += name
    .toLowerCase()
    .replace(/[^0-9a-z ]/g, "")
    .replace(/  +/g, " ")
    .replaceAll(" ", "-");
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

const getYearRangeLabel = ({ isBold = false, yearMax, yearMin }: { isBold?: boolean; yearMax: string | null; yearMin: string | null }): string => {
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
  formatCompactNumber,
  formatPercent,
  getCssColor,
  getEsQueryPatents,
  getEsQueryPublications,
  getEsQueryStartups,
  getGeneralOptions,
  getYearRangeLabel,
  years,
};
