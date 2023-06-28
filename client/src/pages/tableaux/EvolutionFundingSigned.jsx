import PropTypes from 'prop-types';
import Prototype from '../../components/graphs/prototype';
import EvolutionFundingSignedChart from '../../components/graphs/evolution-funding-signed';

export default function EvolutionFundingSigned({ query }) {

    return (
        <div>
            <h1>EvolutionFundingSigned</h1>
            <Prototype />
            <EvolutionFundingSignedChart />
        </div>
    );
}

EvolutionFundingSigned.propTypes = {
    query: PropTypes.object,
};
EvolutionFundingSigned.defaultProps = {
    query: {},
};
