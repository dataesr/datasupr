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
              <SummaryItem href="#top-funders-by-structure" label="Top 25 des financeurs par structure" />
              <SummaryItem href="#top-projects-by-structure" label="Top 25 des projets par structure" />
              <SummaryItem href="#top-county-by-structure" label="Nombre de participations par structure" />
              <SummaryItem href="#french-partners-by-structure" label="Partenaires français" />
              <SummaryItem href="#international-partners-by-structure" label="Partenaires internationaux" />
              <SummaryItem href="#participations-over-time-by-structure" label="Nombre de projets par financeur par année de début du projet" />
              <SummaryItem
                href="#participations-over-time-budget-by-structure"
                label="Montant total des projets par financeur par année de début du projet"
              />
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
