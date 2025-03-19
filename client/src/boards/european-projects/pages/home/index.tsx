import { useSearchParams } from "react-router-dom";
import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import i18n from "./i18n.json";

export default function Home() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }
  return (
    <Container as="section" className="fr-mt-2w">
      <Row
        className="fr-mb-5w"
        style={{ height: "200px", backgroundColor: "lightblue" }}
      >
        <Col className="fr-p-1w">
          <Title as="h2" look="h5" className="fr-mb-1w">
            {getI18nLabel("title1")}
          </Title>
          <p
            dangerouslySetInnerHTML={{
              __html: getI18nLabel("bloc1"),
            }}
          />
        </Col>
      </Row>
      <Row
        className="fr-mb-5w"
        style={{ height: "200px", backgroundColor: "lightgreen" }}
      >
        <Col className="fr-p-1w">
          <Title as="h2" look="h5" className="fr-mb-1w">
            {getI18nLabel("title2")}
          </Title>
          <p
            dangerouslySetInnerHTML={{
              __html: getI18nLabel("bloc2"),
            }}
          />
        </Col>
      </Row>
      <Row
        className="fr-mb-5w"
        style={{ height: "200px", backgroundColor: "lightblue" }}
      >
        <Col className="fr-p-1w">
          <Title as="h2" look="h5" className="fr-mb-1w">
            {getI18nLabel("title3")}
          </Title>
          <p
            dangerouslySetInnerHTML={{
              __html: getI18nLabel("bloc3"),
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}
