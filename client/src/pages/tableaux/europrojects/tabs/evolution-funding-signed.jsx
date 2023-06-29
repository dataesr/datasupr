import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import graphData from "../../../../assets/data/evol_all_pc_funding_SIGNED (1).json";

export default function EvolutionFundingSigned() {
  const data = graphData;

  const seriesData = data.slice(1).map((item) => ({
    country: item.country_name,
    year: item.data.map((dataItem) => dataItem.year),
    value: item.data.map((dataItem) => dataItem.value),
  }));

  const uniqueCountries = [...new Set(seriesData.map((item) => item.country))];
  const uniqueYears = [...new Set(seriesData.flatMap((item) => item.year))];

  const options = {
    chart: {
      type: "line",
    },
    title: {
      text: "Evolution des financements signés",
      align: "left",
    },
    xAxis: {
      categories: uniqueYears,
      title: {
        text: "Année",
      },
    },
    yAxis: {
      title: {
        text: "Valeur",
      },
    },
    tooltip: {
      formatter() {
        const country = this.series.name;
        const year = this.x;
        const value = this.y;
        return `En ${year}, ${country} a perçu pour ${value} € de financement `;
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    series: uniqueCountries.map((country) => ({
      name: country,
      data: uniqueYears.map((year) => {
        const matchingData = seriesData.find(
          (item) => item.country === country
        );
        const dataIndex = matchingData.year.indexOf(year);
        return matchingData.value[dataIndex];
      }),
    })),
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
