import { useSearchParams } from "react-router-dom";
import { Button, Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useState } from "react"; // Ajoutez cet import
import i18n from "./i18n.json";
import "./styles.css";

export default function Home() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [activePillar, setActivePillar] = useState(null); // Ajoutez cet état

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  const handlePillarClick = (pillarNumber) => {
    setActivePillar(activePillar === pillarNumber ? null : pillarNumber);
  };

  return (
    <Container as="section" className="fr-mt-2w">
      <Row
        className="fr-mb-5w"
        style={{ minHeight: "200px", backgroundColor: "lightblue" }}
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
          <Title as="h3" look="h6" className="fr-mb-1w">
            Présentation de l'arborescence
          </Title>
          <div className="pillars-container">
            <div className="pillar">
              <Button onClick={() => handlePillarClick(1)}>pilier 1</Button>
              <div className={`programs ${activePillar === 1 ? "active" : ""}`}>
                <Button>Programme 1</Button>
                <Button>Programme 2</Button>
                <Button>Programme 3</Button>
              </div>
            </div>
            <div className="pillar">
              <Button onClick={() => handlePillarClick(2)}>pilier 2</Button>
              <div className={`programs ${activePillar === 2 ? "active" : ""}`}>
                <Button>Programme 1</Button>
                <Button>Programme 2</Button>
                <Button>Programme 3</Button>
              </div>
            </div>
            <div className="pillar">
              <Button onClick={() => handlePillarClick(3)}>pilier 3</Button>
              <div className={`programs ${activePillar === 3 ? "active" : ""}`}>
                <Button>Programme 1</Button>
                <Button>Programme 2</Button>
                <Button>Programme 3</Button>
              </div>
            </div>
            <div className="pillar">
              <Button onClick={() => handlePillarClick(4)}>pilier 4</Button>
              <div className={`programs ${activePillar === 4 ? "active" : ""}`}>
                <Button>Programme 1</Button>
                <Button>Programme 2</Button>
                <Button>Programme 3</Button>
              </div>
            </div>
          </div>
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
