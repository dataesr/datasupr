import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Col, Container, Radio, Row, Title } from "@dataesr/dsfr-plus";

import { getData } from "./query";
import { useGetParams } from "./utils";
import optionsSub from "./options";
import optionSubSuccessRate from "./options-succes-rate";
import ChartWrapper from "../../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../../components/charts-skeletons/default";
import { useSearchParams } from "react-router-dom";

import { EPChartsSource, EPChartsUpdateDate } from "../../../../../config.js";

import i18nGlobal from "../../../../../i18n-global.json";
import i18nLocal from "./i18n.json";
import ChartFooter from "../../../../../../../components/chart-footer/index.js";
import Callout from "../../../../../../../components/callout.js";

const configChart1a = {
  id: "fundingRankingSub",
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
};

const configChart1b = {
  id: "fundingRankingSubSuccessRate",
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
};

export default function FundingRankingSubsidies() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [sortBy, setSortBy] = useState("evaluated");
  const params = useGetParams();

  const { data, isLoading } = useQuery({
    queryKey: ["fundingRankingSubsidies", params],
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
            La comparaison des montants demandés et obtenus permet d'évaluer l'efficacité des pays dans l'obtention de financements pour leurs
            projets. Plus la différence entre les deux montants est faible, meilleure est la performance du pays en matière de financement.
            <br />
            Le deuxième graphique illustre le taux de succès du pays par rapport à la moyenne des taux de succès des autres pays, offrant ainsi une
            perspective comparative sur l'efficacité des demandes de financement.
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
              name="FundingRankingSubsidies-radio"
              onChange={(e) => {
                setSortBy((e.target as HTMLInputElement).value);
              }}
            />
            <Radio
              checked={sortBy === "successful"}
              className="fr-mb-1w"
              defaultValue="successful"
              label={getI18nLabel("sort-by-successful-project")}
              name="FundingRankingSubsidies-radio"
              onChange={(e) => {
                setSortBy((e.target as HTMLInputElement).value);
              }}
            />
          </fieldset>
        </Col>
      </Row>
      <Row className="chart-container chart-container--pillars">
        <Col>
          <Title as="h3" look="h5" style={{ minHeight: "4.5rem", lineHeight: "1.5rem" }} className="fr-mb-0">
            {getI18nLabel("configChart1a-title")}
          </Title>
          <ChartWrapper
            config={configChart1a}
            legend={null}
            options={optionsSub(prepareData(data, "total_successful"), currentLang)}
            renderData={() => null} // TODO: add data table
          />
        </Col>
        <Col>
          <Title as="h3" look="h5" style={{ minHeight: "4.5rem", lineHeight: "1.5rem" }} className="fr-mb-0">
            {getI18nLabel("configChart1b-title")}
          </Title>
          <ChartWrapper
            config={configChart1b}
            legend={null}
            options={optionSubSuccessRate(prepareData(data, "total_successful"), currentLang)}
            renderData={() => null} // TODO: add data table
          />
        </Col>
        <Col md={12} className="chart-footer">
          <ChartFooter
            comment={{
              fr: (
                <>
                  Ce graphique représente le positionnement du pays sélectionné par rapport aux autres pays en fonction des montants demandés et
                  obtenus. La barre bleue correspond aux montants demandés, la barre verte aux montants obtenus. La part est obtenue en divisant le
                  montant obtenu par le montant demandé.
                </>
              ),
              en: (
                <>
                  This chart shows the positioning of the selected country compared to other countries based on the amounts requested and obtained.
                  The blue bar corresponds to the amounts requested, the green bar to the amounts obtained. The share is obtained by dividing the
                  amount obtained by the amount requested.
                </>
              ),
            }}
            readingKey={{
              fr: (
                <>
                  Le pays "..." se place en 1ère position du classement en ce qui concerne les demandes de financements des projets évalués et se
                  classe 3ème en ce qui concerne les financements obtenus. Le taux de succès corespondant est de ...%. Ce graphique affiche aussi la
                  moyenne des taux de succès, elle est de ...%.
                </>
              ),
              en: (
                <>
                  The country "..." ranks 1st in the ranking for funding requests of evaluated projects and ranks 3rd for obtained funding. The
                  corresponding success rate is ...%. This chart also shows the average success rates, which is ...%.
                </>
              ),
            }}
            source={EPChartsSource}
            updateDate={EPChartsUpdateDate}
          />
        </Col>
      </Row>
    </Container>
  );
}
