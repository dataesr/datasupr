import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet, useLocation } from "react-router-dom";

import "./styles.scss";

export default function SidemenuCounties() {
  const location = useLocation();

  return (
    <Container>
      <Row>
        <Col md={3}>
          <div title="" className="sidemenu sticky">
            <div>
              <ul>
                <li>
                  <a href="#participations-over-time-by-county" className={`${location.hash === "#participations-over-time-by-county" ? "selected" : ""}`}>
                    Nombre de projets par financeur par année de début du projet
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Col>
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
