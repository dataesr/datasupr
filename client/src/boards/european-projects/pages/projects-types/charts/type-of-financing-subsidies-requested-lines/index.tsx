import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import optionsValues from "./options-values";
import optionsRates from "./options-rates";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

const configChart1 = {
  id: "typeOfFinancingSubsidiesRequested",
  title: "",
  subtitle: "Subventions demandées et obtenues (M€)",
  description: null,
  integrationURL:
    "/european-projects/components/pages/analysis/overview/charts/projects-types-1",
};
const configChart2 = {
  id: "typeOfFinancingSubsidiesRequestedRates",
  title: "",
  subtitle: "Part des subventions demandées et obtenues sur HE",
  description: null,
  integrationURL:
    "/european-projects/components/pages/analysis/overview/charts/projects-types-1",
};

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
            config={configChart1}
            legend={null}
            options={optionsValues(data)}
            renderData={() => null} // TODO: add data table
          />
        </Col>
        <Col>
          <ChartWrapper
            config={configChart2}
            legend={null}
            options={optionsRates(data)}
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
