import { Col, Row } from "@dataesr/dsfr-plus";
// import DestinationFundingValues from "../charts/destination-funding";
// import DestinationFundingSuccessRates from "../charts/destination-funding-success-rates";
// import DestinationFundingProportion from "../charts/destination-funding-proportion";

export default function TopicsFunding() {
  return (
    <>
      <Row gutters>
        <Col>
          {/* <DestinationFundingValues /> */}
          graph1
        </Col>
        <Col>
          {/* <DestinationFundingSuccessRates /> */}
          graph2
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <DestinationFundingProportion /> */}
          graph3
        </Col>
      </Row>
    </>
  );
}
