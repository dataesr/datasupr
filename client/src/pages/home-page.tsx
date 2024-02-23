import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const { VITE_APP_SERVER_URL } = import.meta.env;

import {
  Button,
  Header, Logo, Service, FastAccess,
  Container, Row, Col,
  Title, Text, Badge,
} from '@dataesr/dsfr-plus';

import GenericCard from '../components/cards/generic-card.tsx';
import atlasImg from '../assets/atlas.png';

import './styles.scss';

type TDBDefinitionTypes = {
  id: string,
  label: string,
  searchDescription: string,
  tags: string[],
  url: string,
}

export default function HomePage() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //Call API to get the list of dashboards
    const getData = async () => {
      const response = await fetch(`${VITE_APP_SERVER_URL}/tableaux?tag=` + searchText);
      const data = await response.json();
      setSearchResults(data);
    }

    getData();
  }, [searchText]);

  return (
    <>
      <Header>
        <Logo text="Ministère de | l'enseignement supérieur | et de la recherche" />
        <Service name="DataSupR" tagline="Ensemble de tableaux de bord de l'enseignement supérieur, de la recherche et de l'innovation" />
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
              Rechercher un tableau de bord
            </Title>
          </Col>
        </Row>
        <Row>
          <Col md={10}>
            <label className="fr-label" htmlFor="text-input-text">
              Saisissez un mot clé pour rechercher un tableau de bord. Par exemple : "étudiants", "atlas", "France", "recherche", "finances", etc ...
            </label>
            <div className='search'>
              <input
                className="fr-input search-input"
                type="text"
                id="text-input-text"
                name="text-input-text"
                onChange={(e) => setSearchText(e.target.value)}
              />
              {
                (searchResults?.length > 0) ? (
                  <ul className='search-results'>
                    {searchResults.map((result: TDBDefinitionTypes) => (
                      <li
                        className='search-result'
                        key={result.id}
                      >
                        <span onClick={() => { navigate(result.url) }}>
                          <strong>{result.label}</strong>&nbsp;-&nbsp;<i>{result.searchDescription}</i>
                        </span>
                        <br />
                        {result.tags.map((tag) => (
                          <Badge
                            className="fr-mx-1w"
                            title={tag}
                            key={tag}
                            color='brown-cafe-creme'
                            onClick={() => { setSearchText(tag) }} //TODO: did not work
                          >
                            {tag}
                          </Badge>
                        ))}
                      </li>
                    ))}
                  </ul>
                ) : null
              }
            </div>
          </Col>
          <Col md={2}>
            <Button
              className="fr-mt-4w"
              color="pink-tuile"
              onClick={() => { }}
            >
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
        <Row gutters>
          <Col md={4}>
            <GenericCard
              description="L’Atlas des effectifs étudiants est un outil indispensable pour une bonne appréhension de la structuration territoriale de l’enseignement supérieur et pour l’élaboration de stratégies territoriales. Il présente, sous forme de cartes, de graphiques et de tableaux, la diversité du système français d’enseignement supérieur."
              image={<img className="fr-responsive-img" src={atlasImg} alt="" />}
              title="Atlas des effecifs étudiants"
              to="/atlas" />
          </Col>
          <Col md={4}>
            <GenericCard
              description="Projets européens"
              image={<img className="fr-responsive-img" src={atlasImg} alt="" />}
              title="Projets européens"
              to="/european-projects" />
          </Col>
          <Col md={4}>
            <GenericCard
              description="Open Alex"
              image={<img className="fr-responsive-img" src={atlasImg} alt="" />}
              title="Open Alex"
              to="/open-alex" />
          </Col>
        </Row>
      </Container>
      <footer className="fr-footer fr-mt-5w" role="contentinfo" id="footer">
        <div className="fr-container">
          <div className="fr-footer__body">
            <div className="fr-footer__brand fr-enlarge-link">
              <a href="/" title="Retour à l’accueil du site - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)">
                <p className="fr-logo">
                  Intitulé
                  <br />officiel
                </p>
              </a>
            </div>
            <div className="fr-footer__content">
              <p className="fr-footer__content-desc">Lorem [...] elit ut.</p>
              <ul className="fr-footer__content-list">
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" target="_blank" rel="noopener external" title="[À MODIFIER - Intitulé] - nouvelle fenêtre" href="https://legifrance.gouv.fr">legifrance.gouv.fr</a>
                </li>
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" target="_blank" rel="noopener external" title="[À MODIFIER - Intitulé] - nouvelle fenêtre" href="https://gouvernement.fr">gouvernement.fr</a>
                </li>
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" target="_blank" rel="noopener external" title="[À MODIFIER - Intitulé] - nouvelle fenêtre" href="https://service-public.fr">service-public.fr</a>
                </li>
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" target="_blank" rel="noopener external" title="[À MODIFIER - Intitulé] - nouvelle fenêtre" href="https://data.gouv.fr">data.gouv.fr</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="fr-footer__bottom">
            <ul className="fr-footer__bottom-list">
              <li className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href="#">Plan du site</a>
              </li>
              <li className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href="#">Accessibilité : non/partiellement/totalement conforme</a>
              </li>
              <li className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href="#">Mentions légales</a>
              </li>
              <li className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href="#">Données personnelles</a>
              </li>
              <li className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href="#">Gestion des cookies</a>
              </li>
            </ul>
            <div className="fr-footer__bottom-copy">
              <p>Sauf mention explicite de propriété intellectuelle détenue par des tiers, les contenus de ce site sont proposés sous <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank" rel="noopener external" title="[À MODIFIER - Intitulé] - nouvelle fenêtre">licence etalab-2.0</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
