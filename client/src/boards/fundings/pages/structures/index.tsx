import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

// import FrenchPartnersByStructure from "./charts/french-partners-by-structure";
// import InternationalPartnersByStructure from "./charts/international-partners-by-structure";
// import ParticipationsOverTimeBudgetByStructure from "./charts/participations-over-time-budget-by-structure";
// import ParticipationsOverTimeByStructure from "./charts/participations-over-time-by-structure";
// import ProjectsByStructure from "./charts/projects-by-structure";
// import TopCountyByStructure from "./charts/top-county-by-structure";
// import TopFundersByStructure from "./charts/top-funders-by-structure";
// import TopProjectsByStructure from "./charts/top-projects-by-structure";
import BudgetByStructure from "./charts/budget-by-structure";
import ProjectsByStructure from "./charts/projects-by-structure";
import StructuresSelector from "./components/structuresSelector";


export default function Structures() {
  return (
    <Container>
      <Row gutters>
        <Col>
          <StructuresSelector />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <ProjectsByStructure />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <BudgetByStructure />
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
      {/* <Row gutters>
        <Col>
          <TopFundersByStructure />
        </Col>
      </Row> */}
      {/* <Row gutters>
        <Col>
          <TopProjectsByStructure />
        </Col>
      </Row> */}
      {/* <Row gutters>
        <Col>
          <TopCountyByStructure />
        </Col>
      </Row> */}
      {/* <Row gutters>
        <Col>
          <FrenchPartnersByStructure />
        </Col>
      </Row> */}
      {/* <Row gutters>
        <Col>
          <InternationalPartnersByStructure />
        </Col>
      </Row> */}
      {/* <Row gutters>
        <Col>
          <ParticipationsOverTimeByStructure />
        </Col>
      </Row> */}
      {/* <Row gutters>
        <Col>
          <ParticipationsOverTimeBudgetByStructure />
        </Col>
      </Row> */}
    </Container>
  );
}
