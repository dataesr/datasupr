import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type HistoData = {
  annee_universitaire: string;
  effectif_feminin: number;
  effectif_masculin: number;
};

type SeriesData = {
  name: string;
  data: number[];
  color: string;
}[];

export default function GendersHistoChart({
  data = [],
  isLoading = true,
  type,
  view,
}: {
  data: HistoData[];
  isLoading: boolean;
  type: "column" | "line";
  view: "basic" | "percentage";
}) {
  if (isLoading || !data || !data.length) {
    return <div>Loader</div>;
  }

  let series: SeriesData;
  switch (view) {
    case "basic":
      series = [
        {
          name: "Féminin",
          data: data.map((item) => item.effectif_feminin),
          color: "#e18b76",
        },
        {
          name: "Masculin",
          data: data.map((item) => item.effectif_masculin),
          color: "#efcb3a",
        },
      ];
      break;
    case "percentage":
      series = [
        {
          name: "Féminin",
          data: data.map(
        (item) =>
          parseFloat(
            (
          (item.effectif_feminin * 100) /
          (item.effectif_feminin + item.effectif_masculin)
            ).toFixed(1)
          )
          ),
          color: "#e18b76",
        },
        {
          name: "Masculin",
          data: data.map(
        (item) =>
          parseFloat(
            (
          (item.effectif_masculin * 100) /
          (item.effectif_feminin + item.effectif_masculin)
            ).toFixed(1)
          )
          ),
          color: "#efcb3a",
        },
      ];
      break;
    default:
      series = [];
      break;
  }

  const rootStyles = getComputedStyle(document.documentElement);

  const options = {
    chart: {
      type,
      animation: {
        duration: 500,
      },
      backgroundColor: "transparent",
    },
    legend: {
      itemStyle:{
        color: rootStyles.getPropertyValue("--label-color"),
        fontFamily: "Marianne, sans-serif",
      }
    },
    title: { text: "" },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: data.map((item) => item.annee_universitaire),
      labels: {
        style: {
          color: rootStyles.getPropertyValue("--label-color"),
          fontFamily: "Marianne, sans-serif",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'étudiants",
        style: {
          color: rootStyles.getPropertyValue("--label-color"),
          fontFamily: "Marianne, sans-serif",
        },
      },
      stackLabels: {
        enabled: true,
      },
      labels: {
        style: {
          color: rootStyles.getPropertyValue("--label-color"),
          fontFamily: "Marianne, sans-serif",
        },
      },
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat: view === 'basic' ? "{series.name}: {point.y}<br/>Total: {point.stackTotal}" : "{series.name}: {point.y}%",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
        },
      },
    },
    series,
  };

  return (
    <section>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </section>
  );
}
