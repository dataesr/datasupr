import PropTypes from 'prop-types';
import Prototype from '../../components/graphs/prototype';

export default function Financial({ query }) {

    return (
        <div>
            <h1>Tableau de bord financier</h1>
            <Prototype />
        </div>
    );
}

Financial.propTypes = {
    query: PropTypes.object,
};
Financial.defaultProps = {
    query: {},
};
