import PropTypes from "prop-types";
import {
  Col,
  Container,
  Row,
  Breadcrumb,
  BreadcrumbItem,
} from "@dataesr/react-dsfr";

import Title from "../../../components/title/index";

import Histogram from "../../../components/graphs/evolution-financial-indicator";
import Dispersion from "../../../components/graphs/dispersion-financial";

export default function Financial({ query }) {
  return (
    <Container className="fr-mb-3w">
      <Row>
        <Title as="h1" look="h1" title="Tableau de bord financier" />
      </Row>
      <Row>
        <Histogram /> {/* doit prendre comme props id_paysage OU code_uai */}
      </Row>
      <Row>
        <Dispersion />
      </Row>
    </Container>
  );
}

Financial.propTypes = {
  query: PropTypes.object,
};
Financial.defaultProps = {
  query: {},
};
