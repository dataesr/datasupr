import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import optionsSubventionsValues from "./options-subventions_values";
import optionsSubventionsRates from "./options-subventions_rates";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import DefaultSkeleton from "../../../../../charts-skeletons/default";

export default function TypeOfFinancingSubsidiesRequestedByProjects() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["TypeOfFinancingSubsidiesRequestedByProjects", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton col={2} />;

  return (
    <Container fluid>
      <Row>
        <Col>
          <ChartWrapper
            id="typeOfFinancingSubsidiesRequestedByProjects"
            options={optionsSubventionsValues(data)}
            legend={
              <ul className="legend">
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "#233E41",
                      marginRight: "10px",
                    }}
                  ></div>
                  <span>Projets lauréats</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "#009099",
                      marginRight: "10px",
                    }}
                  ></div>
                  <span>Projets évalués</span>
                </li>
              </ul>
            }
            renderData={() => null} // TODO: add data table
          />
        </Col>
        <Col>
          <ChartWrapper
            id="typeOfFinancingSubsidiesRequestedByProjectsRates"
            options={optionsSubventionsRates(data)}
            legend={null}
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
    </Container>
  );
}
