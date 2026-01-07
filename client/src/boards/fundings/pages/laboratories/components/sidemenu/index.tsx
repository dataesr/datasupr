import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet, useLocation } from "react-router-dom";

import "./styles.scss";

export default function SidemenuLaboratories() {
  const location = useLocation();

  return (
    <Container>
      <Row>
        <Col md={3}>
          <div title="" className="sidemenu sticky">
            <div>
              <ul>
                <li>
                  <a href="#top-funders-by-laboratory" className={`${location.hash === "#top-funders-by-laboratory" ? "selected" : ""}`}>
                    Top 25 des financeurs par laboratoire
                  </a>
                </li>
                <li>
                  <a href="#top-projects-by-laboratory" className={`${location.hash === "#top-projects-by-laboratory" ? "selected" : ""}`}>
                    Top 25 des projets par laboratoire
                  </a>
                </li>
                <li>
                  <a href="#top-county-by-laboratory" className={`${location.hash === "#top-county-by-laboratory" ? "selected" : ""}`}>
                    Nombre de participations de laboratoires par région
                  </a>
                </li>
                <li>
                  <a href="#french-partners-by-laboratory" className={`${location.hash === "#french-partners-by-laboratory" ? "selected" : ""}`}>
                    Partenaires français
                  </a>
                </li>
                <li>
                  <a href="#international-partners-by-laboratory" className={`${location.hash === "#international-partners-by-laboratory" ? "selected" : ""}`}>
                    Partenaires internationaux
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
