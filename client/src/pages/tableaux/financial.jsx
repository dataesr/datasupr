import PropTypes from 'prop-types';
import Indic from '../../components/chart/chart';

export default function Financial({ query }) {

    return (
        <div>
            <h1>Tableau de bord financier</h1>
            <Indic />
        </div>
    );
}

Financial.propTypes = {
    query: PropTypes.object,
};
Financial.defaultProps = {
    query: {},
};
