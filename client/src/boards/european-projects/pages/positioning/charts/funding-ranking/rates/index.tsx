import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Col, Container, Radio, Row, Title } from "@dataesr/dsfr-plus";

import { getData } from "./query";
import { useGetParams } from "./utils";
import optionsSubRates from "./options-sub-rates";
import ChartWrapper from "../../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../../components/charts-skeletons/default";
import { useSearchParams } from "react-router-dom";

import { EPChartsSource, EPChartsUpdateDate } from "../../../../../config.js";

import i18nGlobal from "../../../../../i18n-global.json";
import i18nLocal from "./i18n.json";
import Callout from "../../../../../../../components/callout.js";

const configChartFundingRankingSubRates = {
  id: "fundingRankingSub",
  title: {
    fr: "Classement des pays selon la part des montants demandés et obtenus (M€)",
    en: "Ranking of countries by share of amounts requested and obtained (M€)",
  },
  comment: {
    fr: (
      <>
        Ce graphique représente le positionnement du pays sélectionné par rapport aux autres pays en fonction de la part des montants demandés et
        obtenus. Il montre le pourcentage de réussite de chaque pays en divisant le montant obtenu par le montant demandé.
      </>
    ),
    en: (
      <>
        This chart shows the positioning of the selected country compared to other countries based on the share of amounts requested and obtained. It
        shows the success percentage of each country by dividing the amount obtained by the amount requested.
      </>
    ),
  },
  readingKey: {
    //TODO: update readingKey
    fr: <span>Part des montants demandés et obtenus par pays</span>,
    en: <span>Share of amounts requested and obtained by country</span>,
  },
  source: EPChartsSource,
  updateDate: EPChartsUpdateDate,
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
};

export default function FundingRankingRates() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [sortBy, setSortBy] = useState("evaluated");
  const params = useGetParams();

  const { data, isLoading } = useQuery({
    queryKey: ["fundingRankingRates", params],
    queryFn: () => getData(params),
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
          <Callout>
            La part des montants demandés et obtenus est calculée en divisant le montant total obtenu par le montant total demandé pour chaque pays.
            Cet indicateur permet de mesurer l'efficacité des pays dans l'obtention de financements par rapport à leurs demandes. Plus la part est
            élevée, meilleure est la performance du pays en matière de financement.
          </Callout>
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
              name="FundingRankingRates-radio"
              onChange={(e) => {
                setSortBy((e.target as HTMLInputElement).value);
              }}
            />
            <Radio
              checked={sortBy === "successful"}
              className="fr-mb-1w"
              defaultValue="successful"
              label={getI18nLabel("sort-by-successful-project")}
              name="FundingRankingRates-radio"
              onChange={(e) => {
                setSortBy((e.target as HTMLInputElement).value);
              }}
            />
          </fieldset>
        </Col>
      </Row>
      <Row>
        <Col>
          <ChartWrapper
            config={configChartFundingRankingSubRates}
            legend={null}
            options={optionsSubRates(prepareData(data, "total_successful"), currentLang)}
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
    </Container>
  );
}
