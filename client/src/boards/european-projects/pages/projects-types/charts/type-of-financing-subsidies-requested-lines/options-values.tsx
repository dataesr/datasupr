interface FilteredDataItem {
  year: number;
  action_id: string;
  total_evaluated: number;
  total_successful: number;
  country: string;
}

interface SeriesItem {
  name: string;
  data: number[];
  color: string;
}

export default function Options(data) {
  if (!data) return null;

  const filteredData = data.filter((item) => item.country !== "all")[0].data.sort((a, b) => a.year - b.year);

  const years = new Set();
  filteredData.forEach((item) => years.add(item.year));

  const series: SeriesItem[] = Array.from(new Set(filteredData.map((item: FilteredDataItem) => item.action_id))).map((actionId) => ({
    name: actionId as string,
    data: filteredData
      .filter((item: FilteredDataItem) => item.action_id === actionId)
      .map((item: FilteredDataItem) => item.total_evaluated / 1000000),
    color: `var(--project-type-${(actionId as string).toLowerCase()}-color)`,
  }));

  const series2: SeriesItem[] = Array.from(new Set(filteredData.map((item: FilteredDataItem) => item.action_id))).map((actionId) => ({
    name: actionId as string,
    xAxis: 1,
    data: filteredData
      .filter((item: FilteredDataItem) => item.action_id === actionId)
      .map((item: FilteredDataItem) => item.total_successful / 1000000),
    color: `var(--project-type-${(actionId as string).toLowerCase()}-color)`,
  }));

  return {
    chart: {
      type: "line",
      height: 500,
      backgroundColor: "transparent",
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },
    xAxis: [
      {
        type: "category",
        categories: Array.from(years),
        width: "48%",
        title: {
          text: "Projets évalués",
        },
      },
      {
        type: "category",
        categories: Array.from(years),
        offset: 0,
        left: "50%",
        width: "48%",
        title: {
          text: "Projets lauréats",
        },
      },
    ],
    yAxis: [
      {
        lineWidth: 1,
        lineColor: "#E6E6E6",
        min: 0,
        title: {
          text: "M€",
        },
      },
      {
        min: 0,
        title: {
          text: "",
        },
        lineWidth: 1,
        lineColor: "#E6E6E6",
        left: "75%",
      },
    ],
    tooltip: {
      valueSuffix: " (M€)",
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 3,
          lineWidth: 2,
          lineColor: undefined,
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return (this.y as number).toFixed(1);
          },
        },
      },
    },
    series: series.concat(series2),
  };
}
