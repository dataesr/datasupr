import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import tresorerie from "../../assets/data/all_treso.json";

export default function DispersionFinance() {
  const id_paysage = "s3t8T";
  const etablissement = tresorerie?.map((el) => el.etablissement)?.[0];

  const filteredData = tresorerie.map((el) => el.data);
  const test = filteredData.map((el) =>
    el.filter((item) => item.code_indic === "TR")
  );

  /* 
  Construire une Series data dont le modèle est :
  [
    {
        name: str,
        color: couleur du point, couleur spécifique lorsque c'est l'établissement observé,
        y : [value, year]
    }, 
    {...}
  ]
  
  */

  let seriesData = tresorerie.map((item) => ({
    name: item.etablissement,
    y: item.value,
  }));

  // seriesData = seriesData.sort((a, b) => a.name - b.name);

  // const years = [...new Set(seriesData.map((item) => item.name))];

  //   const options = {
  //     chart: {
  //       type: "column",
  //     },
  //     title: {
  //       text: "Evolution de la trésorerie",
  //       align: "left",
  //     },
  //     xAxis: {
  //       categories: years,
  //     },
  //     yAxis: {
  //       title: {
  //         text: "Valeur en M€",
  //       },
  //     },
  //     tooltip: {
  //       formatter() {
  //         const year = this.series.year;
  //         const value = this.point.y;
  //         return `${etablissement} : ${value}€`;
  //       },
  //     },
  //     legend: {
  //       enabled: false,
  //     },
  //     credits: {
  //       enabled: false,
  //     },
  //     plotOptions: {
  //       column: {
  //         dataLabels: {
  //           enabled: true,
  //           formatter: function () {
  //             if (this.point.source === "Budget") return this.point.source;
  //           },
  //         },
  //       },
  //     },
  //     series: [
  //       {
  //         name: "Trésorerie",
  //         colorByPoint: true,
  //         data: seriesData,
  //       },
  //     ],
  //   };

  return (
    <div>
      {/* <HighchartsReact highcharts={Highcharts} options={options} /> */}
    </div>
  );
}
