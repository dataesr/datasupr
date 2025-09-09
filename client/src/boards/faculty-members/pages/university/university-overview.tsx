import { Container, Row, Col, Title, Text, Link } from "@dataesr/dsfr-plus";
import FieldsDistributionBar from "../../charts/general/general";
import CnuGroupsChart from "../../charts/cnu-group/cnu-chart";
import StatusDistribution from "../../charts/status/status";
import { AgeDistributionPieChart } from "../../charts/age/age";
import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";
import { EstablishmentTypeChart } from "../../charts/establishment-type/establishment";
import DisciplineStatusSummary from "../../components/fields-by-status";
import NavigationCards from "../../components/fields-cards";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";

export default function UniversityOverview() {
  return (
    <Container as="main">
      <Row className="fr-mt-3w">
        <Col md={12}>
          <Text size="sm">
            Descriptif de la répartition des{" "}
            <GlossaryTerm term="personnel enseignant">
              personnels enseignants
            </GlossaryTerm>{" "}
            par{" "}
            <GlossaryTerm term="établissement d'enseignement supérieur">
              établissement d'enseignement supérieur
            </GlossaryTerm>
            .
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

      <Row className="fr-mt-3w fr-mb-4w chart-container">
        <Col md={12}>
          <div className="fr-grid-row fr-grid-row--gutters">
            <Col md={4}>
              <div
                style={{
                  height: "100%",
                }}
              >
                <GeneralIndicatorsCard />
              </div>
            </Col>

            <Col md={4}>
              <div
                style={{
                  height: "100%",
                  borderLeft: "1px solid white",
                  paddingLeft: "1rem",
                }}
              >
                <DisciplineStatusSummary />
              </div>
            </Col>

            <Col md={4}>
              <div
                style={{
                  borderLeft: "1px solid white",
                  paddingLeft: "1rem",
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
            <Text size="sm" className="text-center ">
              <Link href="/personnel-enseignant/discipline/typologie">
                En savoir plus sur la parité hommes / femmes des enseignants
              </Link>
            </Text>
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
            Explorer par établissement
          </Title>
          <NavigationCards type="structures" maxItems={12} />
        </Col>
      </Row>
    </Container>
  );
}
