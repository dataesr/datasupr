import { Col, Container, Row , Title} from "@dataesr/dsfr-plus";

import ParticipationsOverTimeByCounty from "./charts/participations-over-time-by-county";


export default function Overview() {
  return (
    <Container>
      <Title>Vue par région</Title>
      <Row gutters>
        <Col>
          <ParticipationsOverTimeByCounty />
        </Col>
      </Row>
    </Container>
  );
}
