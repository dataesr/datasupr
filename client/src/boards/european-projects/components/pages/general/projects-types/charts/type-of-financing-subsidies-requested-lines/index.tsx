import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import optionsValues from "./options-values";
import optionsRates from "./options-rates";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import DefaultSkeleton from "../../../../../charts-skeletons/default";

export default function TypeOfFinancingSubsidiesRequestedLines() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["type-of-financing-subsidies-requested-lines", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton col={2} />;

  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <ChartWrapper
            id="typeOfFinancingSubsidiesRequested"
            options={optionsValues(data)}
            legend={null}
            renderData={() => null} // TODO: add data table
          />
        </Col>
        <Col>
          <ChartWrapper
            id="typeOfFinancingSubsidiesRequestedRates"
            options={optionsRates(data)}
            legend={null}
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
      <Row>
        <Col className="legend">
          <ul>
            <li>
              <div style={{ background: "#009099" }} />
              <span>Others actions</span>
            </li>
            <li>
              <div style={{ background: "#F28E2B" }} />
              <span>CSA Coordination and support actions</span>
            </li>
            <li>
              <div style={{ background: "#D5DBEF" }} />
              <span>EIC actions</span>
            </li>
            <li>
              <div style={{ background: "#76B7B2" }} />
              <span>ERC actions</span>
            </li>
            <li>
              <div style={{ background: "#B07AA1" }} />
              <span>IA Innovation actions</span>
            </li>
            <li>
              <div style={{ background: "#EDC948" }} />
              <span>MSCA Marie Skłodowska-Curie actions</span>
            </li>
            <li>
              <div style={{ background: "#BAB0AC" }} />
              <span>RIA Research and Innovation actions</span>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
