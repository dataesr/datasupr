import { Container, Row, Col, Title, Text } from "@dataesr/dsfr-plus";
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

export default function RegionsOverview() {
  const { contextId } = useContextDetection();

  return (
    <Container as="main">
      <Row className="fr-mt-3w">
        <Col md={12}>
          <Callout className="callout-style-geo">
            <Text size="sm">
              Cette page présente la répartition du{" "}
              <GlossaryTerm term="personnels enseignants">
                personnels enseignants
              </GlossaryTerm>{" "}
              par région, avec une visualisation de l'équilibre femmes-hommes
              dans chaque région. Les données présentées sur cette page sont la
              somme des données des régions. <br />
              <br />
            </Text>
          </Callout>
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
      <Row className="fr-mt-4w">
        <Col md={12}>
          <div className="fr-background-alt--blue-france fr-p-3w">
            <FieldsDistributionBar />
          </div>
        </Col>
      </Row>
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
      <Row className="fr-background-alt--blue-france fr-mt-3w">
        <Col md={6} className="fr-pr-2w">
          <div className="fr-background-alt--blue-france fr-p-3w">
            <EstablishmentTypeChart />
          </div>
        </Col>
        <Col md={6} className="fr-pl-2w">
          <div className="fr-background-alt--blue-france fr-p-3w">
            <Title className="fr-mb-2w" look="h5">
              Comment sont répartis les personnels enseignants en France ?
            </Title>
            <FacultyMap />

            <Text
              size="sm"
              className="fr-fi-arrow-right-line fr-icon--sm fr-mt-3w"
              aria-hidden="true"
            >
              <i>
                Plus la couleur est foncée, plus il y a de personnels
                enseignants.
              </i>
            </Text>
            <Text size="sm">
              Répartition géographique des{" "}
              <GlossaryTerm term="personnel enseignant">
                personnels enseignants
              </GlossaryTerm>{" "}
              en France. Cliquez sur une région pour afficher ses détails.
            </Text>
          </div>
        </Col>
      </Row>
      <Row className="fr-mt-5w fr-mb-5w">
        <Col md={12}>
          <Title as="h4" look="h5">
            Explorer par région
          </Title>
          <NavigationCards type="regions" />
        </Col>
      </Row>
    </Container>
  );
}
