import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const FinancialGoals = ({ data }) => {
  if (data === 0) {
    return <p>Pas encore de donnée</p>;
  }

  const countryData = data.filter((el) => el.country_code === "FR");
  const sortedData = countryData[0].data.sort((a, b) => b.share_signed - a.share_signed);

  const categories = sortedData.map((item) => item.programme_name_fr);
  const values = sortedData.map((item) => item.value_signed);
  const percentages = sortedData.map((item) => item.share_signed);
  const pillierName = sortedData.map((item) => item.pilier_name_fr);

 const getColorByPillierName = (name) => {
  if (name === "Science d'excellence") {
    return "#9ef9be";
  } else if (name === "Problématiques mondiales et compétitivité industrielle européenne") {
    return "#4b5d67";
  } else if (name === "Europe plus innovante") {
    return "#87556f";
  }  else {
    return "#cecece";
  }
};

  const pillierLegend = [
    { name: "Science d'excellence", color: getColorByPillierName("Science d'excellence") },
    { name: "Problématiques mondiales et compétitivité industrielle européenne", color: getColorByPillierName("Problématiques mondiales et compétitivité industrielle européenne") },
    { name: "Europe plus innovante", color: getColorByPillierName("Europe plus innovante") },
    { name: "Élargir la participation et renforcer l'espace européen de la recherche", color: getColorByPillierName("Élargir la participation et renforcer l'espace européen de la recherche") },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 500,
    },
    title: {
      text: "Objectifs financés",
    },
    xAxis: {
      categories: categories,
      title: {
        text: "",
      },
    },
    yAxis: [
      {
        title: {
          text: "",
        },
      },
      {
        title: {
          text: "",
        },
      },
    ],
    legend: {
      enabled: false,
 
    },
    plotOptions: {
      series: {
        pointWidth: 20,
        dataLabels: {
          enabled: true,
          color: "#FFFFFF",
        },
        states: {
          hover: {
            color: "#a4edba",
          },
        },
      },
    },
    series: [
      {
        name: "Part captée en %",
        data: percentages.map((value, index) => ({
          y: value,
          color: getColorByPillierName(pillierName[index]),
        })),
        yAxis: 0,
      },
    ],
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h4>Légende des piliers :</h4>
        {pillierLegend.map((item) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: "20px", height: "20px", background: item.color, marginRight: "10px" }}></div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default FinancialGoals;
