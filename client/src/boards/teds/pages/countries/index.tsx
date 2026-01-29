import { Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";

import BoardsSuggestComponent from "../../../../components/boards-suggest-component";
import Callout from "../../../../components/callout";
import { getI18nLabel } from "../../../../utils";
import IpbesAll from "../../charts/ipbes-all";
import IpccAll from "../../charts/ipcc-all";
import Ipcc5countries from "../../charts/ipcc-for-five-countries";
import PrctIpccPublicationsByCountryByWg1 from "../../charts/ipcc-wg/PrctIpccPublicationsByCountryByWg1";
import PrctIpccPublicationsByCountryByWg2 from "../../charts/ipcc-wg/PrctIpccPublicationsByCountryByWg2";
import PrctIpccPublicationsByCountryByWg2cross from "../../charts/ipcc-wg/PrctIpccPublicationsByCountryByWg2cross";
import PrctIpccPublicationsByCountryByWg3 from "../../charts/ipcc-wg/PrctIpccPublicationsByCountryByWg3";
import i18n from "./i18n.json";


export default function Countries() {
  function getNotice(children) {
    return (
      <div className="fr-notice fr-notice--info fr-mt-1w">
        <div className="fr-container">
          <div className="fr-notice__body">
            <Text className="description">{children}</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container as="main" className="fr-mt-5w">
      <Row>
        <Col md={12}>
          <Title as="h1" className="fr-mb-2w">
            {getI18nLabel(i18n, "title")}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Title as="h2" className="fr-mb-2w">
            {getI18nLabel(i18n, "ipcc-title")}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Callout colorFamily="blue-ecume">{getI18nLabel(i18n, "ipcc-description")}</Callout>
        </Col>
      </Row>
      <Row gutters className="chart-bg">
        <Col md={12}>
          <IpccAll />
        </Col>
      </Row>

      <Row gutters className="fr-mt-5w chart-bg">
        <Col md={7}>
          <PrctIpccPublicationsByCountryByWg1 />
        </Col>
        <Col md={5} className="fr-mt-10w">
          {getNotice(getI18nLabel(i18n, "wg1-description"))}
        </Col>
      </Row>

      <Row gutters className="fr-mt-5w chart-bg">
        <Col md={12}>
          <Title as="h2" look="h6">
            {getI18nLabel(i18n, "wg2-title")}
          </Title>
        </Col>
        <Col md={6}>
          <PrctIpccPublicationsByCountryByWg2 />
        </Col>
        <Col md={6}>
          <PrctIpccPublicationsByCountryByWg2cross />
        </Col>
        <Col md={12}>{getNotice(getI18nLabel(i18n, "wg2-description"))}</Col>
      </Row>

      <Row gutters className="fr-mt-5w chart-bg">
        <Col md={7}>
          <PrctIpccPublicationsByCountryByWg3 />
        </Col>
        <Col md={5} className="fr-mt-10w">
          {getNotice(getI18nLabel(i18n, "wg3-description"))}
        </Col>
      </Row>

      <Row gutters className="fr-mt-5w chart-bg">
        <Col md={12}>
          <Ipcc5countries />
        </Col>
      </Row>

      <Row className="fr-mt-7w">
        <Col md={12}>
          <Title as="h2" className="fr-mb-2w">
            {getI18nLabel(i18n, "ipbes-title")}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Callout colorFamily="blue-ecume">{getI18nLabel(i18n, "ipbes-description")}</Callout>
        </Col>
      </Row>
      <Row gutters className="fr-mt-5w chart-bg">
        <Col md={12}>
          <IpbesAll />
        </Col>
      </Row>
      <BoardsSuggestComponent />
    </Container>
  );
}
