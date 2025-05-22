import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Col, Container, Radio, Row, Title } from "@dataesr/dsfr-plus";

import { GetData } from "./query";
import { GetLegend } from "../../../../components/legend";
import optionsSub from "./options";
import optionsSubRates from "./options-sub-rates";
import optionSubSuccessRate from "./options-succes-rate";
import optionsCoordinationNumber from "./options-coordination_number";
import optionCoordinationNumberSuccessRate from "./options-coordination_number-succes-rate";
import optionsNumberInvolved from "./options-number_involved";
import optionNumberInvolvedSuccessRate from "./options-number_involved-succes-rate";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useSearchParams } from "react-router-dom";

import i18nGlobal from "../../../../i18n-global.json";
import i18nLocal from "./i18n.json";

const configChart1a = {
  id: "fundingRankingSub",
  title: {
    fr: "Subventions demandées et obtenues (M€) par pays",
    en: "Funding requested and obtained (M€) by country",
  },
  subtitle: "",
  description: null,
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
};
const configChart1b = {
  id: "fundingRankingSubSuccessRate",
  title: {
    fr: "Taux de succès sur les montants par pays",
    en: "Success rate on amounts by country<br />&nbsp;",
  },
  subtitle: "",
  description: null,
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
};

const configChart2a = {
  id: "fundingRankingCoordination",
  title: {
    fr: "Nombre de coordinations de projets déposés et lauréats",
    en: "Number of project coordinations submitted and winners",
  },
  subtitle: "",
  description: null,
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
};
const configChart2b = {
  id: "fundingRankingCoordinationSuccessRate",
  title: {
    fr: "Taux de succès sur le nombre de coordinations de projets lauréats",
    en: "Success rate on the number of winning project coordinations",
  },
  subtitle: "",
  description: null,
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
};

const configChart3a = {
  id: "fundingRankingInvolved",
  title: {
    fr: "Nombre de candidats et de participants",
    en: "Number of candidates and participants",
  },
  subtitle: "",
  description: null,
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
};
const configChart3b = {
  id: "fundingRankingInvolvedSuccessRate",
  title: {
    fr: "Taux de succès sur le nombre de candidats et de participants",
    en: "Success rate on the number of candidates and participants",
  },
  subtitle: "",
  description: null,
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
};

const rootStyles = getComputedStyle(document.documentElement);

