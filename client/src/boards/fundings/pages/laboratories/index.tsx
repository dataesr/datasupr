import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import TopFundersByLaboratory from "./charts/top-funders-by-laboratory";
import TopCountyByLaboratory from "./charts/top-county-by-laboratory";
import TopProjectsLaboratory from "./charts/top-projects-by-laboratory";

export default function Structures() {
  return (
    <Container>
      <Title>Vue par laboratoire</Title>
      <Row gutters>
        <Col>
          <TopFundersByLaboratory />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <TopProjectsLaboratory />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <TopCountyByLaboratory />
        </Col>
      </Row>
    </Container>
  );
}
