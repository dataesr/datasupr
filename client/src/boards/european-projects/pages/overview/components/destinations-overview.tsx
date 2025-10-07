import { useQuery } from "@tanstack/react-query";

import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { formatToMillions } from "../../../../../utils/format";
import { getData } from "../charts/destination-funding/query";
import { getData as getDataProportion } from "../charts/destination-funding-proportion/query";
import { useGetParams } from "../charts/destination-funding/utils";
import EvaluatedCard from "../../../components/cards/funds-cards/evaluated";
import SuccessfulCard from "../../../components/cards/funds-cards/succesful";
import SuccessRateCard from "../../../components/cards/funds-cards/success-rate";

export default function DestinationsOverview() {
  const params = useGetParams();
  const { data, isLoading } = useQuery({
    queryKey: ["destinationsFunding", params],
    queryFn: () => getData(params),
  });

  const { data: dataProportion, isLoading: isLoadingProportion } = useQuery({
    queryKey: ["destinationsFundingProportion", params],
    queryFn: () => getDataProportion(params),
  });

  const evaluatedItem = data?.data.find((item) => item.stage === "evaluated") || {};
  const successfulItem = data?.data.find((item) => item.stage === "successful") || {};
  const fundsEvaluated = evaluatedItem.total_fund_eur || 0;
  const fundsSuccessful = successfulItem.total_fund_eur || 0;
  const successRate = fundsEvaluated > 0 ? fundsSuccessful / fundsEvaluated : 0;

  const partEvaluated = dataProportion?.data.find((item) => item.stage === "evaluated")?.proportion || 0;
  const partSuccessful = dataProportion?.data.find((item) => item.stage === "successful")?.proportion || 0;

  return (
    <Container fluid>
      <Row gutters>
        <Col>
          <EvaluatedCard
            fund={formatToMillions(fundsEvaluated)}
            loading={isLoading}
            loadingPart={isLoadingProportion}
            nb={evaluatedItem.count || 0}
            part={partEvaluated}
          />
        </Col>
        <Col>
          <SuccessfulCard
            fund={formatToMillions(fundsSuccessful)}
            loading={isLoading}
            loadingPart={isLoadingProportion}
            nb={successfulItem.count || 0}
            part={partSuccessful}
          />
        </Col>
        <Col>
          <SuccessRateCard loading={isLoading} nb={successRate} />
        </Col>
      </Row>
      <p>Vue d'ensemble des piliers</p>
    </Container>
  );
}
