import Highcharts from "highcharts";

interface ItemData {
  itemName: string;
  itemCode: string;
  hommesCount: number;
  hommesPercent: number;
  femmesCount: number;
  femmesPercent: number;
  totalCount: number;
  isSelected: boolean;
}

interface BarChartOptionsParams {
  sortedItems: ItemData[];
  categories: string[];
  femmesData: Array<{ y: number; color: string }>;
  hommesData: Array<{ y: number; color: string }>;
  selectedYear: string;
  contextId: string | null;
  stackType: "percent" | "normal";
  labels: {
    singular: string;
    plural: string;
    urlPath: string;
  };
  onItemClick: (itemCode: string) => void;
}

export const createBarChartOptions = ({
  sortedItems,
  categories,
  femmesData,
  hommesData,
  selectedYear,
  contextId,
  stackType,
  labels,
  onItemClick,
}: BarChartOptionsParams): Highcharts.Options => ({
  chart: {
    type: "bar",
    height: Math.max(400, categories.length * 65),
    marginLeft: 0,
    style: {
      fontFamily: "Marianne, sans-serif",
    },
  },
  exporting: { enabled: false },
  title: {
    text: "",
  },
  subtitle: {
    text: "",
    // text: `Année universitaire ${selectedYear}${
    //   contextId
    //     ? ` - ${
    //         labels.singular.charAt(0).toUpperCase() + labels.singular.slice(1)
    //       } sélectionnée mise en évidence`
    //     : ""
    // }`,
    // style: {
    //   color: "#666666",
    //   fontSize: "14px",
    // },
    // align: "left",
  },
  credits: { enabled: false },
  xAxis: {
    categories,
    title: { text: null },
    labels: {
      useHTML: true,
      align: "left",
      x: 10,
      style: {
        fontSize: "13px",
      },
    },
  },
  yAxis: {
    visible: stackType === "percent",
    max: stackType === "percent" ? 100 : undefined,
    title: {
      text: stackType === "percent" ? "Pourcentage" : "Effectif",
    },
    labels: {
      formatter: function () {
        return stackType === "percent" ? `${this.value}%` : `${this.value}`;
      },
    },
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      stacking: stackType,
      cursor: "pointer",
      point: {
        events: {
          click: function () {
            const itemCode = sortedItems[this.index]?.itemCode;
            if (itemCode && itemCode !== contextId) {
              onItemClick(itemCode);
            }
          },
        },
      },
    },
    bar: {
      borderRadius: 4,
      borderWidth: 0,
      pointWidth: 40,
      pointPadding: 1,
      groupPadding: 0.1,
    },
  },
  tooltip: {
    formatter: function () {
      const itemIndex = this.point.index!;
      const itemData = sortedItems[itemIndex];
      const value = Number(this.point.y).toFixed(1);
      const isSelected = itemData?.isSelected;

      return `<b>${itemData.itemName}${
        isSelected ? " (sélectionnée)" : ""
      }</b><br/>
        <span style="color:${this.point.color}">\u25CF</span> ${
        this.series.name
      }: ${value}${stackType === "percent" ? "%" : ""}<br/>
      Total: ${itemData.totalCount.toLocaleString()} enseignants`;
    },
  },
  series: [
    {
      name: "Femmes",
      data: femmesData,
      type: "bar",
    },
    {
      name: "Hommes",
      data: hommesData,
      type: "bar",
    },
  ],
});
