import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import FundedLabs from "./charts/funded-labs";
import FundedLabsBudget from "./charts/funded-labs-budget";
import FundedStructures from "./charts/funded-structures";
import FundedStructuresBudget from "./charts/funded-structures-budget";
import FundedStructuresEurope from "./charts/funded-structures-europe";
import FundedStructuresEuropeBudget from "./charts/funded-structures-europe-budget";
import TopFundersByStructure from "./charts/top-funders-by-structure";
// import TopLabsByStructure from "./charts/top-labs-by-structure";
// import TopProjectsByStructure from "./charts/top-projects-by-structure";

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
          <FundedStructuresBudget />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <FundedLabs />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <FundedLabsBudget />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <FundedStructuresEurope />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <FundedStructuresEuropeBudget />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <TopFundersByStructure />
        </Col>
      </Row>
      {/* <Row gutters>
        <Col>
          <TopProjectsByStructure />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <TopLabsByStructure />
        </Col>
      </Row> */}
    </Container>
  );
}
