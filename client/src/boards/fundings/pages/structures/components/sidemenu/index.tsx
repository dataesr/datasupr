import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet, useLocation } from "react-router-dom";

import "./styles.scss";

export default function SidemenuStructures() {
  const location = useLocation();

  return (
    <Container>
      <Row>
        <Col md={3}>
          <div title="" className="sidemenu sticky">
            <div>
              <ul>
                <li>
                  <a href="#top-funders-by-structure" className={`${location.hash === "#top-funders-by-structure" ? "selected" : ""}`}>
                    Top 25 des financeurs par structure
                  </a>
                </li>
                <li>
                  <a href="#top-projects-by-structure" className={`${location.hash === "#top-projects-by-structure" ? "selected" : ""}`}>
                    Top 25 des projets par structure
                  </a>
                </li>
                <li>
                  <a href="#top-county-by-structure" className={`${location.hash === "#top-county-by-structure" ? "selected" : ""}`}>
                    Nombre de participations par structure
                  </a>
                </li>
                <li>
                  <a href="#french-partners-by-structure" className={`${location.hash === "#french-partners-by-structure" ? "selected" : ""}`}>
                    Partenaires français, institutionnels et actifs
                  </a>
                </li>
                <li>
                  <a href="#international-partners-by-structure" className={`${location.hash === "#international-partners-by-structure" ? "selected" : ""}`}>
                    Partenaires internationaux, institutionnels et actifs
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
