import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet } from "react-router-dom";

import "./styles.scss";
import { Summary, SummaryItem, SummaryWrapper } from "../../../../../../components/summary";

export default function SidemenuStructures() {
  return (
    <Container>
      <Row>
        <Col lg={3} sm={12} className="fr-pt-3w">
          <SummaryWrapper className="sticky-summary">
            <Summary title="Sommaire">
              <SummaryItem href="#projects-by-structure" label="Nombre de projets par structure" />
              <SummaryItem href="#budget-by-structure" label="Budget par structure" />
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
