import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Container, Row, Col,
} from "@dataesr/react-dsfr";

const FundingParticipant = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>Pas encore de donnée</p>;
  }

  const optionsFunding = {
    chart: {
      type: "column",
      height: 500,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: data[0].data.map((item) => (item.calculated_action_name)),
    },
    series: [
      {
        name: "Part des montants captés %",
        data: data[0].data.map((item) => ({
          name: item.calculated_action_name,
          y: item['funding_%'],
        })),
        yAxis: 0,
      },
    ],
  };

  const optionsParticipants = {
    chart: {
      type: "column",
      height: 500,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: data[0].data.map((item) => (item.calculated_action_name)),
    },
    series: [
      {
        name: "Part du nombre de participants %",
        data: data[0].data.map((item) => ({
          name: item.calculated_action_name,
          y: item['participant_%'],
        })),
        yAxis: 0,
      },
    ],
  };

  return (
    <Container as="section">
      <Row>
        <Col>
          <HighchartsReact highcharts={Highcharts} options={optionsFunding} />
        </Col>
        <Col>
          <HighchartsReact highcharts={Highcharts} options={optionsParticipants} />
        </Col>
      </Row>
    </Container>
  );
};

export default FundingParticipant;

FundingParticipant.propTypes = {
  data: PropTypes.array,
};
FundingParticipant.defaultProps = {
  data: [],
};