export default function FundingRanking() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [selectedChart, setSelectedChart] = useState("fundingRankingSub");
  const [sortBy, setSortBy] = useState("evaluated");

  const { data, isLoading } = useQuery({
    queryKey: [
      "fundingRanking",
      Cookies.get("selectedPillars"),
      Cookies.get("selectedPrograms"),
      Cookies.get("selectedThematics"),
      Cookies.get("selectedDestinations"),
    ],
    queryFn: () => GetData(),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const prepareData = (data, sortKey) => {
    data.sort((a, b) => b[sortKey] - a[sortKey]);
    if (sortBy === "evaluated") {
      data.sort((a, b) => b.total_evaluated - a.total_evaluated);
    } else {
      data.sort((a, b) => b.total_successful - a.total_successful);
    }
    // Add selected country if it is not in the top 10
    const dataToReturn = data.slice(0, 10);
    const selectedCountry = searchParams.get("country_code");
    if (selectedCountry) {
      const pos = data.findIndex((item) => item.id === selectedCountry);
      if (pos >= 10 && pos !== -1) {
        dataToReturn.pop();
        const countryData = data[pos];
        dataToReturn.push(countryData);
      }
    }
    return dataToReturn;
  };

  const i18n = { ...i18nGlobal, ...i18nLocal };
  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <Container fluid className="fr-mt-5w">
      <Row>
        <Col>
          <Title as="h2" look="h4">
            {getI18nLabel("title")}
          </Title>
        </Col>
        <Col>
          <select className="fr-select fr-mb-2w" onChange={(e) => setSelectedChart(e.target.value)} value={selectedChart}>
            <option value="fundingRankingSub">{getI18nLabel("focus-on-subsidies")}</option>
            <option value="fundingRankingCoordination">{getI18nLabel("focus-on-coordination")}</option>
            <option value="fundingRankingInvolved">{getI18nLabel("focus-on-participations")}</option>
            <option value="fundingRankingSubRates">{getI18nLabel("focus-on-rates")}</option>
          </select>
        </Col>
      </Row>
      <Row>
        <Col>
          <fieldset className="fr-mb-2w">
            <legend>{getI18nLabel("sort-by")}</legend>
            <Radio
              checked={sortBy === "evaluated"}
              className="fr-mb-1w"
              defaultValue="evaluated"
              label={getI18nLabel("sort-by-evaluated-project")}
              name="checker"
              onChange={(e) => {
                setSortBy((e.target as HTMLInputElement).value);
              }}
            />
            <Radio
              checked={sortBy === "successful"}
              className="fr-mb-1w"
              defaultValue="successful"
              label={getI18nLabel("sort-by-successful-project")}
              name="checker"
              onChange={(e) => {
                setSortBy((e.target as HTMLInputElement).value);
              }}
            />
          </fieldset>
        </Col>
      </Row>
      {selectedChart === "fundingRankingSubRates" && (
        <Row>
          <Col>
            <ChartWrapper
              config={configChart1a}
              legend={GetLegend(
                [
                  [getI18nLabel("evaluated-projects"), rootStyles.getPropertyValue("--evaluated-project-color")],
                  [getI18nLabel("successful-projects"), rootStyles.getPropertyValue("--successful-project-color")],
                ],
                "FundingRanking",
                currentLang
              )}
              options={optionsSubRates(prepareData(data, "total_successful"), currentLang)}
              renderData={() => null} // TODO: add data table
            />
          </Col>
        </Row>
      )}
      {selectedChart === "fundingRankingSub" && (
        <Row>
          <Col>
            <ChartWrapper
              config={configChart1a}
              legend={GetLegend(
                [
                  [getI18nLabel("evaluated-projects"), rootStyles.getPropertyValue("--evaluated-project-color")],
                  [getI18nLabel("successful-projects"), rootStyles.getPropertyValue("--successful-project-color")],
                ],
                "FundingRanking",
                currentLang
              )}
              options={optionsSub(prepareData(data, "total_successful"), currentLang)}
              renderData={() => null} // TODO: add data table
            />
          </Col>
          <Col>
            <ChartWrapper
              config={configChart1b}
              legend={GetLegend(
                [
                  [getI18nLabel("country-success-rate"), rootStyles.getPropertyValue("--successRate-color")],
                  [getI18nLabel("average-success-rate"), rootStyles.getPropertyValue("--averageSuccessRate-color")],
                ],
                "FundingRankingRates",
                currentLang
              )}
              options={optionSubSuccessRate(prepareData(data, "total_successful"))}
              renderData={() => null} // TODO: add data table
            />
          </Col>
        </Row>
      )}
      {selectedChart === "fundingRankingCoordination" && (
        <Row>
          <Col>
            <ChartWrapper
              config={configChart2a}
              legend={GetLegend(
                [
                  [getI18nLabel("evaluated-projects"), rootStyles.getPropertyValue("--evaluated-project-color")],
                  [getI18nLabel("successful-projects"), rootStyles.getPropertyValue("--successful-project-color")],
                ],
                "FundingRanking",
                currentLang
              )}
              options={optionsCoordinationNumber(prepareData(data, "total_coordination_number_successful"), currentLang)}
              renderData={() => null} // TODO: add data table
            />
          </Col>
          <Col>
            <ChartWrapper
              config={configChart2b}
              legend={GetLegend(
                [
                  [getI18nLabel("country-success-rate"), rootStyles.getPropertyValue("--successRate-color")],
                  [getI18nLabel("average-success-rate"), rootStyles.getPropertyValue("--averageSuccessRate-color")],
                ],
                "FundingRankingRates",
                currentLang
              )}
              options={optionCoordinationNumberSuccessRate(prepareData(data, "total_coordination_number_successful"))}
              renderData={() => null} // TODO: add data table
            />
          </Col>
        </Row>
      )}
      {selectedChart === "fundingRankingInvolved" && (
        <Row>
          <Col>
            <ChartWrapper
              config={configChart3a}
              legend={GetLegend(
                [
                  [getI18nLabel("evaluated-projects"), rootStyles.getPropertyValue("--evaluated-project-color")],
                  [getI18nLabel("successful-projects"), rootStyles.getPropertyValue("--successful-project-color")],
                ],
                "FundingRanking",
                currentLang
              )}
              options={optionsNumberInvolved(prepareData(data, "total_number_involved_successful"), currentLang)}
              renderData={() => null} // TODO: add data table
            />
          </Col>
          <Col>
            <ChartWrapper
              config={configChart3b}
              legend={GetLegend(
                [
                  [getI18nLabel("country-success-rate"), rootStyles.getPropertyValue("--successRate-color")],
                  [getI18nLabel("average-success-rate"), rootStyles.getPropertyValue("--averageSuccessRate-color")],
                ],
                "FundingRankingRates",
                currentLang
              )}
              options={optionNumberInvolvedSuccessRate(prepareData(data, "total_number_involved_successful"))}
              renderData={() => null} // TODO: add data table
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}
