import { Container, Row, Col, Title, Button } from "@dataesr/dsfr-plus";
import { useNavigate, useSearchParams } from "react-router-dom";

import i18n from "./i18n.json";
import "./styles.scss"; // Assuming you have some styles for the welcome page
import Callout from "../../components/callout";

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentLang = searchParams.get("language") || "FR";

  function getI18nLabel(key, lang = "fr") {
    return i18n[key] ? i18n[key][lang] || i18n[key]["fr"] : "";
  }

  return (
    <>
      <Container as="main">
        <Title as="h1" className="fr-my-5w">
          {getI18nLabel("title", currentLang)}
        </Title>
        <Callout>{getI18nLabel("teds-description", currentLang)}</Callout>
        <section>
          <Row gutters>
            <Col md={6}>
              <div className="chart-bg">
                <Title as="h2" className="fr-my-2w">
                  {getI18nLabel("title-countries", currentLang)}
                </Title>
                {getI18nLabel("description-countries", currentLang)}
                <div className="fr-mt-2w">
                  <Button
                    onClick={() => {
                      navigate("/teds/countries");
                    }}
                    size="sm"
                  >
                    {getI18nLabel("button-countries", currentLang)}
                  </Button>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="chart-bg2">
                <Title as="h2" className="fr-my-2w">
                  {getI18nLabel("title-entities", currentLang)}
                </Title>
                {getI18nLabel("description-entities", currentLang)}
                <div className="fr-mt-2w text-right">
                  <Button
                    onClick={() => {
                      navigate("/teds/entities");
                    }}
                    size="sm"
                  >
                    {getI18nLabel("button-entities", currentLang)}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
}
