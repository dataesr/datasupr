import { Row, Col, Title, Text } from "@dataesr/dsfr-plus";
import FieldsDistributionBar from "../../charts/general/general";
import CnuGroupsChart from "../../charts/cnu-group/cnu-chart";
import StatusDistribution from "../../charts/status/status";
import { AgeDistributionPieChart } from "../../charts/age/age";
import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";
import { EstablishmentTypeChart } from "../../charts/establishment-type/establishment";
import DisciplineStatsSidebar from "../../components/top-indicators/top-fields-indicators";
import DisciplineStatusSummary from "../../components/fields-by-status";
import FacultyMap from "./components/map";
import NavigationCards from "../../components/navigation-cards/navigation-cards";
import { useContextDetection } from "../../utils";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";
import Callout from "../../../../components/callout";
import "../styles.scss";

export default function RegionsOverview() {
  const { contextId } = useContextDetection();

  return (
    <>
      <Row className="fr-mt-4w fr-mb-5w">
        <Col md={12}>
          <Callout className="callout-style-geo">
            <Text size="sm">
              Cette page présente la répartition du{" "}
              <GlossaryTerm term="personnels enseignants">
                personnels enseignants
              </GlossaryTerm>{" "}
              par région, avec une visualisation de l'équilibre femmes-hommes
              dans chaque région. Les données présentées sur cette page sont la
              somme des données des régions.
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

      <Row className="fr-mb-6w">
        <Col md={12}>
          <div className="chartSection">
            <FieldsDistributionBar />
          </div>
        </Col>
      </Row>

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
        <Col md={6} className="fr-pr-2w">
          <div className="chartSection">
            <EstablishmentTypeChart />
          </div>
        </Col>
        <Col md={6} className="fr-pl-2w">
          <div className="mapSection">
            <Title className="mapTitle" look="h5">
              🗺️ Comment sont répartis les personnels enseignants en France ?
            </Title>
            <FacultyMap />

            <div className="mapInfoBox">
              <Text size="sm" className="mapInfoTitle">
                💡 Lecture de la carte
              </Text>
              <Text size="sm">
                Plus la couleur est foncée, plus il y a de{" "}
                <GlossaryTerm term="personnel enseignant">
                  personnels enseignants
                </GlossaryTerm>
                . Cliquez sur une région pour afficher ses détails.
              </Text>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="fr-mt-7w fr-mb-6w">
        <Col md={12}>
          <div className="navigationSection">
            <Title as="h3" look="h4" className="navigationTitle">
              🔍 Explorer par région
            </Title>
            <NavigationCards type="regions" />
          </div>
        </Col>
      </Row>
    </>
  );
}
