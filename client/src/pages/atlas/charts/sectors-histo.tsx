import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type HistoData = {
  annee_universitaire: string;
  effectif_pr: number;
  effectif_pu: number;
};

type SeriesData = {
  name: string;
  data: number[];
  color: string;
}[];

export default function SectorsHistoChart({
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
          name: "Secteur privé",
          data: data.map((item) => item.effectif_pr),
          color: "#755F4D",
        },
        {
          name: "Secteur public",
          data: data.map((item) => item.effectif_pu),
          color: "#748CC0",
        },
      ];
      break;
    case "percentage":
      series = [
        {
          name: "Secteur privé",
          data: data.map(
            (item) =>
              (item.effectif_pr * 100) / (item.effectif_pr + item.effectif_pu)
          ),
          color: "#755F4D",
        },
        {
          name: "Secteur public",
          data: data.map(
            (item) =>
              (item.effectif_pu * 100) / (item.effectif_pr + item.effectif_pu)
          ),
          color: "#748CC0",
        },
      ];
      break;
    default:
      series = [];
      break;
  }

  const options = {
    chart: {
      type,
      animation: {
        duration: 500,
      },
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: data.map((item) => item.annee_universitaire),
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'étudiants",
      },
      stackLabels: {
        enabled: true,
      },
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
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
