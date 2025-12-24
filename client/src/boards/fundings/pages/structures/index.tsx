import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import TopFundersByStructure from "./charts/top-funders-by-structure";
// import TopLabsByStructure from "./charts/top-labs-by-structure";
import TopCountyByStructure from "./charts/top-county-by-structure";
import TopFrenchPartnersByStructure from "./charts/top-french-partners-by-structure";
import TopInternationalPartnersByStructure from "./charts/top-international-partners-by-structure";
import TopProjectsByStructure from "./charts/top-projects-by-structure";


export default function Structures() {
  return (
    <Container>
      <Title>Structures Page</Title>
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
          <TopFrenchPartnersByStructure />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <TopInternationalPartnersByStructure />
        </Col>
      </Row>
    </Container>
  );
}
