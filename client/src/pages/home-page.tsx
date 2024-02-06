import {
  Button,
  Header, Logo, Service, FastAccess,
  Container, Row, Col,
  Title, Text,
} from '@dataesr/dsfr-plus';

import GenericCard from '../components/cards/generic-card.tsx';
import atlasImg from '../assets/atlas.png';

export default function HomePage() {
  return (
    <>
      <Header>
        <Logo text="Ministère de | l'enseignement supérieur | et de la recherche" />
        <Service name="DataSupR" tagline="Ensemble de tableaux de bord de l'enseignement supérieur et de la recherche" />
        <FastAccess>
          <Button as="a" href="https://github.com/dataesr/react-dsfr" target="_blank" rel="noreferer noopener" icon="github-fill" size="sm" variant="text">Github</Button>
          <Button as="a" href="https://www.systeme-de-design.gouv.fr" target="_blank" rel="noreferer noopener" icon="code-s-slash-line" size="sm" variant="text">Jeux de données</Button>
        </FastAccess>
      </Header>
      <Container>
        <Row className="fr-mt-5w">
          <Col>
            <Title as="h2" className="fr-mb-2w">
              dataSupR - Tableaux de bord de l'enseignement supérieur, de la recherche et de l'innovation
            </Title>
            <Text>
              Bienvenue sur dataSupR, la plateforme de visualisation des données de l'enseignement supérieur, de la recherche et de l'innovation.
              <br />Vous y trouverez des tableaux de bord interactifs, des cartes, des graphiques et des données brutes sur les effectifs étudiants, les ressources humaines, les formations, les diplômes, la recherche, les publications, les brevets, les finances, etc.
            </Text>
          </Col>
        </Row>
        <Row className="fr-mt-5w">
          <Col>
            <Title as="h3" look="h5" className="fr-mb-2w">
              Rechercher un tableaux de bord
            </Title>
          </Col>
        </Row>
        <Row>
          <Col md={10}>
            <label className="fr-label" htmlFor="text-input-text">
              Rechercher dans tous les territoires disponibles
            </label>
            <input className="fr-input" type="text" id="text-input-text" name="text-input-text" />
          </Col>
          <Col md={2}>
            <Button
              className="fr-mt-4w"
              color="pink-tuile">
              Rechercher
            </Button>
          </Col>
        </Row>
        <Row className="fr-mt-5w">
          <Col>
            <Title as="h3" look="h5" className="fr-mb-2w">
              Proposition des tableaux de bord à explorer
            </Title>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <GenericCard
              description="L’Atlas des effectifs étudiants est un outil indispensable pour une bonne appréhension de la structuration territoriale de l’enseignement supérieur et pour l’élaboration de stratégies territoriales. Il présente, sous forme de cartes, de graphiques et de tableaux, la diversité du système français d’enseignement supérieur."
              image={<img className="fr-responsive-img" src={atlasImg} alt="" />}
              title="Atlas des effecifs étudiants"
              to="/atlas" />
          </Col>
        </Row>
      </Container >
    </>
  )
}
