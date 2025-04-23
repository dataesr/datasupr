import { Col, Row } from "@dataesr/dsfr-plus";
import TopicsFundingValues from "../charts/topics-funding";
import TopicsFundingSuccessRates from "../charts/topics-funding-success-rates";
import TopicsFundingProportion from "../charts/topics-funding-proportion";

export default function TopicsFunding() {
  return (
    <>
      <Row gutters>
        <Col>
          <TopicsFundingValues />
        </Col>
        <Col>
          <TopicsFundingSuccessRates />
        </Col>
      </Row>
      <Row>
        <Col>
          <TopicsFundingProportion />
        </Col>
      </Row>
    </>
  );
}
