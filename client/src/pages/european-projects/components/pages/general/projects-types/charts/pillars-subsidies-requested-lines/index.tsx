import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetData } from "./query";
import optionsSubsidiesValues from "./options-subsidies-values";
import optionsSubsidiesRates from "./options-subsidies-rates";
import optionsCoordinationNumber from "./options-coordination_number-values";
import OptionsCoordinationNumberRates from "./options-coordination_number-rates";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";

export default function ProjectsTypesPillarsSubsidiesRequested({
  indicateurId,
}) {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: [indicateurId, params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <Template />;

  let options, optionsRates;
  switch (indicateurId) {
    case "pillarsSubsidiesRequestedByProjectsLines":
      options = optionsSubsidiesValues(data);
      optionsRates = optionsSubsidiesRates(data);
      break;

    case "pillarsProjectCoordinationRequestedByProjectsLines":
      options = optionsCoordinationNumber(data);
      optionsRates = OptionsCoordinationNumberRates(data);
      break;

    // case "pillarsApplicantsAndParticipantsRequestedByProjectsLines":
    //   options = optionsSubsidiesValues(data);
    //   // optionsRates = optionsSubsidiesRates(data);
    //   break;

    default:
      break;
  }

  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <ChartWrapper id={indicateurId} options={options} legend={null} />
        </Col>
        <Col>
          <ChartWrapper
            id={`${indicateurId}Rates`}
            options={optionsRates}
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
