import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import PrctIpccPublicationsByCountry from "./charts/PrctIpccPublicationsByCountry";
import PrctIpbesPublicationsByCountry from "./charts/PrctIpbesPublicationsByCountry";
import PrctIpccPublicationsByCountryByWg1 from "./charts/PrctIpccPublicationsByCountryByWg1";
import PrctIpccPublicationsByCountryByWg2 from "./charts/PrctIpccPublicationsByCountryByWg2";
import PrctIpccPublicationsByCountryByWg2cross from "./charts/PrctIpccPublicationsByCountryByWg2cross";
import PrctIpccPublicationsByCountryByWg3 from "./charts/PrctIpccPublicationsByCountryByWg3";
import PrctIpccPublicationsForFiveCountries from "./charts/PrctIpccPublicationsForFiveCountries";

export default function Welcome() {
  return (
    <>
      <Container as="main">
        <Title as="h1" className="fr-mb-2w">
          Transition écologique pour un développement soutenable
        </Title>
        <Title as="h2" className="fr-mb-2w">
          Rapport du GIEC
        </Title>
        <Row gutters>
          <Col md={12}>
            <Title as="h3" className="fr-mb-2w">
              Part de publications pour le rapport du GIEC par pays (top 20)
            </Title>
            <PrctIpccPublicationsByCountry />
          </Col>
        </Row>
        <Title as="h3" className="fr-mb-2w">
          Part de publications pour les différents groupes du rapport du GIEC
          par pays (top 10)
        </Title>
        <Row>
          <Col md={6}>
            <PrctIpccPublicationsByCountryByWg1 />
          </Col>
          <Col md={6}>
            <PrctIpccPublicationsByCountryByWg2 />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <PrctIpccPublicationsByCountryByWg2cross />
          </Col>
          <Col md={6}>
            <PrctIpccPublicationsByCountryByWg3 />
          </Col>
        </Row>
        <Row gutters>
          <Col md={12}>
            <Title as="h3" className="fr-mb-2w">
              Structures des contribitions pour cinq pays
            </Title>
            <PrctIpccPublicationsForFiveCountries />
          </Col>
        </Row>
        <Row gutters>
          <Col md={12}>
            <Title as="h2" className="fr-mb-2w">
              Rapport de l'IPBES
            </Title>
          </Col>
        </Row>
        <Row gutters>
          <Col md={12}>
            <Title as="h3" className="fr-mb-2w">
              Part de publications pour le rapport de l'IPBES par pays (top 20)
            </Title>
            <PrctIpbesPublicationsByCountry />
          </Col>
        </Row>
      </Container>
    </>
  );
}
