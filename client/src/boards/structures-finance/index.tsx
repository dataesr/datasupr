import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet } from "react-router-dom";
import CustomSideMenu from "./components/sidemenu";

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
