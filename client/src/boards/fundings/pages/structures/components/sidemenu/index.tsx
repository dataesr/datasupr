import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet } from "react-router-dom";

import { Summary, SummaryItem, SummaryWrapper } from "../../../../../../components/summary";

import "./styles.scss";


export default function SidemenuStructures() {
  return (
    <Container>
      <Row>
        <Col lg={3} sm={12} className="fr-pt-3w">
          <SummaryWrapper className="sticky-summary">
            <Summary title="Sommaire">
              <SummaryItem href="#projects-by-structure" label="Nombre de projets et leurs montants" />
              <SummaryItem href="#overview-by-structure" label="Vue relative des financements" />
              <SummaryItem href="#projects-list" label="Liste des projets" />
            </Summary>
          </SummaryWrapper>
        </Col>
        <Col lg={9} sm={12} className="fr-pt-3w">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
