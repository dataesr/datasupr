import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import graphData from "../../../../assets/data/evol_all_pc_funding_SIGNED (1).json";
import {
  Col,
  Row,
  Container,
  Breadcrumb,
  BreadcrumbItem,
} from "@dataesr/react-dsfr";
import { useParams } from "react-router-dom";

export default function EvolutionFundingSigned() {
  const { structureID } = useParams();

  console.log(structureID);

  const data = graphData;

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
    <Container>
      <Breadcrumb>
        <BreadcrumbItem href="/">Page d'accueil</BreadcrumbItem>
        <BreadcrumbItem href="/tableaux">Vers les tableaux</BreadcrumbItem>
        <BreadcrumbItem href="/tableaux/european-projects/">
          `Vers les projets européen {structureID}`
        </BreadcrumbItem>
      </Breadcrumb>
      <Row gutters>
        <Col n="12">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Col>
      </Row>
    </Container>
  );
}
