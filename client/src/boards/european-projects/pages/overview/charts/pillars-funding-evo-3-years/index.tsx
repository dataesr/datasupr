import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import optionsSubsidiesValues from "./options-subsidies-values";
import optionsSubsidiesRates from "./options-subsidies-rates";

import ChartWrapper from "../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { RenderDataSubsidiesValuesAndRates } from "./render-data";

export default function PillarsFundingEvo3Years() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["PillarsFundingEvo3Years", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton col={2} />;

  console.log("optionsSubsidiesValues", optionsSubsidiesValues(data));
  console.log("optionsSubsidiesRates", optionsSubsidiesRates(data));

  function Legend() {
    const rootStyles = getComputedStyle(document.documentElement);
    return (
      <div className="legend">
        <ul>
          {data
            .find((item) => item.country !== "all")
            .data[0].pillars.map((item) => (
              <li key={item.pilier_code}>
                <div
                  style={{
                    background: rootStyles.getPropertyValue(
                      `--pillar-${item.pilier_code}-color`
                    ),
                  }}
                />
                <span>{item[`pilier_name_${currentLang}`]}</span>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <ChartWrapper
            id="pillarsSubsidiesRequestedByProjectsLines"
            options={optionsSubsidiesValues(data)}
            legend={null}
            renderData={RenderDataSubsidiesValuesAndRates}
          />
        </Col>
        <Col>
          <ChartWrapper
            id="pillarsSubsidiesRequestedByProjectsLinesRates"
            options={optionsSubsidiesRates(data)}
            legend={null}
            renderData={RenderDataSubsidiesValuesAndRates}
          />
          empty
        </Col>
      </Row>
      <Row>
        <Col>
          <Legend />
        </Col>
      </Row>
    </Container>
  );
}
