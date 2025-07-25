import { Container, Row, Col, Title, Text } from "@dataesr/dsfr-plus";
import FieldsDistributionBar from "../../charts/general/general";
import CnuGroupsChart from "../../charts/cnu-group/cnu-chart";
import StatusDistribution from "../../charts/status/status";
import { AgeDistributionPieChart } from "../../charts/age/age";
import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";
import { EstablishmentTypeChart } from "../../charts/establishment-type/establishment";
import DisciplineStatusSummary from "../../components/fields-by-status";
import NavigationCards from "../../components/fields-cards";

export default function UniversityOverview() {
  return (
    <Container as="main">
      <Row className="fr-mt-3w">
        <Col md={12}>
          <Text>
            Descriptif de la répartition des personnels enseignants par
            établissement d'enseignement supérieur.
            <br />
            Cette page présente la répartition des personnels enseignants par
            université et composante, avec une visualisation de l'équilibre
            femmes-hommes dans chaque établissement. Les barres horizontales
            permettent de comparer facilement les effectifs totaux entre
            universités, tandis que les segments colorés illustrent la
            proportion respective des enseignants par genre.
          </Text>
        </Col>
      </Row>

      <Row className="fr-mt-3w fr-mb-4w">
        <Col md={12}>
          <div className="fr-grid-row fr-grid-row--gutters">
            <Col md={4}>
              <div
                className="fr-background-alt--blue-france fr-p-3w"
                style={{
                  height: "100%",
                }}
              >
                <GeneralIndicatorsCard />
              </div>
            </Col>

            <Col md={4}>
              <div
                className="fr-background-alt--blue-france fr-p-3w"
                style={{
                  height: "100%",
                }}
              >
                <DisciplineStatusSummary />
              </div>
            </Col>

            <Col md={4}>
              <div
                className="fr-background-alt--blue-france fr-p-3w"
                style={{
                  height: "100%",
                }}
              >
                <AgeDistributionPieChart />
              </div>
            </Col>
          </div>
        </Col>
      </Row>

      <Row className="fr-mt-4w">
        <Col md={12}>
          <div className="fr-background-alt--blue-france fr-p-3w">
            <FieldsDistributionBar />
            <Text size="sm" className="fr-mt-2w">
              Répartition des personnels enseignants par établissement avec
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
              principales disciplines académiques dans les établissements.
            </Text>
          </div>
        </Col>
      </Row>

      <Row className="fr-mt-4w">
        <Col md={12}>
          <div className="fr-background-alt--blue-france fr-p-3w">
            <EstablishmentTypeChart />
            <Text size="sm" className="fr-mt-2w">
              Distribution des personnels enseignants selon les différentes
              catégories d'établissements d'enseignement supérieur.
            </Text>
          </div>
        </Col>
      </Row>

      <Row className="fr-mt-5w fr-mb-5w">
        <Col md={12}>
          <Title as="h4" look="h5">
            Explorer par établissement
          </Title>
          <NavigationCards type="structures" maxItems={12} />
        </Col>
      </Row>
    </Container>
  );
}
