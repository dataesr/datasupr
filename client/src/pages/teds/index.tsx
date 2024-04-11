import { Col, Container, Row, Title } from '@dataesr/dsfr-plus';
import PrctIpccPublicationsByCountry from './charts/PrctIpccPublicationsByCountry';
import PrctIpccPublicationsByCountryByWg1 from './charts/PrctIpccPublicationsByCountryByWg1';
import PrctIpccPublicationsByCountryByWg2 from './charts/PrctIpccPublicationsByCountryByWg2';
import PrctIpccPublicationsByCountryByWg2cross from './charts/PrctIpccPublicationsByCountryByWg2cross';
import PrctIpccPublicationsByCountryByWg3 from './charts/PrctIpccPublicationsByCountryByWg3';

import './gallery.css'

export default function Welcome() {
  return (
    <>
    <Title as="h2" className="fr-mb-2w">
      Part de publications pour le rapport du GIEC par pays (top 20)
    </Title>
    <PrctIpccPublicationsByCountry />
    <Container>
      <Title as="h2" className="fr-mb-2w">
        Part de publications pour les différents groupes du rapport du GIEC par pays (top 10)
      </Title>
      <Row>
        <Col>
          <PrctIpccPublicationsByCountryByWg1 />
        </Col>
        <Col>
          <PrctIpccPublicationsByCountryByWg2 />
        </Col>
      </Row>
      <Row>
      <Col>
        <PrctIpccPublicationsByCountryByWg2cross />
      </Col>
      <Col>
        <PrctIpccPublicationsByCountryByWg3 />
      </Col>
      </Row>
    </Container></>
  );
}
