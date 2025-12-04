import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { VITE_APP_SERVER_URL } = import.meta.env;

import { Badge, Button, Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";

import GenericCard from "../components/cards/generic-card/index.tsx";

import "./styles.scss";
import Footer from "../layout/footer.tsx";
import HeaderDatasupR from "../layout/header.tsx";

type TDBDefinitionTypes = {
  id: string;
  label: string;
  searchDescription: string;
  tags: string[];
  url: string;
};

export default function HomePage() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //Call API to get the list of dashboards
    const getData = async () => {
      const response = await fetch(`${VITE_APP_SERVER_URL}/tableaux?tag=` + searchText);
      const data = await response.json();
      setSearchResults(data);
    };

    getData();
  }, [searchText]);

  return (
    <>
      <HeaderDatasupR />
      <Container>
        <Row className="fr-mt-5w">
          <Col>
            <Title as="h2" className="fr-mb-2w">
              DataSupR - Tableaux de bord de l'enseignement supérieur, de la recherche et de l'innovation
            </Title>
            <Text>
              Bienvenue sur dataSupR, la plateforme de visualisation des données de l'enseignement supérieur, de la recherche et de l'innovation.
              <br />
              Vous y trouverez des tableaux de bord interactifs, des cartes, des graphiques et des données brutes sur les effectifs étudiants, les
              ressources humaines, les formations, les diplômes, la recherche, les publications, les brevets, les finances, etc.
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
          <Col md={10} className="search">
            <label className="fr-label" htmlFor="text-input-text">
              Saisissez un mot clé pour rechercher un tableau de bord. Par exemple : "étudiants", "atlas", "France", "recherche", "finances", etc ...
            </label>
            <input className="fr-input" type="text" id="text-input-text" name="text-input-text" onChange={(e) => setSearchText(e.target.value)} />
            {searchResults?.length > 0 ? (
              <ul className="search-results">
                {searchResults.map((result: TDBDefinitionTypes) => (
                  <li className="search-result" key={result.id}>
                    <span
                      onClick={() => {
                        navigate(result.url);
                      }}
                    >
                      <strong>{result.label}</strong>&nbsp;-&nbsp;
                      <i>{result.searchDescription}</i>
                    </span>
                    <br />
                    {result.tags.map((tag) => (
                      <Badge
                        className="fr-mx-1w"
                        title={tag}
                        key={tag}
                        color="brown-cafe-creme"
                        onClick={() => {
                          setSearchText(tag);
                        }} //TODO: did not work
                      >
                        {tag}
                      </Badge>
                    ))}
                  </li>
                ))}
              </ul>
            ) : null}
          </Col>
          <Col md={2}>
            <Button className="fr-mt-4w" color="pink-tuile" icon="search-line" onClick={() => {}}>
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
          <Col>
            <GenericCard
              description="L’Atlas des effectifs étudiants est un outil indispensable pour une bonne appréhension de la structuration territoriale de l’enseignement supérieur et pour l’élaboration de stratégies territoriales. Il présente, sous forme de cartes, de graphiques et de tableaux, la diversité du système français d’enseignement supérieur."
              title="Atlas des effectifs étudiants"
              to="/atlas?datasupr=true"
            />
          </Col>
        </Row>
        <Row gutters>
          <Col>
            <GenericCard description="Projets européens" title="Projets européens" to="/european-projects?datasupr=true" />
          </Col>
        </Row>
        <Row gutters>
          <Col>
            <GenericCard description="Open Alex" title="Open Alex" to="/open-alex?datasupr=true" />
          </Col>
        </Row>
        <Row gutters>
          <Col>
            <GenericCard description="TEDS" title="TEDS" to="/teds?datasupr=true" />
          </Col>
        </Row>
        <Row gutters>
          <Col>
            <GenericCard description="Tableau de bord financier des universités" title="Finance" to="/finance-universite?datasupr=true" />
          </Col>
        </Row>
        <Row gutters>
          <Col>
            <GenericCard description="Diplomés" title="Diplomés" to="/graduates" />
          </Col>
        </Row>
        <Row gutters>
          <Col>
            <GenericCard
              description="Tableau de bord du personnel enseignant"
              title="Personnel enseignant"
              to="/personnel-enseignant?datasupr=true"
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
