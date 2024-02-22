import { Container, Row, Col } from "@dataesr/dsfr-plus";
import Horizon2020Participation from "./charts/horizon-2020-participation";

export default function Overview() {
  return (
    <Container as="main">
      <Row>
        <Col>
          <Horizon2020Participation />
        </Col>
      </Row>
    </Container>
  );
}