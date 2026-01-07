import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet } from "react-router-dom";
import CustomSideMenu from "./components/sidemenu";

export default function FinanceUniversityRoutes() {
  return (
    <Container>
      <Row>
        <Col xs="12" md="3" className="fr-mb-3w fr-mb-md-0">
          <CustomSideMenu />
        </Col>
        <Col xs="12" md="9">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
