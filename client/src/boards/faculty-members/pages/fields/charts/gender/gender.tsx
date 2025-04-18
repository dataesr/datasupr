import React from "react";
import ChartWrapper from "../../../../components/chart-wrapper";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";

interface DisciplineData {
  fieldId: string;
  fieldLabel: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
}

interface GenderByDisciplineProps {
  disciplinesData: DisciplineData[];
}

const GenderByDiscipline: React.FC<GenderByDisciplineProps> = ({
  disciplinesData,
}) => {
  if (!disciplinesData || disciplinesData.length === 0) return null;

  const sortedData = [...disciplinesData].sort(
    (a, b) => b.totalCount - a.totalCount
  );

  const topData = sortedData.slice(0, 10);

  const categories = topData.map((disc) => disc.fieldLabel);
  const maleData = topData.map((disc) => disc.maleCount);
  const femaleData = topData.map((disc) => disc.femaleCount);

  const percentages = topData.map((disc) => {
    const total = disc.maleCount + disc.femaleCount;
    const malePercent = Math.round((disc.maleCount / total) * 100);
    const femalePercent = Math.round((disc.femaleCount / total) * 100);
    return { malePercent, femalePercent };
  });

  const chartOptions = CreateChartOptions("bar", {
    chart: {
      type: "bar",
      height: 400,
    },
    title: {
      text: "Répartition hommes/femmes par discipline",
      style: { fontSize: "16px" },
    },
    xAxis: {
      categories: categories,
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Effectif",
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
      stackLabels: {
        enabled: true,
        format: "{total}",
        style: {
          fontWeight: "bold",
        },
      },
    },
    tooltip: {
      formatter: function () {
        const point = this.point;
        const total = point.total || this.total || 0;
        const percentage =
          total > 0 ? Math.round(((point.y ?? 0) / total) * 100) : 0;
        return `<b>${point.category}</b><br>
                ${
                  point.series.name
                }: ${point.y?.toLocaleString()} (${percentage}%)<br>
                Total: ${total.toLocaleString()}`;
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            const point = this.point;
            const index = categories.indexOf(String(point.category));
            if (point.series.name === "Hommes") {
              return `${percentages[index].malePercent}%`;
            } else {
              return `${percentages[index].femalePercent}%`;
            }
          },
        },
        stacking: "normal",
      },
    },
    legend: {
      align: "right",
      verticalAlign: "top",
      layout: "vertical",
      x: 0,
      y: 50,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Hommes",
        data: maleData,
        color: "#000091",
        type: "bar",
      },
      {
        name: "Femmes",
        data: femaleData,
        color: "#e1000f",
        type: "bar",
      },
    ],
  });

  return (
    <ChartWrapper
      id="genderByDiscipline"
      options={chartOptions}
      legend={null}
    />
  );
};

export default GenderByDiscipline;
