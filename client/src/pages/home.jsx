import {
  Container, Row, Col,
  Card, CardTitle, CardDescription,
  TagGroup, Tag,
} from "@dataesr/react-dsfr";
import { useQuery } from "@tanstack/react-query";
import Title from "../components/title/index.jsx";

import { Link } from "react-router-dom";

async function getInitialOptions() {
  return fetch("/api/init").then((response) => {
    if (response.ok) return response.json();
    return "Oops... La requète d'initialiation n'a pas fonctionné";
  });
}

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["init"],
    queryFn: getInitialOptions,
  });
  return (
    <Container className="fr-my-15w">
      <Title
        as="h1"
        look="h1"
        title="dataSupR"
        subTitle="Annuaire des données de la recherche et de l'enseignement supérieur"
      />
      <Row>
        <Col className="text-center">
          <Link to="/search">Rechercher</Link>
        </Col>
      </Row>
      <Row gutters>
        <Col n="6">
          <Card href="/tableaux/tableau-de-bord-financier">
            <CardTitle>
              Tableau de bord financier
            </CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Uenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              <TagGroup>
                <Tag>
                  Enseignement Supérieur
                </Tag>
              </TagGroup>
            </CardDescription>
          </Card>
        </Col>
        <Col n="6">
          <Card href="/tableaux/european-projects">
            <CardTitle>
              Projets européens
            </CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Uenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              <TagGroup>
                <Tag>
                  Recherche
                </Tag>
              </TagGroup>
            </CardDescription>
          </Card>
        </Col>
      </Row>

      {/* <Text>{isLoading ? 'Chargement...' : data?.options.description}</Text> */}
    </Container>
  );
}
