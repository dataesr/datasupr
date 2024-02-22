import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import CustomBreadcrumb from "./components/custom-breadcrumb";
import { CustomSideMenu } from "./components/side-menu";

export default function Main() {
  const { pathname } = useLocation();

  return (
    <main>
      <Container>
        <Row>
          <Col className="fr-ml-1w">
            <CustomBreadcrumb pageKey={pathname.split('/').slice(-1)[0]} />
          </Col>
        </Row>
      </Container>
      <CustomSideMenu />
    </main>
  );
}