import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetData } from "./query";
import optionsSubventionsValuesEvaluated from "./options-subventions_values_evaluated";
import optionsSubventionsValuesEvaluatedRates from "./options-subventions_values_evaluated_rates";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col, Title } from "@dataesr/dsfr-plus";

export default function ProjectsTypesPiliers2() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["projectsTypesPiliers2", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <Template />;

  return (
    <Container fluid>
      <Row>
        <Col>
          <Title as="h3" look="h5">
            Projets évalués
          </Title>
        </Col>
      </Row>
      <Row>
        <Col>
          <ChartWrapper
            id="projectsTypesPiliers2"
            options={optionsSubventionsValuesEvaluated(data)}
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
                      background: "#A558A0",
                      marginRight: "10px",
                    }}
                  ></div>
                  <span>Europe plus innovante</span>
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
                      background: "#21AB8E",
                      marginRight: "10px",
                    }}
                  ></div>
                  <span>Excellence scientifique</span>
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
                      background: "#223F3A",
                      marginRight: "10px",
                    }}
                  ></div>
                  <span>
                    Problématiques mondiales et compétitivité industrielle
                    européenne
                  </span>
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
                      background: "#E4794A",
                      marginRight: "10px",
                    }}
                  ></div>
                  <span>
                    Élargir la participation et renforcer l'espace européen de
                    la recherche
                  </span>
                </li>
              </ul>
            }
          />
        </Col>
        <Col>
          <ChartWrapper
            id="projectsTypesPiliers2Rates"
            options={optionsSubventionsValuesEvaluatedRates(data)}
            legend={null}
          />
        </Col>
      </Row>
    </Container>
  );
}
