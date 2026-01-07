import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import FrenchPartnersByLaboratory from "./charts/french-partners-by-laboratory";
import InternationalPartnersByLaboratory from "./charts/international-partners-by-laboratory";
import TopCountyByLaboratory from "./charts/top-county-by-laboratory";
import TopFundersByLaboratory from "./charts/top-funders-by-laboratory";
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
      <Row gutters>
        <Col>
          <FrenchPartnersByLaboratory />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <InternationalPartnersByLaboratory />
        </Col>
      </Row>
    </Container>
  );
}
