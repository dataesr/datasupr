import Highcharts from "highcharts";

interface TreemapData {
  id: string;
  name: string;
  value: number;
  colorValue: number;
  maleCount: number;
  femaleCount: number;
}

interface TreemapOptionsParams {
  title: string;
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
  title,
  selectedYear,
  treemapData,
  contextId,
  labels,
}: TreemapOptionsParams): Highcharts.Options => ({
  chart: {
    type: "treemap",
    height: 600,
    marginLeft: 0,
    style: {
      fontFamily: "Marianne, sans-serif",
    },
  },
  title: {
    text: title,
    style: {
      color: "#000000",
      fontSize: "18px",
      fontWeight: "bold",
    },
    align: "left",
  },
  subtitle: {
    text: `Année universitaire ${selectedYear} - ${treemapData.length} ${
      contextId ? labels.groupPlural : labels.plural
    }`,
    style: {
      color: "#666666",
      fontSize: "14px",
    },
    align: "left",
  },
  tooltip: {
    formatter: function () {
      const point = this.point as unknown as TreemapData;
      const femalePercent =
        point.value > 0
          ? Math.round((point.femaleCount / point.value) * 100)
          : 0;
      const malePercent = 100 - femalePercent;

      return `<b>${point.name}</b><br>
             Effectif total: <b>${point.value.toLocaleString()}</b> enseignants<br>
             <span style="color:#e18b76">♀ Femmes: ${point.femaleCount.toLocaleString()} (${femalePercent}%)</span><br>
             <span style="color:#efcb3a">♂ Hommes: ${point.maleCount.toLocaleString()} (${malePercent}%)</span>`;
    },
  },
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
          const point = this.point as unknown as TreemapData;
          const femalePercent =
            point.value > 0
              ? Math.round((point.femaleCount / point.value) * 100)
              : 0;

          if (point.value > 1000) {
            return `<b>${
              point.name
            }</b><br>${point.value.toLocaleString()}<br>(${femalePercent}% ♀)`;
          } else {
            return `${point.name}<br>${point.value.toLocaleString()}`;
          }
        },
      },
    },
  ],
  credits: { enabled: false },
});
