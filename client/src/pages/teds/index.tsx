import { useSearchParams } from "react-router-dom";
import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { getLabel } from "./charts/utils";

import IpccAll from "./charts/ipcc-all";
import IpbesAll from "./charts/ipbes-all";
import PrctIpbesPublicationsByCountry from "./charts/PrctIpbesPublicationsByCountry";
import PrctIpccPublicationsByCountryByWg1 from "./charts/PrctIpccPublicationsByCountryByWg1";
import PrctIpccPublicationsByCountryByWg2 from "./charts/PrctIpccPublicationsByCountryByWg2";
import PrctIpccPublicationsByCountryByWg2cross from "./charts/PrctIpccPublicationsByCountryByWg2cross";
import PrctIpccPublicationsByCountryByWg3 from "./charts/PrctIpccPublicationsByCountryByWg3";
import PrctIpccPublicationsForFiveCountries from "./charts/PrctIpccPublicationsForFiveCountries";
import translations from "./charts/translations.json";

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language");
  return (
    <>
      <Container as="main">
        <Title as="h1" className="fr-mb-2w">
          {getLabel("title", translations, currentLang)}
        </Title>
        <Title as="h2" className="fr-mb-2w">
          {getLabel("ipcc", translations, currentLang)}
        </Title>
        <Row gutters>
          <Col md={12}>
            <IpccAll />
          </Col>
        </Row>
        <Title as="h3" look="h6" className="text-center">
          {getLabel("publications_by_group", translations, currentLang)}
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
            <PrctIpccPublicationsForFiveCountries />
          </Col>
        </Row>
        <Row gutters>
          <Col md={12}>
            <Title as="h2" className="fr-mb-2w">
              {getLabel("ipbes", translations, currentLang)}
            </Title>
          </Col>
        </Row>
        <Row gutters>
          <Col md={12}>
            <IpbesAll />
          </Col>
        </Row>
      </Container>
    </>
  );
}
