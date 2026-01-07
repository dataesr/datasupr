import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet } from "react-router-dom";
import CustomSideMenu from "./components/sidemenu";

export default function FinanceUniversityRoutes() {
  return (
    <Container fluid>
      <Row>
        <Col xs="12" md="2" className="fr-mb-3w fr-mb-md-0">
          <CustomSideMenu />
        </Col>
        <Col xs="12" md="10">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
