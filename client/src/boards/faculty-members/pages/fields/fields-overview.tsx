import { Row, Col, Title, Text } from "@dataesr/dsfr-plus";
import FieldsDistributionBar from "../../charts/general/general";
import CnuGroupsChart from "../../charts/cnu-group/cnu-chart";
import StatusDistribution from "../../charts/status/status";
import { AgeDistributionPieChart } from "../../charts/age/age";
import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";
import { EstablishmentTypeChart } from "../../charts/establishment-type/establishment";
import DisciplineStatsSidebar from "../../components/top-indicators/top-fields-indicators";
import DisciplineStatusSummary from "../../components/fields-by-status";
import NavigationCards from "../../components/navigation-cards/navigation-cards";
import { useContextDetection } from "../../utils";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";
import Callout from "../../../../components/callout";
import "../styles.scss";

export default function FieldOverview() {
  const { contextId, context } = useContextDetection();

  return (
    <>
      <Row className="fr-mt-4w fr-mb-5w">
        <Col md={12}>
          <Callout className="callout-style-fields">
            <Text size="sm">
              Descriptif de notre référentiel des disciplines, limites et
              périmètres.
              <br />
              Cette page présente la répartition des{" "}
              <GlossaryTerm term="personnel enseignant">
                personnels enseignants
              </GlossaryTerm>{" "}
              par{" "}
              <GlossaryTerm term="grande discipline">
                grande discipline
              </GlossaryTerm>
              , avec une visualisation de l'équilibre femmes-hommes dans chaque
              domaine. Les barres horizontales permettent de comparer facilement
              les effectifs totaux entre disciplines, tandis que les segments
              colorés illustrent la proportion respective des enseignants par
              genre.
            </Text>
          </Callout>
        </Col>
      </Row>

      <Row className="fr-mb-6w">
        <Col md={12}>
          <div className="indicatorsSection">
            <Title as="h2" look="h4" className="indicatorsTitle">
              📊 Vue d'ensemble des indicateurs clés
            </Title>
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className={contextId ? "fr-col-md-4" : "fr-col-md-3"}>
                <div className="indicatorCard">
                  <GeneralIndicatorsCard />
                </div>
              </div>

              {!contextId && (
                <div className="fr-col-md-3">
                  <div className="indicatorCardWithBorder">
                    <DisciplineStatsSidebar />
                  </div>
                </div>
              )}

              <div className={contextId ? "fr-col-md-4" : "fr-col-md-3"}>
                <div className="indicatorCardWithBorder">
                  <DisciplineStatusSummary />
                </div>
              </div>

              <div className={contextId ? "fr-col-md-4" : "fr-col-md-3"}>
                <div className="indicatorCardWithBorder">
                  <AgeDistributionPieChart />
                </div>
              </div>
            </div>
            <Row className="fr-mt-3w">
              <Col md={12}>
                <Text size="sm" className="indicatorsNote">
                  <i>
                    Ces indicateurs sont calculés pour l'année universitaire
                    2023-24. Dans l'effectif il y a tous les enseignants, tout
                    statut confondu (permanents, contractuels, vacataires,
                    etc.).
                  </i>
                </Text>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {context === "fields" && !contextId && (
        <Row className="fr-mb-6w">
          <Col md={12}>
            <div className="chartSection">
              <FieldsDistributionBar />
            </div>
          </Col>
        </Row>
      )}

      <Row className="fr-mb-6w">
        <Col md={12}>
          <div className="chartSection">
            <StatusDistribution />
          </div>
        </Col>
      </Row>

      <Row className="fr-mb-6w">
        <Col md={12}>
          <div className="chartSection">
            <CnuGroupsChart />
          </div>
        </Col>
      </Row>

      <Row className="fr-mb-6w">
        <Col md={12}>
          <div className="chartSection">
            <EstablishmentTypeChart />
          </div>
        </Col>
      </Row>

      <Row className="fr-mt-7w fr-mb-6w">
        <Col md={12}>
          <div className="navigationSection">
            <Title as="h3" look="h4" className="navigationTitle">
              🔍 Explorer par discipline
            </Title>
            <NavigationCards type="fields" maxItems={25} />
          </div>
        </Col>
      </Row>
    </>
  );
}
