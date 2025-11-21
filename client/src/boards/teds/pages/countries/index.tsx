import { useSearchParams } from "react-router-dom";
import i18n from "./i18n.json";
import { Col, Container, Row, Title, Text } from "@dataesr/dsfr-plus";
import IpccAll from "../../charts/ipcc-all";
import PrctIpccPublicationsByCountryByWg1 from "../../charts/ipcc-wg/PrctIpccPublicationsByCountryByWg1";
import PrctIpccPublicationsByCountryByWg2 from "../../charts/ipcc-wg/PrctIpccPublicationsByCountryByWg2";
import PrctIpccPublicationsByCountryByWg2cross from "../../charts/ipcc-wg/PrctIpccPublicationsByCountryByWg2cross";
import PrctIpccPublicationsByCountryByWg3 from "../../charts/ipcc-wg/PrctIpccPublicationsByCountryByWg3";
import IpbesAll from "../../charts/ipbes-all";
import Ipcc5countries from "../../charts/ipcc-for-five-countries";
import Callout from "../../../../components/callout";
import BoardsSuggestComponent from "../../../../components/boards-suggest-component";

function getI18nLabel(key, lang = "fr") {
  return i18n[key] ? i18n[key][lang] || i18n[key]["fr"] : "";
}

export default function Countries() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

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
            {getI18nLabel("title", currentLang)}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Title as="h2" className="fr-mb-2w">
            {getI18nLabel("ipcc-title", currentLang)}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Callout colorFamily="blue-ecume">{getI18nLabel("ipcc-description", currentLang)}</Callout>
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
          {getNotice(getI18nLabel("wg1-description", currentLang))}
        </Col>
      </Row>

      <Row gutters className="fr-mt-5w chart-bg">
        <Col md={12}>
          <Title as="h2" look="h6">
            {getI18nLabel("wg2-title", currentLang)}
          </Title>
        </Col>
        <Col md={6}>
          <PrctIpccPublicationsByCountryByWg2 />
        </Col>
        <Col md={6}>
          <PrctIpccPublicationsByCountryByWg2cross />
        </Col>
        <Col md={12}>{getNotice(getI18nLabel("wg2-description", currentLang))}</Col>
      </Row>

      <Row gutters className="fr-mt-5w chart-bg">
        <Col md={7}>
          <PrctIpccPublicationsByCountryByWg3 />
        </Col>
        <Col md={5} className="fr-mt-10w">
          {getNotice(getI18nLabel("wg3-description", currentLang))}
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
            {getI18nLabel("ipbes-title", currentLang)}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Callout colorFamily="blue-ecume">{getI18nLabel("ipbes-description", currentLang)}</Callout>
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
