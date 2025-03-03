import { Outlet, useLocation } from "react-router-dom";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import CustomBreadcrumb from "./components/custom-breadcrumb";
import CustomSideMenu from "./components/side-menu";
import Filters from "./components/filters";

export default function Main() {
  const { pathname } = useLocation();

  return (
    <main>
      <Container>
        <Row>
          <Col className="fr-ml-1w">
            <CustomBreadcrumb pageKey={pathname.split("/").slice(-1)[0]} />
            <Filters />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4} className="fr-pl-2w">
            <CustomSideMenu />
          </Col>
          <Col xs={12} md={8} className="fr-pt-6w">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </main>
  );
}
