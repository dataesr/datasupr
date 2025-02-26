import { Breadcrumb, Col, Container, Link, Row } from "@dataesr/dsfr-plus";

export default function Methodology() {
  return (
    <Container as="main">
      <Row className="fr-mb-5w">
        <Col>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/atlas">Accueil</Link>
            <Link>
              <strong>Méthodologie</strong>
            </Link>
          </Breadcrumb>
        </Col>
      </Row>

      <h1>Méthodologie</h1>
      <p>
        Le site dataSupR - Atlas des effectifs étudiant-e-s est un outil de
        visualisation des données d'effectifs étudiant-e-s dans l'enseignement
        supérieur français.
      </p>
      <h2>Données</h2>
      <p>
        Les données sont issues du traitement des bases de données du Ministère
        de l'Enseignement Supérieur, de la Recherche et de l'Innovation. Elles
        sont collectées chaque année par les établissements d'enseignement
        supérieur et transmises au Ministère.
      </p>
      <h2>Champ</h2>
      <p>
        Les données portent sur les effectifs étudiant-e-s inscrit-e-s dans les
        établissements publics et privés d'enseignement supérieur français.
      </p>
      <h2>Modalités</h2>
      <p>
        Les données sont présentées sous forme de cartes, de graphiques et de
        tableaux. Elles sont accessibles par année universitaire, par territoire
        et par filière.
      </p>
    </Container>
  );
}
