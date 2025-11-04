import { useQuery } from "@tanstack/react-query";

import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { formatToMillions } from "../../../../../utils/format";
import { getData } from "../charts/pillars-funding/query";
// import { getData as getDataProportion } from "../charts/pillars-funding-proportion/query";
import { useGetParams } from "../charts/pillars-funding/utils";
import EvaluatedCard from "../../../components/cards/funds-cards/evaluated";
import SuccessfulCard from "../../../components/cards/funds-cards/succesful";
import SuccessRateCard from "../../../components/cards/funds-cards/success-rate";

import "../charts/synthesis-focus/styles.scss";

export default function PillarsOverview() {
  const params = useGetParams();
  const { data, isLoading } = useQuery({
    queryKey: ["pillarsFunding", params],
    queryFn: () => getData(params),
  });

  // const { data: dataProportion, isLoading: isLoadingProportion } = useQuery({
  //   queryKey: ["pillarsFundingProportion", params],
  //   queryFn: () => getDataProportion(params),
  // });

  const evaluatedItem = data?.data.find((item) => item.stage === "evaluated") || {};
  const successfulItem = data?.data.find((item) => item.stage === "successful") || {};
  const fundsEvaluated = evaluatedItem.total_fund_eur || 0;
  const fundsSuccessful = successfulItem.total_fund_eur || 0;
  const successRate = fundsEvaluated > 0 ? fundsSuccessful / fundsEvaluated : 0;

  if (isLoading) {
    return (
      <Container as="section" fluid className="synthesis-focus-template">
        <Row gutters>
          <Col md={12}>
            <div className="fake-tile" />
          </Col>
          <Col md={12}>
            <div className="fake-tile" />
          </Col>
          <Col md={12}>
            <div className="fake-tile" />
          </Col>
          <Col md={12}>
            <div className="fake-tile" />
          </Col>
          <Col md={12}>
            <div className="fake-tile" />
          </Col>
          <Col md={12}>
            <div className="fake-tile" />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row gutters>
        <Col lg={12} md={12} xs={12}>
          <EvaluatedCard fund={formatToMillions(fundsEvaluated)} loading={isLoading} nb={evaluatedItem.count || 0} />
        </Col>
        <Col lg={12} md={12} xs={12}>
          <SuccessfulCard fund={formatToMillions(fundsSuccessful)} loading={isLoading} nb={successfulItem.count || 0} />
        </Col>
        <Col lg={12} md={12} xs={12}>
          <SuccessRateCard loading={isLoading} nb={successRate} />
        </Col>
      </Row>
    </Container>
  );
}
