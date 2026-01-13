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
import { normalizeIdForCssColorNames } from "../../../../utils";

const configChart1 = {
  id: "programsEvolutionFundingLines",
  title: {
    fr: "Programmes - Evolution des financements demandés et obtenus (M€)",
    en: "Programs - Financing applied for and obtained (€m)",
  },
  description: {
    fr: "",
    en: "",
  },
  subtitle: "",
  integrationURL:
    "/european-projects/components/pages/analysis/overview/charts/projects-types-3",
};
const configChart2 = {
  id: "programsEvolutionFundingLinesRates",
  title: {
    fr: "Programmes - Evolution du taux de succès des financements demandés et obtenus",
    en: "Programs - Trend in the success rate of financing applications and grants",
  },
  description: {
    fr: "",
    en: "",
  },
  subtitle: "",
  integrationURL:
    "/european-projects/components/pages/analysis/overview/charts/projects-types-3",
};
const configChart3 = {
  id: "programsEvolutionFundingLinesSuccessRate",
  title: {
    fr: "Programmes - Part des financements du pays demandés et obtenus par rapport au total des participants",
    en: "Programs - Percentage of country funding applied for and obtained as a proportion of total participants",
  },
  description: {
    fr: "",
    en: "",
  },
  subtitle: "",
  integrationURL:
    "/european-projects/components/pages/analysis/overview/charts/projects-types-3",
};

export default function ProgramsFundingEvo3Years() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = getDefaultParams(searchParams);
  const [displayType, setDisplayType] = useState("total_fund_eur");

  const { data, isLoading } = useQuery({
    queryKey: [
      "ProgramsFundingEvo3Years",
      params,
      Cookies.get("selectedPrograms"),
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
      <fieldset className="legend">
        <legend>Légende</legend>
        <ul>
          {data
            .find((item) => item.country !== "all")
            .data[0].programs.map((item) => (
              <li key={item.programme_code}>
                <div
                  style={{
                    background: rootStyles.getPropertyValue(`--program-${normalizeIdForCssColorNames(item.programme_code)}-color`),
                  }}
                />
                <span>{item[`programme_name_${currentLang}`]}</span>
              </li>
            ))}
        </ul>
      </fieldset>
    );
  }

  return (
    <Container fluid>
      <Row className="fr-my-1w">
        <Col>
          <select className="fr-select" onChange={(e) => setDisplayType(e.target.value)}>
            <option value="total_fund_eur">{getI18nLabel("total-fund-eur")}</option>
            <option value="total_coordination_number">{getI18nLabel("total-coordination-number")}</option>
            <option value="total_number_involved">{getI18nLabel("total-number-involved")}</option>
          </select>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <ChartWrapper config={configChart1} options={optionsSubsidiesValues(data, displayType)} renderData={RenderDataSubsidiesValuesAndRates} />
        </Col>
        <Col>
          <ChartWrapper config={configChart2} options={optionsSubsidiesRates(data, displayType)} renderData={RenderDataSubsidiesValuesAndRates} />
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
            config={configChart3}
            options={optionsSubsidiesCountryRates(data, displayType)}
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
