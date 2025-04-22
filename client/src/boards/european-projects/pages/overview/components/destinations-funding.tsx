import { Col, Row } from "@dataesr/dsfr-plus";
import DestinationFundingValues from "../charts/destination-funding";
import DestinationFundingSuccessRates from "../charts/destination-funding-success-rates";
import DestinationFundingProportion from "../charts/destination-funding-proportion";

export default function DestinationsFunding() {
  return (
    <>
      <Row gutters>
        <Col>
          <DestinationFundingValues />
        </Col>
        <Col>
          <DestinationFundingSuccessRates />
        </Col>
      </Row>
      <Row>
        <Col>
          <DestinationFundingProportion />
        </Col>
      </Row>
    </>
  );
}
