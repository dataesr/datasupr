import { Col, Container, Row } from "@dataesr/dsfr-plus";

import FundedLabs from "./charts/funded-labs";
import FundedLabsBudget from "./charts/funded-labs-budget";
import FundedStructures from "./charts/funded-structures";
import FundedStructuresBudget from "./charts/funded-structures-budget";
import FundedStructuresEurope from "./charts/funded-structures-europe";
import FundedStructuresEuropeBudget from "./charts/funded-structures-europe-budget";
import ParticipationsOverTime from "./charts/participations-over-time";
import ParticipationsOverTimeBudget from "./charts/participations-over-time-budget";
import TopCounty from "./charts/top-county";

export default function Overview() {
  return (
    <Container>
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
          <TopCounty />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <ParticipationsOverTime />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <ParticipationsOverTimeBudget />
        </Col>
      </Row>
    </Container>
  );
}
