import { useQuery } from "@tanstack/react-query";

import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { formatToMillions } from "../../../../../utils/format";
import { getData } from "../charts/topics-funding/query";
import { useGetParams } from "../charts/topics-funding/utils";
import EvaluatedCard from "../../../components/cards/funds-cards/evaluated";
import SuccessfulCard from "../../../components/cards/funds-cards/succesful";
import SuccessRateCard from "../../../components/cards/funds-cards/success-rate";

export default function ThematicsOverview() {
  const params = useGetParams();
  const { data, isLoading } = useQuery({
    queryKey: ["thematicsFunding", params],
    queryFn: () => getData(params.params),
  });

  const evaluatedItem = data?.data.find((item) => item.stage === "evaluated") || {};
  const successfulItem = data?.data.find((item) => item.stage === "successful") || {};
  const fundsEvaluated = evaluatedItem.total_fund_eur || 0;
  const fundsSuccessful = successfulItem.total_fund_eur || 0;
  const successRate = fundsEvaluated > 0 ? fundsSuccessful / fundsEvaluated : 0;

  return (
    <Container fluid>
      <Row gutters>
        <Col>
          <EvaluatedCard
            fund={formatToMillions(fundsEvaluated)}
            loading={isLoading}
            // loadingPart={isLoadingProportion}
            nb={evaluatedItem.count || 0}
            // part={partEvaluated}
          />
        </Col>
        <Col>
          <SuccessfulCard
            fund={formatToMillions(fundsSuccessful)}
            loading={isLoading}
            // loadingPart={isLoadingProportion}
            nb={successfulItem.count || 0}
            // part={partSuccessful}
          />
        </Col>
        <Col>
          <SuccessRateCard loading={isLoading} nb={successRate} />
        </Col>
      </Row>
    </Container>
  );
}
