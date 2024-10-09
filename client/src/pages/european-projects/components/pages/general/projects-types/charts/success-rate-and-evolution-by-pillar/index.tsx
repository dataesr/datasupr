import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "@dataesr/dsfr-plus";

import { GetData } from "./query";
import optionsSubsidiesValues from "./options-subsidies-values";
import optionsCoordinationNumber from "./options-coordination_number-values";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";
import DefaultSkeleton from "../../../../../charts-skeletons/default";

export default function SuccessRateAndEvolutionByPillar({ indicateurId }) {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    // queryKey: ["successRateForAmountsByPillar", params],
    queryKey: [indicateurId, params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  let options;
  // , optionsRates;
  switch (indicateurId) {
    case "pillarsSubsidiesRequestedByRates":
      options = optionsSubsidiesValues(data);
      // optionsEvolution = optionsSubsidiesRates(data);
      break;

    case "pillarsProjectCoordinationRequestedByRates":
      options = optionsCoordinationNumber(data);
      // optionsRates = OptionsCoordinationNumberRates(data);
      break;

    // case "pillarsApplicantsAndParticipantsRequestedByProjectsLines":
    //   options = optionsSubsidiesValues(data);
    //   // optionsEvolution = optionsSubsidiesRates(data);
    //   break;

    default:
      break;
  }

  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <ChartWrapper
            id={indicateurId}
            options={options}
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
                      background: "#6DD897",
                      marginRight: "10px",
                    }}
                  />
                  <span>Pays sélectionné</span>
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
                      background: "#09622A",
                      marginRight: "10px",
                    }}
                  />
                  <span>UE & Etats associés</span>
                </li>
              </ul>
            }
          />
        </Col>
      </Row>
    </Container>
  );
}
