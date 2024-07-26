import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { Outlet } from "react-router-dom";

export default function AnalysisHomepage() {
  return (
    <Container as="main">
      <Row>
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
