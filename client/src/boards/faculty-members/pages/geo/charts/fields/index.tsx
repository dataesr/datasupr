import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SubjectDistributionChartProps } from "../../../../types";

const SubjectDistributionChart = ({
  subjects,
  region,
  year,
}: SubjectDistributionChartProps) => {
  //   const rootStyles = getComputedStyle(document.documentElement);

  const chartOptions = useMemo(() => {
    if (!subjects || subjects.length === 0) return {};

    const sortedSubjects = [...subjects].sort(
      (a, b) => b.headcount - a.headcount
    );

    const categories = sortedSubjects.map((subject) => subject.label_fr);
    const data = sortedSubjects.map((subject) => ({
      y: subject.headcount,
      name: subject.label_fr,
      id: subject.id,
    }));

    const getColorFromIndex = (index: number) => {
      const colors = [
        "#000091",
        "#E1000F",
        "#6A6AF4",
        "#9B9B9B",
        "#FF9940",
        "#8585F6",
        "#47A8B5",
        "#A558A0",
        "#45BCC2",
        "#FF90A8",
      ];
      return colors[index % colors.length];
    };

    return {
      chart: {
        type: "bar",
        height: Math.max(300, 100 + sortedSubjects.length * 40),
        style: {
          fontFamily: "'Marianne', sans-serif",
        },
        backgroundColor: "transparent",
      },
      title: {
        text: `Disciplines enseignées dans la région ${region}${
          year ? ` (${year})` : ""
        }`,
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
      subtitle: {
        text: "Répartition des enseignants par discipline",
        style: {
          fontSize: "13px",
          color: "#666666",
        },
      },
      xAxis: {
        categories: categories,
        title: {
          text: null,
        },
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Nombre d'enseignants",
          style: {
            fontSize: "12px",
          },
        },
        labels: {
          style: {
            fontSize: "11px",
          },
        },
      },
      tooltip: {
        formatter: function (this: Highcharts.TooltipFormatterContextObject) {
          return `<b>${this.x}</b>: ${this.y} enseignants`;
        },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderWidth: 0,
        shadow: true,
        style: {
          fontSize: "12px",
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.y;
            },
            style: {
              fontSize: "11px",
              fontWeight: "normal",
              textOutline: "none",
              color: "#333333",
            },
          },
          colorByPoint: true,
          colors: data.map((_, i) => getColorFromIndex(i)),
          borderRadius: 3,
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Enseignants",
          data: data,
          type: "bar",
        },
      ],
    } as Highcharts.Options;
  }, [subjects, region, year]);

  if (!subjects || subjects.length === 0) {
    return (
      <div className="fr-p-3w fr-text--center">
        Aucune donnée disponible pour les disciplines dans cette région.
      </div>
    );
  }

  return (
    <div className="fr-mb-3w">
      <div
        style={{
          padding: "15px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
        }}
      >
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />

        <div className="fr-text--xs fr-mt-2w fr-text--center fr-text--italic">
          Ce graphique présente la distribution des enseignants par grande
          discipline académique dans la région.
        </div>
      </div>
    </div>
  );
};

export default SubjectDistributionChart;
