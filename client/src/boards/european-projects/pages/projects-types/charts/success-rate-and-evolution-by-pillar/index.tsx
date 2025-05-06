import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "@dataesr/dsfr-plus";

import { GetData } from "./query";
import optionsSubsidiesValues from "./options-subsidies-values";
import optionsCoordinationNumber from "./options-coordination_number-values";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

const configChart1 = {
  id: "pillarsSubsidiesRequestedByRates",
  title: "",
  subtitle: "Taux de succès sur le montants par pilier",
  description: "Attention EIT",
  integrationURL:
    "/european-projects/components/pages/analysis/overview/charts/projects-types-2",
};

const configChart2 = {
  id: "pillarsProjectCoordinationRequestedByRates",
  title: "",
  subtitle:
    "Taux de succès sur le nombre de coordinations de projets par pilier",
  description: "Attention EIT",
  integrationURL:
    "/european-projects/components/pages/analysis/overview/charts/projects-types-2",
};

export default function SuccessRateAndEvolutionByPillar({ indicateurId }) {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    // queryKey: ["successRateForAmountsByPillar", params],
    queryKey: [indicateurId, params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return (
    <Container fluid>
      {indicateurId === "pillarsSubsidiesRequestedByRates" && (
        <Row>
          <Col md={6}>
            <ChartWrapper
              config={configChart1}
              options={optionsSubsidiesValues(data)}
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
              renderData={() => null} // TODO: add data table
            />
          </Col>
        </Row>
      )}
      {indicateurId === "pillarsProjectCoordinationRequestedByRates" && (
        <Row>
          <Col md={6}>
            <ChartWrapper
              config={configChart2}
              options={optionsCoordinationNumber(data)}
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
              renderData={() => null} // TODO: add data table
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}
