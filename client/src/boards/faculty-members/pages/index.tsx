import { Button, Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useNavigate } from "react-router-dom";

export function Presentation() {
  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <Col md={7}>
          <Col>
            <Title as="h1" look="h6">
              Le personnel enseignant
            </Title>
            <Text>
              ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt,
              nunc at bibendum facilisis, nunc nisi
              <br />
              <br />
              ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt,
              nunc at bibendum facilisis, nunc nisi
              <br />
            </Text>
          </Col>
          <Row className="fr-mt-5w">
            <Col md={9} className="search">
              <Title as="h2" look="h6" className="fr-mb-1w">
                <span
                  onClick={() => {
                    navigate("/personnel-enseignant/vue-d'ensemble");
                  }}
                >
                  <label className="fr-label" htmlFor="text-input-text">
                    Entrée par les universités
                  </label>
                </span>
              </Title>
            </Col>
            <Col md={3}>
              <Button
                className="fr-mt-4w"
                color="pink-tuile"
                icon="search-line"
              >
                Rechercher
              </Button>
            </Col>
          </Row>
        </Col>
        <Col md={4} offsetMd={1}>
          <Text>Rapide coup d'oeil sur des chiffres </Text>
          <Text>Rapide coup d'oeil sur les typologies</Text>
          <Text>Rapide coup d'oeil sur les évolutions</Text>
          <Text>Carte de la France</Text>
        </Col>
      </Row>
    </Container>
  );
}
