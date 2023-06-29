import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import data from "../../assets/data/all_treso.json";

export default function FinanceGraph() {
  const id_paysage = "s3t8T";
  const etablissement = data?.[0]?.etablissement;
  const filteredData = data
    ?.find((el) => el.id_paysage === id_paysage)
    ?.data.filter((el) => el.code_indic === "TR");

  const seriesData = filteredData.map((item) => ({
    etab: etablissement,
    source: item.source,
    year: item.year,
    value: item.value,
  }));

  const years = [...new Set(seriesData.map((item) => item.year))];
  const series = years.map((year) => ({
    name: year,
    data: seriesData.filter((el) => el.year === year).map((el) => el.value),
  }));

  console.log(series);

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: null,
    },
    xAxis: {
      title: {
        text: "Année",
      },
      categories: years,
    },
    yAxis: {
      title: {
        text: "Valeur",
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    series: series,
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
