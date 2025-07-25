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
import NavigationCards from "../../components/fields-cards";
import { useContextDetection } from "../../utils";

export default function RegionsOverview() {
  const { contextId } = useContextDetection();

  return (
    <Container as="main">
      <Row className="fr-mt-3w">
        <Col md={12}>
          <Text>
            Descriptif de la répartition géographique des personnels enseignants
            en France métropolitaine et d'outre-mer.
            <br />
            Cette page présente la répartition des personnels enseignants par
            région, avec une visualisation de l'équilibre femmes-hommes dans
            chaque région. Les données présentées sur cette page sont la sommes
            des données des régions. Les barres horizontales permettent de
            comparer facilement les effectifs totaux entre régions, tandis que
            les segments colorés illustrent la proportion respective des
            enseignants par genre.
          </Text>
        </Col>
      </Row>
      <Row className="fr-mt-3w fr-mb-4w">
        <Col md={12}>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className={contextId ? "fr-col-md-4" : "fr-col-md-3"}>
              <div
                className="fr-background-alt--blue-france fr-p-3w"
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
                  className="fr-background-alt--blue-france fr-p-3w"
                  style={{ height: "100%" }}
                >
                  <DisciplineStatsSidebar />
                </div>
              </div>
            )}

            <div className={contextId ? "fr-col-md-4" : "fr-col-md-3"}>
              <div
                className="fr-background-alt--blue-france fr-p-3w"
                style={{
                  height: "100%",
                }}
              >
                <DisciplineStatusSummary />
              </div>
            </div>

            <div className={contextId ? "fr-col-md-4" : "fr-col-md-3"}>
              <div
                className="fr-background-alt--blue-france fr-p-3w"
                style={{
                  height: "100%",
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
            <Text size="sm" className="fr-mt-2w">
              Répartition des personnels enseignants par région avec
              visualisation de l'équilibre femmes-hommes.
            </Text>
          </div>
        </Col>
      </Row>
      <Row className="fr-mt-4w">
        <Col md={12}>
          <div className="fr-background-alt--blue-france fr-p-3w">
            <StatusDistribution />
            <Text size="sm" className="fr-mt-2w">
              Répartition par statut des personnels enseignants, distinguant
              notamment les enseignants-chercheurs, les titulaires
              non-chercheurs et les non-titulaires.
            </Text>
          </div>
        </Col>
      </Row>
      <Row className="fr-mt-4w">
        <Col md={12}>
          <div className="fr-background-alt--blue-france fr-p-3w">
            <CnuGroupsChart />
            <Text size="sm" className="fr-mt-2w">
              Répartition des enseignants-chercheurs par groupe CNU. Cette
              visualisation montre la distribution des effectifs selon les
              principales disciplines académiques.
            </Text>
          </div>
        </Col>
      </Row>
      <Row className="fr-background-alt--blue-france fr-mt-3w">
        <Col md={6} className="fr-pr-2w">
          <div style={{ height: "100%" }}>
            <EstablishmentTypeChart />
            <Text size="sm" className="fr-mt-2w">
              Distribution des personnels enseignants selon les différentes
              catégories d'établissements d'enseignement supérieur.
            </Text>
          </div>
        </Col>
        <Col md={6} className="fr-pl-2w">
          <div
            className="fr-background-alt--blue-france fr-p-3w"
            style={{ height: "100%" }}
          >
            <FacultyMap />
            <Text size="sm" className="fr-mt-2w">
              Répartition géographique des personnels enseignants en France.
              Cliquez sur une région pour afficher ses détails.
            </Text>
          </div>
        </Col>
      </Row>
      <Row className="fr-mt-5w fr-mb-5w">
        <Col md={12}>
          <Title as="h4" look="h5">
            Explorer par région
          </Title>
          <NavigationCards type="regions" maxItems={12} />
        </Col>
      </Row>
    </Container>
  );
}
