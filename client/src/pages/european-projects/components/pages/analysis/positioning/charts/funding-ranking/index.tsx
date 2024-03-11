import { useQuery } from "@tanstack/react-query";

import Template from "./template";
import { GetData } from "./query";
import options from "./options";
import optionSuccessRate from "./options-succes-rate";
import ChartWrapper from "../../../../../chart-wrapper";
import { Col, Container, Row } from "@dataesr/dsfr-plus";

export default function FundingRanking({ indicateur }) {
  const { data, isLoading } = useQuery({
    queryKey: ["fundingRanking"],
    queryFn: () => GetData()
  })

  if (isLoading || !data) return <Template />

  const prepareData = (data, sortKey) => {
    return data.sort((a, b) => b[sortKey] - a[sortKey]).slice(0, 10);
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <ChartWrapper
            id="fundingRankingSub"
            options={options(prepareData(data, indicateur))}
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
            id="fundingRankingSubSuccessRate"
            options={optionSuccessRate(prepareData(data, indicateur))}
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