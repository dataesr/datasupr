import { Container, Row, Col, Title, Text } from "@dataesr/dsfr-plus";
import FieldsDistributionBar from "../../charts/general/general";
import CnuGroupsChart from "../../charts/cnu-group/cnu-chart";
import StatusDistribution from "../../charts/status/status";
import { AgeDistributionPieChart } from "../../charts/age/age";
import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";
import { EstablishmentTypeChart } from "../../charts/establishment-type/establishment";
import DisciplineStatsSidebar from "../../components/top-indicators/top-fields-indicators";
import DisciplineStatusSummary from "../../components/fields-by-status";
import NavigationCards from "../../components/fields-cards";
import { useContextDetection } from "../../utils";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";

export default function FieldOverview() {
  const { contextId, context } = useContextDetection();

  return (
    <Container as="main">
      <Row className="fr-mt-3w">
        <Col md={12}>
          <Text size="sm">
            Descriptif de notre référentiel des disciplines, limites et
            périmètres. <br />
            Cette page présente la répartition des{" "}
            <GlossaryTerm term="personnel enseignant">
              personnels enseignants
            </GlossaryTerm>{" "}
            par{" "}
            <GlossaryTerm term="grande discipline">
              {" "}
              grande discipline
            </GlossaryTerm>
            , avec une visualisation de l'équilibre femmes-hommes dans chaque
            domaine. Les barres horizontales permettent de comparer facilement
            les effectifs totaux entre disciplines, tandis que les segments
            colorés illustrent la proportion respective des enseignants par
            genre. Le tableau associé détaille les effectifs précis et les
            pourcentages par discipline.
          </Text>
        </Col>
      </Row>
      <Row className="fr-mt-3w fr-mb-4w chart-container">
        <Col md={12}>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className={contextId ? "fr-col-md-4" : "fr-col-md-3"}>
              <div
                style={{
                  height: "100%",
                }}
              >
                <GeneralIndicatorsCard />
              </div>
            </div>

            {!contextId && (
              <div className="fr-col-md-3">
                <div
                  style={{
                    height: "100%",
                    borderLeft: "1px solid white",
                    paddingLeft: "1rem",
                  }}
                >
                  <DisciplineStatsSidebar />
                </div>
              </div>
            )}

            <div className={contextId ? "fr-col-md-4" : "fr-col-md-3"}>
              <div
                style={{
                  height: "100%",
                  borderLeft: "1px solid white",
                  paddingLeft: "1rem",
                }}
              >
                <DisciplineStatusSummary />
              </div>
            </div>
            <div className={contextId ? "fr-col-md-4" : "fr-col-md-3"}>
              <div
                style={{
                  borderLeft: "1px solid white",
                  paddingLeft: "1rem",
                }}
              >
                <AgeDistributionPieChart />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {context === "fields" && !contextId && (
        <Row className="fr-mt-4w">
          <Col md={12}>
            <div className="fr-background-alt--blue-france fr-p-3w">
              <FieldsDistributionBar />
            </div>
          </Col>
        </Row>
      )}

      <Row className="fr-mt-4w">
        <Col md={12}>
          <div className="fr-background-alt--blue-france fr-p-3w">
            <StatusDistribution />
          </div>
        </Col>
      </Row>

      <Row className="fr-mt-4w">
        <Col md={12}>
          <div className="fr-background-alt--blue-france fr-p-3w">
            <CnuGroupsChart />
          </div>
        </Col>
      </Row>

      <Row className="fr-mt-4w">
        <Col md={12}>
          <div className="fr-background-alt--blue-france fr-p-3w">
            <EstablishmentTypeChart />
          </div>
        </Col>
      </Row>

      <Row className="fr-mt-5w fr-mb-5w">
        <Col md={12}>
          <Title as="h4" look="h5">
            Explorer par discipline
          </Title>
          <NavigationCards type="fields" maxItems={25} />
        </Col>
      </Row>
    </Container>
  );
}
