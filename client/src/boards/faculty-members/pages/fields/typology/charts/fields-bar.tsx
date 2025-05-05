import { useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useNavigate } from "react-router-dom";

interface DisciplineBarChartProps {
  disciplines: Array<{
    discipline: string;
    disciplineCode: string;
    hommesCount: number;
    hommesPercent: number;
    femmesCount: number;
    femmesPercent: number;
  }>;
}

const hommesColor = `rgba(${getComputedStyle(document.documentElement)
  .getPropertyValue("--hommes-color")
  .trim()}, 0.8)`;
const femmesColor = `rgba(${getComputedStyle(document.documentElement)
  .getPropertyValue("--femmes-color")
  .trim()}, 0.8)`;

const DisciplineBarChart: React.FC<DisciplineBarChartProps> = ({
  disciplines,
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const navigate = useNavigate();

  const sortedDisciplines = [...disciplines].sort(
    (a, b) => b.hommesCount + b.femmesCount - (a.hommesCount + a.femmesCount)
  );

  const categories = sortedDisciplines.map((d) => d.discipline);
  const femmesData = sortedDisciplines.map((d) => d.femmesPercent);
  const hommesData = sortedDisciplines.map((d) => d.hommesPercent);

  const options: Highcharts.Options = {
    chart: {
      type: "bar",
      height: categories.length * 45,
    },
    title: {
      text: "Répartition femmes / hommes par discipline",
      align: "center",
      style: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    credits: { enabled: false },
    xAxis: {
      categories,
      title: { text: null },
    },
    yAxis: {
      visible: false,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        stacking: "percent",
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              const disciplineCode =
                sortedDisciplines[this.index]?.disciplineCode;
              if (disciplineCode) {
                navigate(
                  `/personnel-enseignant/discipline/typologie/${disciplineCode}`
                );
              }
            },
          },
        },
      },
      bar: {
        borderRadius: 4,
        borderWidth: 0,
      },
    },
    tooltip: {
      formatter: function () {
        const discipline = this.point.category;
        const value = Number(this.point.y).toFixed(1);
        return `<b>${discipline}</b><br/>
          <span style="color:${this.point.color}">\u25CF</span> ${this.series.name}: ${value}%`;
      },
    },
    series: [
      {
        name: "Femmes",
        data: femmesData,
        color: femmesColor,
        type: "bar",
      },
      {
        name: "Hommes",
        data: hommesData,
        color: hommesColor,
        type: "bar",
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current?.chart) {
      chartRef.current.chart.reflow();
    }
  }, [disciplines]);

  return (
    <div className="fr-mb-3w">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

export default DisciplineBarChart;
