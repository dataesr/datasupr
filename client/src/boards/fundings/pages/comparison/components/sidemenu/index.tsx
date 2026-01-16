import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet } from "react-router-dom";

import "./styles.scss";


export default function SidemenuStructures() {
  return (
    <Container>
      <Row>
        <Col lg={12} sm={12} className="fr-pt-3w">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
