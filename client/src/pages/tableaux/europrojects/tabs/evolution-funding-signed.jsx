import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import {
  Col,
  Row,
  Container,
} from "@dataesr/react-dsfr";

export default function EvolutionFundingSigned({ data }) {

  if (data.length === 0) {
    return <p>Pas encore de donnée</p>;
  }

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
      text: "",
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
        return `En ${year}, ${country} a perçu pour ${value} € de financement, cliquez pour arriver sur la fiche pays de ${country}`;
      },
    },
    plotOptions: {
      series: {
        events: {
          click: function () {
            const country = this.name;
            const countryLink = `/tableaux/european-projects?structureID=FRA`;
            window.location.href = countryLink;
          },
        },
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
    <Container>
      <Row gutters>
        <Col n="12">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Col>
        <Col>Cliquez sur le ligne d'un pays pour visiter sa fiche</Col>
      </Row>
    </Container>
  );
}
