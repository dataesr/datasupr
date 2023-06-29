import PropTypes from "prop-types";
import {
  Col,
  Container,
  Row,
  Breadcrumb,
  BreadcrumbItem,
} from "@dataesr/react-dsfr";

import Title from "../../../components/title/index";

import Histogram from "../financial/tabs/tab1";
import Dispersion from "../financial/tabs/tab2";

export default function Financial({ query }) {
  return (
    <Container className="fr-mb-3w">
      <Row>
        <TitleComponent as="h1" look="h1" title="Tableau de bord financier" />
      </Row>
      <Row>
        <Histogram />
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
