import { Button, Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useNavigate } from "react-router-dom";

import Callout from "../../components/callout";
import { getI18nLabel } from "../../utils";
import i18n from "./i18n.json";

import "./styles.scss"; // Assuming you have some styles for the welcome page


export default function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      <Container as="main">
        <Title as="h1" className="fr-my-5w">
          {getI18nLabel(i18n, "title")}
        </Title>
        <Callout>{getI18nLabel(i18n, "teds-description")}</Callout>
        <section>
          <Row gutters>
            <Col md={6}>
              <div className="chart-bg">
                <Title as="h2" className="fr-my-2w">
                  {getI18nLabel(i18n, "title-countries")}
                </Title>
                {getI18nLabel(i18n, "description-countries")}
                <div className="fr-mt-2w">
                  <Button
                    onClick={() => {
                      navigate("/teds/countries");
                    }}
                    size="sm"
                  >
                    {getI18nLabel(i18n, "button-countries")}
                  </Button>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="chart-bg2">
                <Title as="h2" className="fr-my-2w">
                  {getI18nLabel(i18n, "title-entities")}
                </Title>
                {getI18nLabel(i18n, "description-entities")}
                <div className="fr-mt-2w text-right">
                  <Button
                    onClick={() => {
                      navigate("/teds/entities");
                    }}
                    size="sm"
                  >
                    {getI18nLabel(i18n, "button-entities")}
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
