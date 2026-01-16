import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { Outlet, useSearchParams } from "react-router-dom";

import { Summary, SummaryItem, SummaryWrapper } from "../../../../../../components/summary";

import "./styles.scss";


export default function SidemenuStructures() {
  const [searchParams] = useSearchParams({});
  const structure = searchParams.get("structure");

  return (
    <Container>
      <Row>
        {(structure?.length ?? 0 > 0) ? (
          <>
            <Col lg={3} sm={12} className="fr-pt-3w">
              <SummaryWrapper className="sticky-summary">
                <Summary title="Sommaire">
                  <SummaryItem href="#projects-by-structure" label="Nombre de projets et leurs montants" />
                  <SummaryItem href="#overview-by-structure" label="Vue relative des financements" />
                  <SummaryItem href="#pprojects-over-time-by-structure" label="Evolution du nombre de projets et leurs montants au cours du temps" />
                  <SummaryItem href="#projects-list" label="Liste des projets" />
                </Summary>
              </SummaryWrapper>
            </Col>
            <Col lg={9} sm={12} className="fr-pt-3w">
              <Outlet />
            </Col>
          </>
        ) : (
          <Col lg={12} sm={12} className="fr-pt-3w">
            <Outlet />
          </Col>
        )}
      </Row>
    </Container>
  );
}
