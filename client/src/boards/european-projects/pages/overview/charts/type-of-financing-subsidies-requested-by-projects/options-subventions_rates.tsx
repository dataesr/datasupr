import * as Highcharts from "highcharts";

interface DataItem {
  id: number;
  name: string;
  total_evaluated: number;
  total_successful: number;
}

interface ChartData {
  country: DataItem[];
  all: DataItem[];
}

export default function Options(data: ChartData): Highcharts.Options | null {
  if (!data) return null;

  const filteredData = data.country.filter((el) => el.total_evaluated && el.total_successful);

  return {
    chart: {
      type: "column",
      height: 500,
      backgroundColor: "transparent",
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },

    xAxis: {
      categories: filteredData.map((item) => item.name),
      crosshair: true,
      accessibility: {
        description: "Actions",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "%",
      },
    },
    tooltip: {
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        return (this.x ?? "") + " : " + (this.y as number).toFixed(1) + " %";
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.1,
        borderWidth: 0,
      },
    },
    series: [
      {
        type: "column",
        name: "Projets évalués",
        data: filteredData.map((item) => {
          const allItem = data.all.find((el) => el.id === item.id);
          return allItem ? (item.total_evaluated / allItem.total_evaluated) * 100 : 0;
        }),
        color: "#009099",
      } as Highcharts.SeriesColumnOptions,
      {
        type: "column",
        name: "Projets lauréats",
        data: filteredData.map((item) => {
          const allItem = data.all.find((el) => el.id === item.id);
          return allItem ? (item.total_successful / allItem.total_successful) * 100 : 0;
        }),
        color: "#233E41",
      } as Highcharts.SeriesColumnOptions,
    ],
  };
}
