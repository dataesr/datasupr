import EvolutionFundingSignedChart from "../europrojects/tabs/evolution-funding-signed";
import PropTypes from "prop-types";
import { Container, Row, Col } from "@dataesr/react-dsfr";
import TitleComponent from "../../../components/title";

export default function EvolutionFundingSigned({ query }) {
  return (
    <Container className="fr-mb-3w">
      <Row>
        <Col n="12">
          <TitleComponent as="h1" look="h1" title="Les projets européens" />
        </Col>
        <Col n="12">
          <EvolutionFundingSignedChart />
        </Col>
      </Row>
    </Container>
  );
}

EvolutionFundingSigned.propTypes = {
  query: PropTypes.object,
};
EvolutionFundingSigned.defaultProps = {
  query: {},
};
