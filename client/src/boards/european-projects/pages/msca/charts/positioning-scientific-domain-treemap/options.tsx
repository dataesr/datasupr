import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
// import "highcharts/modules/treemap";
import { CreateChartOptions } from "../../../../components/chart-ep";
import type { TreemapData } from "./query";
import { getI18nLabel } from "../../../../../../utils";
import i18n from "./i18n.json";

interface OptionsParams {
  data: TreemapData[];
  currentLang?: string;
}

export default function Options({ data, currentLang = "fr" }: OptionsParams): Highcharts.Options | null {
  if (!data || data.length === 0) return null;

  const titleText = getI18nLabel(i18n, "chart-title", currentLang);

  const newOptions: Highcharts.Options = {
    chart: {
      height: 600,
    },
    title: {
      text: titleText,
      style: {
        fontSize: "14px",
        fontWeight: "600",
      },
    },
    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        data: data.map((item) => ({
          name: item.name,
          value: item.value,
          color: item.color,
        })),
        tooltip: {
          pointFormat: "{point.name}: {point.value}",
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          style: {
            fontSize: "12px",
            fontWeight: "normal",
          },
        },
      },
    ],
  };

  return CreateChartOptions("treemap", newOptions);
}
