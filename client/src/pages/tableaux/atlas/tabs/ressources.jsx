import PropTypes from "prop-types";
import {
  Container, Row, Col,
  Title,
} from "@dataesr/react-dsfr";
import TitleComponent from "../../../../components/title";

export default function Evolutions({ data }) {
  return (
    <Container as="section">
      <Row>
        <Col>
          <TitleComponent
            title="ressources"
            subTitle="..."
          />
        </Col>
      </Row>
      {/* {
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
      } */}


    </Container>
  );
}

Evolutions.propTypes = {
  data: PropTypes.array,
};
Evolutions.defaultProps = {
  data: [],
};