import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

import { GetData } from "./query";
import optionsSubsidiesValues from "./options-values";
import optionsSubsidiesCountryRates from "./options-success-rates";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { RenderDataSubsidiesValuesAndRates } from "./render-data";
import { useState } from "react";

import i18nLocal from "./i18n.json";
import i18nGlobal from "../../../../i18n-global.json";
import { EPChartsSource, EPChartsUpdateDate } from "../../../../config.js";

const configChart1 = {
  id: "pillarsEvolutionFundingLines",
  title: {
    fr: "Pilliers - Evolution des financements demandés et obtenus (M€)",
    en: "Pilars - Financing applied for and obtained (€m)",
  },
  comment: {
    fr: React.createElement(React.Fragment, null, "Les montants sont exprimés en M€ (millions d'euros)."),
    en: React.createElement(React.Fragment, null, "Amounts are expressed in €m (millions of euros)."),
  },
  readingKey: {
    fr: React.createElement(React.Fragment, null, "Les barres représentent les montants demandés et les lignes les montants obtenus."),
    en: React.createElement(React.Fragment, null, "The bars represent the amounts applied for and the lines the amounts obtained."),
  },
  source: EPChartsSource,
  updateDate: EPChartsUpdateDate,
  integrationURL: "/european-projects/components/pages/analysis/overview/charts/projects-types-3",
};

const configChart3 = {
  id: "pillarsEvolutionFundingLinesSuccessRate",
  title: {
    fr: "Pilliers - Part des financements du pays demandés et obtenus par rapport au total des participants",
    en: "Pilars - Percentage of country funding applied for and obtained as a proportion of total participants",
  },
  description: {
    fr: "",
    en: "",
  },
  subtitle: "",
  integrationURL: "/european-projects/components/pages/analysis/overview/charts/projects-types-3",
};

export default function PillarsFundingEvo3Years() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = getDefaultParams(searchParams);
  const [displayType, setDisplayType] = useState("total_fund_eur");

  const { data, isLoading } = useQuery({
    queryKey: ["PillarsFundingEvo3Years", params, Cookies.get("selectedPillars")],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data)
    return (
      <>
        <DefaultSkeleton />
        <DefaultSkeleton />
      </>
    );

  const i18n = {
    ...i18nLocal,
    ...i18nGlobal,
  };
  function getI18nLabel(key) {
    return i18n[key][currentLang];
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
        <Col md={12}>
          <ChartWrapper
            config={configChart1}
            legend={null}
            options={optionsSubsidiesValues(data, displayType)}
            renderData={RenderDataSubsidiesValuesAndRates}
          />
        </Col>
      </Row>
      <Row className="fr-my-1w">
        <Col>
          <ChartWrapper
            config={configChart3}
            legend={null}
            options={optionsSubsidiesCountryRates(data, displayType)}
            renderData={RenderDataSubsidiesValuesAndRates}
          />
        </Col>
      </Row>
    </Container>
  );
}
