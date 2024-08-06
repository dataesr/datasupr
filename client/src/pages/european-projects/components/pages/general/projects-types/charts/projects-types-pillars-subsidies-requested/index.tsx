import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetData } from "./query";
import optionsValues from "./options-values";
import optionsRates from "./options-rates";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";

export default function ProjectsTypesPillarsSubsidiesRequested() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["projects-types-pillars-subsidies-requested", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <Template />;

  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <ChartWrapper
            id="projectsTypesPiliers3"
            options={optionsValues(data)}
            legend={null}
          />
        </Col>
        <Col>
          <ChartWrapper
            id="projectsTypesPiliers3Rates"
            options={optionsRates(data)}
            legend={null}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ul style={{ fontSize: "12px" }}>
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
                Élargir la participation et renforcer l'espace européen de la
                recherche
              </span>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
