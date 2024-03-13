import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { Outlet } from "react-router-dom";
import Menu from "./menu";

export default function AnalysisHomepage() {
  return (
    <Container as="main">
      <Menu />
      <Row>
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}