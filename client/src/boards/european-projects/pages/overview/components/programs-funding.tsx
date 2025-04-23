import { Col, Row } from "@dataesr/dsfr-plus";
import ProgramsFundingValues from "../charts/programs-funding";
import ProgramsFundingSuccessRates from "../charts/programs-funding-success-rates";
import ProgramsFundingProportion from "../charts/programs-funding-proportion";

export default function ProgramsFunding() {
  return (
    <>
      <Row gutters>
        <Col>
          <ProgramsFundingValues />
        </Col>
        <Col>
          <ProgramsFundingSuccessRates />
        </Col>
      </Row>
      <Row>
        <Col>
          <ProgramsFundingProportion />
        </Col>
      </Row>
    </>
  );
}
