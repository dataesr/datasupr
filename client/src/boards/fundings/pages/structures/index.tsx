import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import TopFundersByStructure from "./charts/top-funders-by-structure";
// import TopLabsByStructure from "./charts/top-labs-by-structure";
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
    </Container>
  );
}
