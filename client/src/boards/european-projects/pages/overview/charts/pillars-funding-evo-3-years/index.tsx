import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

import { GetData } from "./query";
import optionsSubsidiesValues from "./options-values";
import optionsSubsidiesRates from "./options-rates";
import optionsSubsidiesCountryRates from "./options-success-rates";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { RenderDataSubsidiesValuesAndRates } from "./render-data";
import { useState } from "react";

import i18n from "./i18n.json";

export default function PillarsFundingEvo3Years() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = getDefaultParams(searchParams);
  const [displayType, setDisplayType] = useState("total_fund_eur");

  const { data, isLoading } = useQuery({
    queryKey: [
      "PillarsFundingEvo3Years",
      params,
      Cookies.get("selectedPillars"),
    ],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data)
    return (
      <>
        <DefaultSkeleton col={2} />
        <DefaultSkeleton />
      </>
    );

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

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
      <Row className="fr-my-1w">
        <Col>
          <select
            className="fr-select"
            onChange={(e) => setDisplayType(e.target.value)}
          >
            <option value="total_fund_eur">
              {getI18nLabel("total-fund-eur")}
            </option>
            <option value="total_coordination_number">
              {getI18nLabel("total-coordination-number")}
            </option>
            <option value="total_number_involved">
              {getI18nLabel("total-number-involved")}
            </option>
          </select>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <ChartWrapper
            id="pillarsEvolutionFundingLines"
            options={optionsSubsidiesValues(data, displayType)}
            legend={null}
            renderData={RenderDataSubsidiesValuesAndRates}
          />
        </Col>
        <Col>
          <ChartWrapper
            id="pillarsEvolutionFundingLinesRates"
            options={optionsSubsidiesRates(data, displayType)}
            legend={null}
            renderData={RenderDataSubsidiesValuesAndRates}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Legend />
        </Col>
      </Row>
      <Row>
        <Col>
          <ChartWrapper
            id="pillarsEvolutionFundingLinesSuccessRate"
            options={optionsSubsidiesCountryRates(data, displayType)}
            legend={null}
            renderData={RenderDataSubsidiesValuesAndRates}
          />
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
