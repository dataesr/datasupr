import PropTypes from "prop-types";
import {
  Container, Row, Col,
  Highlight,
  Title,
} from "@dataesr/react-dsfr";
import EvolutionFunding from "../data-visualization/evolution-funding";
import TitleComponent from "../../../../components/title";
import EvolutionCoordination from "../data-visualization/evolution-coordination";

export default function Evolutions({ data }) {
  return (
    <Container as="section">
      <Row>
        <Col>
          <TitleComponent
            title="Evolutions"
            subTitle="Cette synthèse s'appuie sur les réponses et résultats des appels à projets clôturés entre le 30 mars 2021 et le 29 novembre 2022"
          />
        </Col>
      </Row>
      {
        data && data["evol_all_pc_funding_SIGNED"] && data["evol_all_pc_funding_SIGNED"].length > 0 && (
          <Row>
            <Col>
              <Title as="h4">
                Principaux pays bénéficiaires
              </Title>
              <EvolutionFunding
                data={data["evol_all_pc_funding_SIGNED"]}
                title="Evolution annuelle des parts captées"
              />
            </Col>
          </Row>
        )
      }
      {
        data && data["evol_all_pc_funding_EVAL"] && data["evol_all_pc_funding_EVAL"].length > 0 && (
          <Row>
            <Col>
              <EvolutionFunding
                data={data["evol_all_pc_funding_EVAL"]}
                title="Evolution annuelle des parts de subventions demandées"
              />
            </Col>
          </Row>
        )
      }
      {
        data && data["evol_all_pc_coordination_SIGNED"] && data["evol_all_pc_coordination_SIGNED"].length > 0 && (
          <Row>
            <Col>
              <EvolutionCoordination
                data={data["evol_all_pc_coordination_SIGNED"]}
                title="Evolution annuelle des parts de coordination des projets signés"
              />
            </Col>
          </Row>
        )
      }

    </Container>
  );
}

Evolutions.propTypes = {
  data: PropTypes.array,
};
Evolutions.defaultProps = {
  data: [],
};