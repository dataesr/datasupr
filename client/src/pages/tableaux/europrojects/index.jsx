import EvolutionFundingSignedChart from "../europrojects/tabs/evolution-funding-signed";
import PropTypes from "prop-types";
import { Container, Row } from "@dataesr/react-dsfr";
import TitleComponent from "../../../components/title";

export default function EvolutionFundingSigned({ query }) {
  return (
    <Container className="fr-mb-3w">
      <Row>
        <TitleComponent as="h1" look="h1" title="Les projets européens" />
      </Row>
      <Row>
        <EvolutionFundingSignedChart />
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
