import { Row, Col, Title, Text, Link, Alert } from "@dataesr/dsfr-plus";
import FieldsDistributionBar from "../../charts/general/general";
import CnuGroupsChart from "../../charts/cnu-group/cnu-chart";
import StatusDistribution from "../../charts/status/status";
import { AgeDistributionPieChart } from "../../charts/age/age";
import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";
import { EstablishmentTypeChart } from "../../charts/establishment-type/establishment";
import DisciplineStatusSummary from "../../components/fields-by-status";
import NavigationCards from "../../components/navigation-cards/navigation-cards";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";
import { useContextDetection } from "../../utils";
import { useFacultyMembersYears } from "../../api/general-queries";
import { useSearchParams } from "react-router-dom";
import Callout from "../../../../components/callout";
import "../styles.scss";

export default function UniversityOverview() {
  const { contextId, context } = useContextDetection();
  const { data: yearsData } = useFacultyMembersYears();
  const [searchParams] = useSearchParams();

  const selectedYear = searchParams.get("annee_universitaire") || "";
  const isYearAvailable = yearsData?.available_years?.includes(selectedYear);

  const hasDataForSelectedYear = isYearAvailable;

  return (
    <>
      {hasDataForSelectedYear ? (
        <>
          <Row className="fr-mt-4w fr-mb-5w">
            <Col md={12}>
              <Callout className="callout-style-university">
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
                  Cette page présente la répartition des personnels enseignants
                  par université et composante, avec une visualisation de
                  l'équilibre femmes-hommes dans chaque établissement. Les
                  barres horizontales permettent de comparer facilement les
                  effectifs totaux entre universités, tandis que les segments
                  colorés illustrent la proportion respective des enseignants
                  par genre.
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
                  <div className="fr-col-md-4">
                    <div className="indicatorCard">
                      <GeneralIndicatorsCard />
                    </div>
                  </div>

                  <div className="fr-col-md-4">
                    <div className="indicatorCardWithBorder">
                      <DisciplineStatusSummary />
                    </div>
                  </div>

                  <div className="fr-col-md-4">
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
                        2023-24. Dans l'effectif il y a tous les enseignants,
                        tout statut confondu (permanents, contractuels,
                        vacataires, etc.).
                      </i>
                    </Text>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row className="fr-mb-6w">
            <Col md={12}>
              <div className="chartSectionWithLink">
                <FieldsDistributionBar />
                <Text size="sm" className="text-center fr-mt-3w">
                  <Link href="/personnel-enseignant/discipline/typologie">
                    En savoir plus sur la parité Femmes/Hommes des enseignants
                  </Link>
                </Text>
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

          {context === "structures" && !contextId && (
            <Row className="fr-mb-6w">
              <Col md={12}>
                <div className="chartSection">
                  <EstablishmentTypeChart />
                </div>
              </Col>
            </Row>
          )}
        </>
      ) : (
        <Row className="fr-mt-4w">
          <Col md={12}>
            <Alert
              variant="error"
              title="Aucune donnée disponible"
              description={
                contextId && yearsData?.last_complete_year
                  ? `Aucune donnée disponible pour l'année universitaire ${selectedYear}. La dernière année disponible est ${yearsData.last_complete_year}.`
                  : "Aucune donnée disponible pour la période sélectionnée."
              }
            />
          </Col>
        </Row>
      )}

      <Row className="fr-mt-7w fr-mb-6w">
        <Col md={12}>
          <div className="navigationSection">
            <Title as="h3" look="h4" className="navigationTitle">
              🏛️ Explorer par établissement
            </Title>
            <NavigationCards type="structures" maxItems={20} />
          </div>
        </Col>
      </Row>
    </>
  );
}
