import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import OverviewByStructure from "./charts/overview-by-structure";
import ProjectsByStructure from "./charts/projects-by-structure";
import SelectedStructure from "./components/selected-structure";
import StructuresSelector from "./components/structures-selector";
import { useState } from "react";


export default function Structures() {
  const [searchParams] = useSearchParams({});
  const structure = searchParams.get("structure");
  const [name, setName] = useState();

  return (
    <Container>
      <Row gutters>
        <Col>
          <StructuresSelector setName={setName} />
        </Col>
      </Row>
      {structure ? (
        <>
          <Row gutters>
            <Col>
              <SelectedStructure name={name} />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <ProjectsByStructure name={name} />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <div id="projects-list">
                <Title>
                  Liste des projets de la structure choisie
                </Title>
                <div>
                  <a href="https://scanr.enseignementsup-recherche.gouv.fr/search/projects?filters=%257B%2522year%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A2024%257D%252C%257B%2522value%2522%253A2024%257D%255D%252C%2522type%2522%253A%2522range%2522%257D%252C%2522participants.structure.id%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A%2522180089013%2522%252C%2522label%2522%253A%2522Centre%2520national%2520de%2520la%2520recherche%2520scientifique%2522%257D%255D%252C%2522type%2522%253A%2522terms%2522%252C%2522operator%2522%253A%2522or%2522%257D%252C%2522type%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A%2522Horizon%25202020%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522ANR%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522PIA%2520hors%2520ANR%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522Horizon%2520Europe%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522PIA%2520ANR%2522%252C%2522label%2522%253Anull%257D%255D%252C%2522type%2522%253A%2522terms%2522%252C%2522operator%2522%253A%2522or%2522%257D%257D" target="_blank">Voir ces projets sur scanR</a>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <OverviewByStructure name={name} />
            </Col>
          </Row>
        </>
      ) : (
        <div className="fr-alert fr-alert--info fr-mt-3w">
          <h3 className="fr-alert__title">Sélectionnez un établissement</h3>
          <p>
            Utilisez les filtres ci-dessus pour affiner votre recherche, puis
            sélectionnez un établissement dans la liste déroulante pour visualiser
            ses données financières.
          </p>
        </div>
      )}
    </Container>
  );
}
