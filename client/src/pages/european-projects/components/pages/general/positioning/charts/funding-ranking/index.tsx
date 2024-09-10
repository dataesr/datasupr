import { useQuery } from "@tanstack/react-query";
import { Col, Container, Row } from "@dataesr/dsfr-plus";

import { GetData } from "./query";
import { GetLegend } from "../../../../../legend";
import optionsSub from "./options";
import optionSubSuccessRate from "./options-succes-rate";
import optionsCoordinationNumber from "./options-coordination_number";
import optionCoordinationNumberSuccessRate from "./options-coordination_number-succes-rate";
import optionsNumberInvolved from "./options-number_involved";
import optionNumberInvolvedSuccessRate from "./options-number_involved-succes-rate";
import ChartWrapper from "../../../../../chart-wrapper";
import Template from "./template";

export default function FundingRanking({ indicateurId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["fundingRanking"],
    queryFn: () => GetData(),
  });

  if (isLoading || !data) return <Template />;

  let successGraphId,
    sortIndicateur = "";
  let optionsChart, optionChartSuccess;
  switch (indicateurId) {
    case "fundingRankingSub":
      successGraphId = "fundingRankingSubSuccessRate";
      sortIndicateur = "total_successful";
      optionsChart = optionsSub;
      optionChartSuccess = optionSubSuccessRate;
      break;

    case "fundingRankingCoordination":
      successGraphId = "fundingRankingCoordinationSuccessRate";
      sortIndicateur = "total_coordination_number_successful";
      optionsChart = optionsCoordinationNumber;
      optionChartSuccess = optionCoordinationNumberSuccessRate;
      break;

    case "fundingRankingInvolved":
      successGraphId = "fundingRankingInvolvedSuccessRate";
      sortIndicateur = "total_number_involved_successful";
      optionsChart = optionsNumberInvolved;
      optionChartSuccess = optionNumberInvolvedSuccessRate;
      break;
  }

  const prepareData = (data, sortKey) => {
    return data.sort((a, b) => b[sortKey] - a[sortKey]).slice(0, 10);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <ChartWrapper
            id={indicateurId}
            legend={GetLegend(
              [
                ["Projets évalués", "#009099"],
                ["Projets lauréats", "#233E41"],
              ],
              "FundingRanking"
            )}
            options={optionsChart(prepareData(data, sortIndicateur))}
          />
        </Col>
        <Col>
          <ChartWrapper
            id={successGraphId}
            legend={GetLegend(
              [
                ["Taux de réussite du pays", "#27A658"],
                ["Taux de réussite moyen", "#D75521"],
              ],
              "FundingRankingRates"
            )}
            options={optionChartSuccess(prepareData(data, sortIndicateur))}
          />
        </Col>
      </Row>
    </Container>
  );
}
