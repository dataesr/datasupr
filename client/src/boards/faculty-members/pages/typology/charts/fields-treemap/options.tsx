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
  labels: {
    singular: string;
    plural: string;
  };
  onItemClick: (itemCode: string) => void;
}

export const createTreemapOptions = ({
  treemapData,
  onItemClick,
}: TreemapOptionsParams): Highcharts.Options => ({
  chart: {
    type: "treemap",
    height: 600,
    marginLeft: 0,
    style: {
      fontFamily: "Marianne, sans-serif",
    },
  },
  exporting: { enabled: false },
  title: {
    text: "",
  },
  tooltip: {
    formatter: function () {
      const point = this as unknown as TreemapData;
      const femalePercent = point.femaleCount
        ? Math.round(
            (point.femaleCount / (point.femaleCount + point.maleCount)) * 100
          )
        : 0;
      return `<b>${point.name}</b><br>
             Effectif total: <b>${point.value.toLocaleString()}</b> enseignants<br>
             <span style="color:#e18b76">♀ Femmes: ${point.femaleCount.toLocaleString()} (${femalePercent}&nbsp;%)</span><br>
             <span style="color:#efcb3a">♂ Hommes: ${point.maleCount.toLocaleString()} (${
        100 - femalePercent
      }&nbsp;%)</span><br><br>
      <em>Cliquez pour explorer en détail</em>`;
    },
  },
  colorAxis: {
    minColor: "#efcb3a",
    maxColor: "#e18b76",
    stops: [
      [0, "#efcb3a"],
      [0.4, "#f0e68c"],
      [0.5, "#EFEFEF"],
      [0.6, "#f0b7a8"],
      [1, "#e18b76"],
    ],
  },
  plotOptions: {
    treemap: {
      cursor: "pointer",
      point: {
        events: {
          click: function () {
            const itemCode = treemapData[this.index]?.id;
            if (itemCode) {
              onItemClick(itemCode);
            }
          },
        },
      },
    },
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
          color: "#000000",
        },
        formatter: function () {
          const point = this as unknown as TreemapData;
          const femalePercent =
            point.value > 0
              ? Math.round((point.femaleCount / point.value) * 100)
              : 0;

          if (point.value > 5000) {
            return `<b>${
              point.name
            }</b><br>${point.value.toLocaleString()} enseignants<br>(${femalePercent}&nbsp;% ♀)`;
          } else if (point.value > 1000) {
            return `${
              point.name
            }<br>${point.value.toLocaleString()}<br>${femalePercent}&nbsp;% ♀`;
          } else {
            return `${point.name}<br>${point.value.toLocaleString()}`;
          }
        },
      },
    },
  ],
  credits: { enabled: false },
});
