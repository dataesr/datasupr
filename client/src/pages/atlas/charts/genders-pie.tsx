import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type GenderData = {
  name: string;
  y: number;
}[];

export default function GenderChart({
  data = [],
  isLoading,
  currentYear,
}: {
  data: GenderData;
  isLoading: boolean;
  currentYear: string;
}) {
  if (isLoading || !data || !data.length) {
    return <div>Loader</div>;
  }
  const secteursOptions = {
    chart: {
      type: "pie",
      height: "80%",
      backgroundColor: "transparent",
    },
    title: {
      text:
        "Pourcentage d'étudiants inscrits regroupés par genre pour l'année universitaire " +
        currentYear,
      align: "center",
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: false,
            distance: 20,
          },
          {
            enabled: true,
            distance: -40,
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "1em",
              textOutline: "none",
              opacity: 0.7,
            },
            filter: {
              operator: ">",
              property: "percentage",
              value: 10,
            },
          },
        ],
      },
      pie: {
        colors: ["#efcb3a", "#e18b76"],
      },
    },
    series: [
      {
        name: "Nombre d'étudiants",
        colorByPoint: true,
        data,
        showInLegend: true,
      },
    ],
  };

  return (
    <section>
      <HighchartsReact highcharts={Highcharts} options={secteursOptions} />
    </section>
  );
}
