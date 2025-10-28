import { Col, Row } from "@dataesr/dsfr-plus";
import TopicsFundingValues from "../charts/topics-funding";
import TopicsFundingSuccessRates from "../charts/topics-funding-success-rates";
import TopicsFundingProportion from "../charts/topics-funding-proportion";
import ChartFooter from "../../../../../components/chart-footer";
import { EPChartsSource, EPChartsUpdateDate } from "../../../config";

export default function TopicsFunding() {
  return (
    <>
      <Row className="chart-container chart-container--programs" style={{ marginLeft: "var(--spacing-1w)", marginRight: "var(--spacing-1w)" }}>
        <Col md={6}>
          <TopicsFundingValues />
        </Col>
        <Col md={6}>
          <TopicsFundingSuccessRates />
        </Col>
        <Col md={12} className="chart-footer">
          <ChartFooter
            comment={{
              fr: (
                <>
                  Ce graphique affiche la répartition des financements demandés et obtenus (en M€) par thématique, ainsi que le taux de succès associé
                  (montants obtenus / montants demandés).
                </>
              ),
              en: (
                <>
                  This chart displays the distribution of requested and obtained funding (in M€) by topic, as well as the associated success rate
                  (amounts obtained / amounts requested).
                </>
              ),
            }}
            readingKey={{
              fr: (
                <>
                  Pour la thématique "Excellence Scientifique", les projets ont demandé X M€ de financements, et en ont obtenu Y M€, soit un taux de
                  succès de Z %.
                </>
              ),
              en: (
                <>For the "Scientific Excellence" topic, projects requested X M€ in funding and obtained Y M€, representing a success rate of Z%.</>
              ),
            }}
            source={EPChartsSource}
            updateDate={EPChartsUpdateDate}
          />
        </Col>
      </Row>
      <Row className="fr-mt-1w chart-container chart-container--programs">
        <Col>
          <TopicsFundingProportion />
        </Col>
      </Row>
    </>
  );
}
