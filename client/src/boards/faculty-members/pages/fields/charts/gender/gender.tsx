import ChartWrapper from "../../../../../../components/chart-wrapper";
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

  const config = {
    id: "genderByDiscipline",
    idQuery: "genderByDiscipline",
    title: {
      fr: "Répartition par sexe des enseignants par discipline",
      en: "Distribution of faculty members by gender",
    },
    description: {
      fr: "Répartition des membres du personnel par sexe",
      en: "Distribution of faculty members by gender",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };

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
      marginBottom: 0,
    },
    title: {
      text: "",
      style: { fontSize: "16px" },
    },
    xAxis: {
      categories: categories,
      title: {
        text: null,
      },
      labels: {
        style: {
          color: "#000000",
          fontWeight: "600",
          fontSize: "13px",
          textOutline: "1px contrast",
        },
      },
      lineWidth: 0,
      tickWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Effectif",
        align: "high",
      },
      labels: {
        overflow: "justify",
        style: {
          color: "#333333",
        },
      },
      stackLabels: {
        enabled: true,
        format: "{total}",
        style: {
          fontWeight: "bold",
          color: "#333333",
          textOutline: "1px white",
        },
      },
      gridLineWidth: 0.5,
      gridLineColor: "rgba(128, 128, 128, 0.2)",
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
      config={config}
      options={chartOptions}
      legend={null}
      renderData={undefined}
    />
  );
};

export default GenderByDiscipline;
