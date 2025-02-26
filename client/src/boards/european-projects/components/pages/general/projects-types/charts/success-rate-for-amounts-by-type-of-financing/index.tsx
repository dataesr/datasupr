import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "@dataesr/dsfr-plus";

import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";
import DefaultSkeleton from "../../../../../charts-skeletons/default";

export default function SuccessRateForAmountsByTypeOfFinancing() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["SuccessRateForAmountsByProjectsTypes", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <ChartWrapper
            id="successRateForAmountsByTypeOfFinancing"
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
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
    </Container>
  );
}
