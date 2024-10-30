import HighchartsInstance from "highcharts";

export function ChartEP(
  type: NonNullable<HighchartsInstance.Options["chart"]>["type"]
) {
  const chartOptions: HighchartsInstance.Options = {
    chart: {
      type: type,
      height: 500,
      backgroundColor: "transparent",
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },
  };

  return chartOptions;
}
