import { Col, Row } from "@dataesr/dsfr-plus";
import PillarsFundingValues from "../charts/pillars-funding";
import PillarsFundingSuccessRates from "../charts/pillars-funding-success-rates";
import PillarsFundingProportion from "../charts/pillars-funding-proportion";

export default function PillarsFunding() {
  return (
    <>
      <Row gutters>
        <Col>
          <PillarsFundingValues />
        </Col>
        <Col>
          <PillarsFundingSuccessRates />
        </Col>
      </Row>
      <Row>
        <Col>
          <PillarsFundingProportion />
        </Col>
      </Row>
    </>
  );
}
