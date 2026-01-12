import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet } from "react-router-dom";

export default function FinanceUniversityRoutes() {
  return (
    <Container>
      <Row>
        <Col xs="12" md="12">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
