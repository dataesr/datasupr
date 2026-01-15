import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import { useState } from "react";
import OverviewByStructure from "./charts/overview-by-structure";
import ProjectsByStructure from "./charts/projects-by-structure";
import ProjectsOverTimeByStructure from "./charts/projects-over-time-by-structure";
import StructureSelector from "./components/structure-selector";
import YearSelector from "../../components/year-selector";


export default function Structures() {
  const [searchParams] = useSearchParams({});
  const structure = searchParams.get("structure");
  const year = searchParams.get("year");
  const [name, setName] = useState();

  const scanrUrl = `https://scanr.enseignementsup-recherche.gouv.fr/search/projects?filters=%257B%2522year%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A${year}%257D%252C%257B%2522value%2522%253A${year}%257D%255D%252C%2522type%2522%253A%2522range%2522%257D%252C%2522participants.structure.id%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A%2522${structure}%2522%252C%2522label%2522%253A%2522${name}%2522%257D%255D%252C%2522type%2522%253A%2522terms%2522%252C%2522operator%2522%253A%2522or%2522%257D%252C%2522type%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A%2522Horizon%25202020%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522ANR%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522PIA%2520hors%2520ANR%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522Horizon%2520Europe%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522PIA%2520ANR%2522%252C%2522label%2522%253Anull%257D%255D%252C%2522type%2522%253A%2522terms%2522%252C%2522operator%2522%253A%2522or%2522%257D%257D`;

  return (
    <Container className="board-fundings">
      <Row gutters>
        <Col>
          <StructureSelector setName={setName} />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <YearSelector />
        </Col>
      </Row>
      {(structure) ? (
        <>
          <Row gutters>
            <Col>
              <ProjectsByStructure name={name} />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <OverviewByStructure name={name} />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <ProjectsOverTimeByStructure name={name} />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <div className="chart-container chart-container--default" id="projects-list">
                <Title as="h2" look="h6">
                  {`Liste des projets de ${name}`}
                </Title>
                <div>
                  <a href={scanrUrl} target="_blank">Voir ces projets sur scanR</a>
                </div>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <div className="fr-alert fr-alert--info fr-mt-3w">
          <h3 className="fr-alert__title">Sélectionner une structure</h3>
          <p>
            Choisissez une structure dans la liste déroulante pour visualiser
            ses financements via les appels à projet. Vous pouvez filtrer par région.
          </p>
        </div>
      )}
    </Container>
  );
}
