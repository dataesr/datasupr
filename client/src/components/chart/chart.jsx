import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import data from "../../assets/data/all_treso.json";

export default function FinanceGraph() {
  const id_paysage = "s3t8T";
  const etablissement = data?.map((el) => el.etablissement)?.[0];
  const filteredData = data
    ?.filter((el) => el.id_paysage === id_paysage)?.[0]
    .data.filter((el) => el.code_indic === "TR");

  let seriesData = filteredData.map((item) => ({
    source: item.source,
    name: item.year,
    y: item.value,
  }));

  seriesData = seriesData.sort((a, b) => a.name - b.name);

  const years = [...new Set(seriesData.map((item) => item.name))];

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Evolution de la trésorerie",
      align: "left",
    },
    xAxis: {
      categories: years,
    },
    yAxis: {
      title: {
        text: "Valeur en M€",
      },
    },
    tooltip: {
      formatter() {
        const year = this.series.year;
        const value = this.point.y;
        return `${etablissement} : ${value}€`;
      },
    },
    series: [
      {
        name: "Trésorerie",
        colorByPoint: true,
        data: seriesData,
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
