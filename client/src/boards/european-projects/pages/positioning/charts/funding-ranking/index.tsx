import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import { GetData } from "./query";
import { GetLegend } from "../../../../components/legend";
import optionsSub from "./options";
import optionSubSuccessRate from "./options-succes-rate";
import optionsCoordinationNumber from "./options-coordination_number";
import optionCoordinationNumberSuccessRate from "./options-coordination_number-succes-rate";
import optionsNumberInvolved from "./options-number_involved";
import optionNumberInvolvedSuccessRate from "./options-number_involved-succes-rate";
import ChartWrapper from "../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { useSearchParams } from "react-router-dom";

export default function FundingRanking() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [selectedChart, setSelectedChart] = useState("fundingRankingSub");
  const { data, isLoading } = useQuery({
    queryKey: ["fundingRanking"],
    queryFn: () => GetData(),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  let successGraphId,
    sortIndicateur = "";
  let optionsChart, optionChartSuccess;
  switch (selectedChart) {
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
          <Title as="h2" look="h4">
            Top 10 par indicateur
          </Title>
        </Col>
      </Row>
      <Row>
        <Col>
          <select
            className="fr-select fr-mb-3w"
            onChange={(e) => setSelectedChart(e.target.value)}
            value={selectedChart}
          >
            <option value="fundingRankingSub">Focus sur les subventions</option>
            <option value="fundingRankingCoordination">
              Focus sur les coordinations de projets
            </option>
            <option value="fundingRankingInvolved">
              Focus sur les candidats et participants
            </option>
          </select>
        </Col>
      </Row>
      <Row>
        <Col>
          <ChartWrapper
            id={selectedChart}
            legend={GetLegend(
              [
                ["Projets évalués", "#009099"],
                ["Projets lauréats", "#233E41"],
              ],
              "FundingRanking",
              currentLang
            )}
            options={optionsChart(prepareData(data, sortIndicateur))}
            renderData={() => null} // TODO: add data table
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
              "FundingRankingRates",
              currentLang
            )}
            options={optionChartSuccess(prepareData(data, sortIndicateur))}
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
    </Container>
  );
}
