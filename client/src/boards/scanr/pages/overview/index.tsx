import { Container, Row, Col, Title } from "@dataesr/dsfr-plus";

import FundedStructures from "./charts/funded-structures";
import TopFundersByStructure from "./charts/top-funders-by-structure";

export default function Overview() {
  return (
    <Container>
      <Title>Overview Page</Title>
      <Row gutters>
        <Col>
          <FundedStructures />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <TopFundersByStructure />
        </Col>
      </Row>
    </Container>
  );
}
