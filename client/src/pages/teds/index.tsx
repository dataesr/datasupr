import { useSearchParams } from "react-router-dom";
import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { getLabel } from "./charts/utils";

import IpccAll from "./charts/ipcc-all";
import IpbesAll from "./charts/ipbes-all";
import Ipcc5Countries from "./charts/ipcc-for-five-countries";
import PrctIpccPublicationsByCountryByWg1 from "./charts/ipcc-wg/PrctIpccPublicationsByCountryByWg1";
import PrctIpccPublicationsByCountryByWg2 from "./charts/ipcc-wg/PrctIpccPublicationsByCountryByWg2";
import PrctIpccPublicationsByCountryByWg2cross from "./charts/ipcc-wg/PrctIpccPublicationsByCountryByWg2cross";
import PrctIpccPublicationsByCountryByWg3 from "./charts/ipcc-wg/PrctIpccPublicationsByCountryByWg3";

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language");

  if (!currentLang) {
    currentLang == "FR";
  }

  return (
    <>
      <Container as="main">
        <Title as="h1" className="fr-mb-2w">
          {getLabel("title", currentLang)}
        </Title>
        <Title as="h2" className="fr-mb-2w">
          {getLabel("ipcc", currentLang)}
        </Title>
        <Row gutters>
          <Col md={12}>
            <IpccAll />
          </Col>
        </Row>
        <Title as="h3" look="h6" className="text-center">
          {getLabel("publications_by_group", currentLang)}
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
            <Ipcc5Countries />
          </Col>
        </Row>
        <Row gutters>
          <Col md={12}>
            <Title as="h2" className="fr-mb-2w">
              {getLabel("ipbes", currentLang)}
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
