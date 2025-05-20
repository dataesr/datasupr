import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import { GetData } from "./query";
import { GetLegend } from "../../../../components/legend";
import optionsSub from "./options";
import optionSubSuccessRate from "./options-succes-rate";
import optionsCoordinationNumber from "./options-coordination_number";
import optionCoordinationNumberSuccessRate from "./options-coordination_number-succes-rate";
import optionsNumberInvolved from "./options-number_involved";
import optionNumberInvolvedSuccessRate from "./options-number_involved-succes-rate";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useSearchParams } from "react-router-dom";

import i18n from "../../../../i18n-global.json";

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

export default function FundingRanking() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [selectedChart, setSelectedChart] = useState("fundingRankingSub");

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

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <Title as="h2" look="h4">
            Top 10 par indicateur
          </Title>
        </Col>
      </Row>
      <Row>
        <Col>
          <select className="fr-select fr-mb-3w" onChange={(e) => setSelectedChart(e.target.value)} value={selectedChart}>
            <option value="fundingRankingSub">Focus sur les subventions</option>
            <option value="fundingRankingCoordination">Focus sur les coordinations de projets</option>
            <option value="fundingRankingInvolved">Focus sur les candidats et participants</option>
          </select>
        </Col>
      </Row>
      {selectedChart === "fundingRankingSub" && (
        <Row>
          <Col>
            <ChartWrapper
              config={configChart1a}
              legend={GetLegend(
                [
                  [getI18nLabel("evaluated-projects"), "#009099"],
                  [getI18nLabel("successful-projects"), "#233E41"],
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
                  [getI18nLabel("country-success-rate"), "#27A658"],
                  [getI18nLabel("average-success-rate"), "#D75521"],
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
                  ["Projets évalués", "#009099"],
                  ["Projets lauréats", "#233E41"],
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
                  ["Taux de réussite du pays", "#27A658"],
                  ["Taux de réussite moyen", "#D75521"],
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
                  ["Projets évalués", "#009099"],
                  ["Projets lauréats", "#233E41"],
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
                  ["Taux de réussite du pays", "#27A658"],
                  ["Taux de réussite moyen", "#D75521"],
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
