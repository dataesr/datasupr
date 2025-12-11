import { Container, Row, Col, Title } from "@dataesr/dsfr-plus";
import MainPartners from "./charts/main-partners";

export default function Overview() {
  return (
    <Container>
      <Title>Overview Page</Title>
      <Row>
        <Col>
          <MainPartners />
        </Col>
      </Row>
    </Container>
  );
}
