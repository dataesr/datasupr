import { Col, Container, Row } from "@dataesr/dsfr-plus";

import TopFundersByStructure from "./charts/top-funders-by-structure";
// import TopLabsByStructure from "./charts/top-labs-by-structure";
import FrenchPartnersByStructure from "./charts/french-partners-by-structure";
import InternationalPartnersByStructure from "./charts/international-partners-by-structure";
import ParticipationsOverTimeBudgetByStructure from "./charts/participations-over-time-budget-by-structure";
import ParticipationsOverTimeByStructure from "./charts/participations-over-time-by-structure";
import TopCountyByStructure from "./charts/top-county-by-structure";
import TopProjectsByStructure from "./charts/top-projects-by-structure";


export default function Structures() {
  return (
    <Container>
      <Row gutters>
        <Col>
          <TopFundersByStructure />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <TopProjectsByStructure />
        </Col>
      </Row>
      {/* <Row gutters>
        <Col>
          <TopLabsByStructure />
        </Col>
      </Row> */}
      <Row gutters>
        <Col>
          <TopCountyByStructure />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <FrenchPartnersByStructure />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <InternationalPartnersByStructure />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <ParticipationsOverTimeByStructure />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <ParticipationsOverTimeBudgetByStructure />
        </Col>
      </Row>
    </Container>
  );
}
