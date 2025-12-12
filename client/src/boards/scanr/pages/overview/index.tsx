import { Container, Row, Col, Title } from "@dataesr/dsfr-plus";
import FundedStructures from "./charts/funded-structures";

export default function Overview() {
  return (
    <Container>
      <Title>Overview Page</Title>
      <Row>
        <Col>
          <FundedStructures />
        </Col>
      </Row>
    </Container>
  );
}
