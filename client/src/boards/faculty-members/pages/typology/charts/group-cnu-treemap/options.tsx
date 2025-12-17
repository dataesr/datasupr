import Highcharts from "highcharts";
import { formatToPercent } from "../../../../../../utils/format";

interface TreemapData {
  id: string;
  name: string;
  value: number;
  colorValue: number;
  maleCount: number;
  femaleCount: number;
}

interface TreemapOptionsParams {
  selectedYear: string;
  treemapData: TreemapData[];
  contextId: string | null;
  labels: {
    singular: string;
    plural: string;
    groupSingular: string;
    groupPlural: string;
  };
}

export const createGroupTreemapOptions = ({
  treemapData,
}: TreemapOptionsParams): Highcharts.Options => ({
  chart: {
    type: "treemap",
    height: 600,
    marginLeft: 0,
    style: {
      fontFamily: "Marianne, sans-serif",
    },
  },
  tooltip: {
    formatter: function () {
      const point = this as unknown as TreemapData;
      const femalePercent =
        point.value > 0
          ? Math.round((point.femaleCount / point.value) * 100)
          : 0;
      const malePercent = 100 - femalePercent;

      return `<b>${point.name}</b><br>
             Effectif total: <b>${point.value.toLocaleString()}</b> enseignants<br>
             <span style="color:#e18b76">♀ Femmes: ${point.femaleCount.toLocaleString()} (${formatToPercent(
        femalePercent
      )})</span><br>
             <span style="color:#efcb3a">♂ Hommes: ${point.maleCount.toLocaleString()} (${formatToPercent(
        malePercent
      )})</span>`;
    },
  },
  exporting: { enabled: false },
  colorAxis: {
    minColor: "#efcb3a",
    maxColor: "#e18b76",
    stops: [
      [0, "#efcb3a"],
      [0.5, "#EFEFEF"],
      [1, "#e18b76"],
    ],
  },
  series: [
    {
      type: "treemap",
      layoutAlgorithm: "squarified",
      data: treemapData,
      dataLabels: {
        enabled: true,
        crop: false,
        overflow: "allow",
        style: {
          textOutline: "1px contrast",
          fontSize: "12px",
          fontWeight: "bold",
        },
        formatter: function () {
          const point = this as unknown as TreemapData;
          const femalePercent =
            point.value > 0
              ? Math.round((point.femaleCount / point.value) * 100)
              : 0;

          if (point.value > 1000) {
            return `<b>${
              point.name
            }</b><br>${point.value.toLocaleString()}<br>(${formatToPercent(
              femalePercent
            )} ♀)`;
          } else {
            return `${point.name}<br>${point.value.toLocaleString()}`;
          }
        },
      },
    },
  ],
  credits: { enabled: false },
});
