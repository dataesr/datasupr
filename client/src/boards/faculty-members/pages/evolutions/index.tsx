import { Container, Row, Col, Title, Breadcrumb } from "@dataesr/dsfr-plus";
import { Link } from "@dataesr/dsfr-plus";
import { AgeEvolutionChart } from "./chart/age-evolution/age-evolution";
import { StatusEvolutionChart } from "./chart/status/status";
import { TrendsChart } from "./chart/trend/trends";

export function Evolution() {
  return (
    <Container as="main">
      <Row>
        <Col md={12}>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link href="/personnel-enseignant/discipline/vue-d'ensemble/">
              Vue disciplinaire
            </Link>
            <Link>
              <strong>coucou </strong>
            </Link>
          </Breadcrumb>

          <Title as="h2" look="h4" className="fr-mt-4w fr-mb-3w">
            coucou2
          </Title>
        </Col>
      </Row>

      <Row gutters className="fr-mb-5w">
        <Col md={6}>
          <TrendsChart />
        </Col>
        <Col md={6}>
          <StatusEvolutionChart />
        </Col>
      </Row>
      <Row gutters className="fr-mb-5w">
        <Col md={6}>
          <AgeEvolutionChart />
        </Col>
      </Row>
    </Container>
  );
}
