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
  contextId,
  stackType,
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
        fontSize: "14px",
        color: "#6a6156",
      },
    },
  },
  yAxis: {
    visible: true,
    max: stackType === "percent" ? 100 : undefined,
    title: {
      text:
        stackType === "percent"
          ? "Part du personnel enseignant par sexe"
          : "Nombre de personnel enseignant par sexe",
    },
    labels: {
      formatter: function () {
        if (typeof this.value === "number") {
          return `${this.value.toLocaleString("fr-FR")}`;
        }
        return "";
      },
    },
    tickAmount: 3,
    plotLines: [
      stackType === "percent"
        ? {
            color: "var(--blue-ecume-moon-675)",
            width: 3,
            value: 50,
            zIndex: 5,
            label: {
              text: "Parité parfaite Homme / Femme",
              rotation: 0,
              verticalAlign: "top",
              style: {
                color: "var(--blue-ecume-moon-675)",
                fontSize: "14px",
              },
              y: 3,
            },
          }
        : {},
    ],
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
      minPointLength: 5,
    },
  },
  tooltip: {
    style: {
      fontSize: "14px",
    },
    formatter: function () {
      const itemIndex = this.index!;
      const itemData = sortedItems[itemIndex];
      const isSelected = itemData?.isSelected;

      let valueDisplay = "";
      if (typeof this.y === "number") {
        if (stackType === "percent") {
          valueDisplay = `${this.y.toFixed(0)}&nbsp;%`;
        } else {
          valueDisplay = this.y.toLocaleString("fr-FR");
        }
      }

      return `
      <div style="padding:10px">
        <div style="font-weight:bold;margin-bottom:8px;font-size:14px">
          <b>${itemData.itemName}${isSelected ? " (sélectionnée)" : ""}</b><br/>
        </div>
        <span style="color:${this.color}">\u25CF</span> ${this.series.name}: ${valueDisplay}<br/>
      Total: ${itemData.totalCount.toLocaleString()} enseignants
      </div>`;
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
