import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Template from "../../../components/template";

type DataProps = {
  label: string;
  effectif_masculin: number;
  effectif_feminin: number;
};

export default function FilieresGendersChart({
  data,
  isLoading,
}: {
  data: DataProps[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Template />;
  }
  const filieresOptions = {
    chart: {
      backgroundColor: "transparent",
      type: "bar",
      height: "600",
    },
    title: {
      text: "Nombre d'étudiants inscrits par fillière répartis par genre",
      align: "left",
    },
    subtitle: {
      text:
        "Source: <a " +
        'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
        'target="_blank">Source</a>',
      align: "left",
    },
    xAxis: {
      categories: data.map((filiere) => filiere.label),
      title: {
        text: null,
      },
      gridLineWidth: 1,
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'étudiants",
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
      gridLineWidth: 0,
    },
    tooltip: {
      valueSuffix: " étudiants",
    },
    plotOptions: {
      bar: {
        borderRadius: "50%",
        dataLabels: {
          enabled: true,
        },
        groupPadding: 0.1,
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "top",
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor: "#FFFFFF",
      shadow: true,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Masculin",
        data: data.map((filiere) =>
          filiere.effectif_masculin ? filiere.effectif_masculin : 0
        ),
        color: "#efcb3a",
      },
      {
        name: "Féminin",
        data: data.map((filiere) =>
          filiere.effectif_feminin ? filiere.effectif_feminin : 0
        ),
        color: "#e18b76",
      },
    ],
  };
  return (
    <section>
      <HighchartsReact highcharts={Highcharts} options={filieresOptions} />
    </section>
  );
}
