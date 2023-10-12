import PropTypes from "prop-types";
import {
  Container, Row, Col,
  Highlight,
  Title,
} from "@dataesr/react-dsfr";
import FinancialGoals from "../data-visualization/financial-goals";
import TitleComponent from "../../../../components/title";

export default function ProjectSynthesis({ data }) {
  return (
    <Container as="section">
      <Row>
        <Col>
          <TitleComponent
            title="En un clin d'oeil"
            subTitle="..."
          />
          <Highlight size="sm">
            ...
          </Highlight>
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
    </Container>
  );
}

ProjectSynthesis.propTypes = {
  data: PropTypes.object,
};
ProjectSynthesis.defaultProps = {
  data: {},
};