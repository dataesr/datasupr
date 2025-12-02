import { Container, Row, Col, Title } from "@dataesr/dsfr-plus";
import FundingByCountry from "./charts/funding-by-country";

export default function EvolutionPcri() {
  return (
    <Container as="section" className="fr-mt-2w">
      <Row>
        <Col>
          <Title as="h2">Evolution des financements de FP6 à Horizon Europe</Title>
        </Col>
      </Row>
      <Row>
        <Col>
          <FundingByCountry />
        </Col>
      </Row>
      <Row>
        <Col>Cumul des financements obtenus depuis FP6 - Top 10 des pays</Col>
      </Row>
    </Container>
  );
}
