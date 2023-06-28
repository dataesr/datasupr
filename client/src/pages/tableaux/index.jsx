import { Link } from "react-router-dom";
import { Title, Row, Container } from "@dataesr/react-dsfr";

export default function Tableaux() {
  return (
    <Container>
      <Row className="fr-mt-3w">
        <Title as="h3" look="h5" spacing="mb-0">
          Liste des Tableaux
        </Title>
      </Row>
      <Row className="fr-mt-3w">
        <div className="fr-card fr-card--xs fr-card--grey fr-card--no-border">
          <div className={`fr-card__body`}>
            <div className="fr-card__content">
              <p className={`fr-card__title`}>
                <Link to="/tableaux/evolution-funding-signed">
                  Evolution des financements
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  );
}
