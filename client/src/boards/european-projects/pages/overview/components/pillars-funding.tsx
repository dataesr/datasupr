import { Col, Container, Row } from "@dataesr/dsfr-plus";
import PillarsFundingValues from "../charts/pillars-funding";
import PillarsFundingSuccessRates from "../charts/pillars-funding-success-rates";
import PillarsFundingProportion from "../charts/pillars-funding-proportion";
import ChartFooter from "../../../../../components/chart-footer";
import { EPChartsSource, EPChartsUpdateDate } from "../../../config";

export default function PillarsFunding() {
  return (
    <Container fluid>
      <Row className="chart-container chart-container--pillars" style={{ marginLeft: "var(--spacing-1w)", marginRight: "var(--spacing-1w)" }}>
        <Col md={6}>
          <PillarsFundingValues />
        </Col>
        <Col md={6}>
          <PillarsFundingSuccessRates />
        </Col>
        <Col md={12} className="chart-footer">
          <ChartFooter
            comment={{
              fr: (
                <>
                  Ce graphique affiche la répartition des financements demandés et obtenus (en M€) par pilier, ainsi que le taux de succès associé
                  (montants obtenus / montants demandés).
                </>
              ),
              en: (
                <>
                  This chart displays the distribution of requested and obtained funding (in M€) by pillar, as well as the associated success rate
                  (amounts obtained / amounts requested).
                </>
              ),
            }}
            readingKey={{
              fr: (
                <>
                  Pour le pilier "Excellence Scientifique", les projets ont demandé 5 835 M€ de financements, et en ont obtenu 1 154.3 M€, soit un
                  taux de succès de 19.8 %.
                </>
              ),
              en: (
                <>
                  For the "Scientific Excellence" pillar, projects requested 5,835 M€ in funding and obtained 1,154.3 M€, representing a success rate
                  of 19.8%.
                </>
              ),
            }}
            source={EPChartsSource}
            updateDate={EPChartsUpdateDate}
          />
        </Col>
      </Row>

      <Row className="fr-mt-1w chart-container chart-container--pillars">
        <Col>
          <PillarsFundingProportion />
        </Col>
      </Row>
    </Container>
  );
}
