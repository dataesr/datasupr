import { Row, Col, Text } from "@dataesr/dsfr-plus";
import { AgeEvolutionChart } from "./chart/age-evolution/age-evolution";
import { StatusEvolutionChart } from "./chart/status/status";
import { TrendsChart } from "./chart/trend/trends";
import Callout from "../../../../components/callout";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";
import "../styles.scss";

export function Evolution() {
  return (
    <>
      <Row className="fr-mt-4w fr-mb-5w">
        <Col md={12}>
          <Callout className="callout-style-fields">
            <Text size="sm">
              Cette page présente l'évolution temporelle des{" "}
              <GlossaryTerm term="personnels enseignants">
                personnels enseignants
              </GlossaryTerm>{" "}
              dans l'enseignement supérieur français. Les graphiques permettent
              d'analyser les tendances sur plusieurs années selon différents
              critères : effectifs globaux, répartition par statut et
              distribution par tranche d'âge.
            </Text>
          </Callout>
        </Col>
      </Row>

      <Row className="fr-mb-6w">
        <Col md={12}>
          <div className="chartSection">
            <TrendsChart />
          </div>
        </Col>
      </Row>

      <Row className="fr-mb-6w">
        <Col md={12}>
          <div className="chartSection">
            <StatusEvolutionChart />
          </div>
        </Col>
      </Row>

      <Row className="fr-mb-6w">
        <Col md={12}>
          <div className="chartSection">
            <AgeEvolutionChart />
          </div>
        </Col>
      </Row>
    </>
  );
}
