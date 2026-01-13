import { Col, Container, Row} from "@dataesr/dsfr-plus";

import ParticipationsOverTimeByCounty from "./charts/participations-over-time-by-county";


export default function Overview() {
  return (
    <Container>
      <Row gutters>
        <Col>
          <ParticipationsOverTimeByCounty />
        </Col>
      </Row>
    </Container>
  );
}
