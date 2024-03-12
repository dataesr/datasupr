import { useQuery } from "@tanstack/react-query";

import Template from "./template";
import { GetData } from "./query";
import optionsSub from "./options";
import optionSubSuccessRate from "./options-succes-rate";
import optionsCoordinationNumber from "./options-coordination_number";
import optionCoordinationNumberSuccessRate from "./options-coordination_number-succes-rate";
import optionsNumberInvolved from "./options-number_involved";
import optionNumberInvolvedSuccessRate from "./options-number_involved-succes-rate";
import ChartWrapper from "../../../../../chart-wrapper";
import { Col, Container, Row } from "@dataesr/dsfr-plus";

export default function FundingRanking({ indicateurId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["fundingRanking"],
    queryFn: () => GetData()
  })

  if (isLoading || !data) return <Template />

  let successGraphId, sortIndicateur = "";
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
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <ChartWrapper
            id={indicateurId}
            options={optionsChart(prepareData(data, sortIndicateur))}
            legend={(
              <ul className="legend">
                <li style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                  <div style={{ width: "20px", height: "20px", background: "#009099", marginRight: "10px" }} />
                  <span>Projets évalués</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                  <div style={{ width: "20px", height: "20px", background: "#233E41", marginRight: "10px" }} />
                  <span>Projets lauréats</span>
                </li>
              </ul>
            )}
          />
        </Col>
        <Col>
          <ChartWrapper
            id={successGraphId}
            options={optionChartSuccess(prepareData(data, sortIndicateur))}
            legend={(
              <ul className="legend">
                <li style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                  <div style={{ width: "20px", height: "20px", background: "#27A658", marginRight: "10px" }} />
                  <span>Taux de réussite du pays</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                  <div style={{ width: "20px", height: "20px", background: "#D75521", marginRight: "10px" }} />
                  <span>Taux de réussite moyen</span>
                </li>

              </ul>
            )}
          />
        </Col>
      </Row>
    </Container>
  )

}