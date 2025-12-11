import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet } from "react-router-dom";
// import CustomSideMenu from "../sidemenu";

export default function SidemenuLayout() {
  return (
    <Container>
      <Row>
        {/* <Col md={3}>
          <CustomSideMenu />
        </Col> */}
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
