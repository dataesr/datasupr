import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";
import { Col, Container, Row } from "@dataesr/dsfr-plus";

export default function SuccessRateForAmountsByPillar() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["successRateForAmountsByPillar", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <Template />;
  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <ChartWrapper
            id="successRateForAmountsByPillar"
            options={options(data)}
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
