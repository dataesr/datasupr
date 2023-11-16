import PropTypes from "prop-types";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import {
  Container, Row, Col,
} from "@dataesr/react-dsfr";

export default function EvolutionCoordination({ data, title }) {
  if (data.length === 0) {
    return <p>Pas encore de donnée</p>;
  }
  const countryCode = data[0].country_code

  const seriesData = data.map((item) => ({
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
      text: title,
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
            const countryLink = `/tableaux/european-projects?countryCode=${countryCode}`;
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
      </Row>
    </Container>
  );
}

EvolutionCoordination.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};