import { Col, Container, Row } from "@dataesr/dsfr-plus";
import CustomSideMenu from "./components/side-menu";
import { Outlet } from "react-router-dom";

export default function FinanceUniversityRoutes() {
  return (
    <Container>
      <Row>
        <Col md="3">
          <CustomSideMenu />
        </Col>
        <Col md="9">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
