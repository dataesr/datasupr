import { useSearchParams } from "react-router-dom";
import i18n from "./i18n.json";
import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import IpccInstitutions from "../../charts/ipcc-institutions";
import Callout from "../../../../components/callout";

function getI18nLabel(key, lang = "fr") {
  return i18n[key] ? i18n[key][lang] || i18n[key]["fr"] : "";
}

export default function Entities() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

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
            {getI18nLabel("subtitle", currentLang)}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Callout className="bg2">{getI18nLabel("description", currentLang)}</Callout>
        </Col>
      </Row>
      <Row gutters className="chart-bg2">
        <Col md={12}>
          <IpccInstitutions />
        </Col>
      </Row>
    </Container>
  );
}
