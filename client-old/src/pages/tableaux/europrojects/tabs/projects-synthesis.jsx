import PropTypes from "prop-types";
import {
  Container, Row, Col,
  Highlight,
  Title,
} from "@dataesr/react-dsfr";
import FinancialGoals from "../data-visualization/financial-goals";
import FundingParticipant from "../data-visualization/funding_participant";
import SituationCard from "../data-visualization/situations-cards";
import TitleComponent from "../../../../components/title";

import situationData from "../../../../assets/data/situations-cards.json"


export default function ProjectSynthesis({ data }) {
  return (
    <Container as="section">
      <Row>
        <Col>
          <TitleComponent
            title="Synthèse de la France"
            subTitle="Cette synthèse s'appuie sur les réponses et résultats des appels à projets clôturés entre le 30 mars 2021 et le 29 novembre 2022"
          />
          <Highlight size="sm">
            Entre janvier 2021 et fin novembre 2022, la Commission européenne a clôturé 239 appels à projets et mobilisé un budget de 20 599,15 M€. Sur les 41 953 propositions de projets évaluées, 16,3% ont été retenues. Au 29 novembre 2022, 6 830 contrats sont signés dont 1 700 en cours de finalisation. Les 47 399 porteurs de projets ont obtenu une subvention globale de 19 037,3 M€.
          </Highlight>
        </Col>
      </Row>

      <Row>
        <Col>
          <Title as="h4">
            Chiffres clés
          </Title>
          <SituationCard data={situationData} />
        </Col>
      </Row>
      {
        data && data["funding_programme"] && data["funding_programme"].length > 0 && (
          <Row className="fr-mt-5w">
            <Col>
              <Title as="h4">
                Objectifs financés
              </Title>
              <FinancialGoals data={data["funding_programme"].filter((item) => item.country_code === 'FR')} />
            </Col>
          </Row>
        )
      }
      {
        data && data["funding_participant_share_actions"] && data["funding_participant_share_actions"].length > 0 && (
          <Row className="fr-mt-5w">
            <Col>
              <Title as="h4">
                Types de projets financés
              </Title>
              <FundingParticipant data={data["funding_participant_share_actions"].filter((item) => item.country_code === 'FR')} />
            </Col>
          </Row>
        )
      }
    </Container>
  );
}

ProjectSynthesis.propTypes = {
  data: PropTypes.object,
};
ProjectSynthesis.defaultProps = {
  data: {},
};