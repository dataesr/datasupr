import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { AgeEvolutionChart } from "./chart/age-evolution/age-evolution";
import { StatusEvolutionChart } from "./chart/status/status";
import { TrendsChart } from "./chart/trend/trends";

export function Evolution() {
  return (
    <Container as="main">
      <Row gutters className="fr-mb-5w">
        <Col>
          <TrendsChart />
        </Col>
      </Row>
      <Row gutters className="fr-mb-5w">
        <Col>
          <StatusEvolutionChart />
        </Col>
      </Row>
      <Row gutters className="fr-mb-5w">
        <Col>
          <AgeEvolutionChart />
        </Col>
      </Row>
    </Container>
  );
}
