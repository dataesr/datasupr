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
                  <a href="#funded-structures" className={`${location.hash === "#funded-structures" ? "selected" : ""}`}>
                    Top 25 des structures françaises par nombre de financements
                  </a>
                </li>
                <li>
                  <a href="#funded-structures-budget" className={`${location.hash === "#funded-structures-budget" ? "selected" : ""}`}>
                    Top 25 des structures françaises par montant des financements des projets auxquels elles participent
                  </a>
                </li>
                <li>
                  <a href="#funded-labs" className={`${location.hash === "#funded-labs" ? "selected" : ""}`}>
                    Top 25 des laboratoires français par nombre de financements
                  </a>
                </li>
                <li>
                  <a href="#funded-labs-budget" className={`${location.hash === "#funded-labs-budget" ? "selected" : ""}`}>
                    Top 25 des laboratoires français par montant des financements des projets auxquels elles participent
                  </a>
                </li>
                <li>
                  <a href="#funded-structures-europe" className={`${location.hash === "#funded-structures-europe" ? "selected" : ""}`}>
                    Top 25 des structures européennes (hors France) par nombre de financements
                  </a>
                </li>
                <li>
                  <a href="#funded-structures-europe-budget" className={`${location.hash === "#funded-structures-europe-budget" ? "selected" : ""}`}>
                    Top 25 des structures européennes (hors France) par montant des financements des projets auxquels elles participent
                  </a>
                </li>
                <li>
                  <a href="#top-county" className={`${location.hash === "#top-county" ? "selected" : ""}`}>
                    Nombre de participations par région
                  </a>
                </li>
                <li>
                  <a href="#participations-over-time" className={`${location.hash === "#participations-over-time" ? "selected" : ""}`}>
                    Nombre de projets par financeur par année de début du projet
                  </a>
                </li>
                <li>
                  <a href="#participations-over-time-budget" className={`${location.hash === "#participations-over-time-budget" ? "selected" : ""}`}>
                    Montant total des projets par financeur par année de début du projet
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
