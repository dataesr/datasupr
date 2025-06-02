import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Button, Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import { GetData } from "./query";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useSearchParams } from "react-router-dom";

import Highcharts from "highcharts";
import HC_more from "highcharts/highcharts-more";
HC_more(Highcharts);

import i18nGlobal from "../../../../i18n-global.json";
import i18nLocal from "./i18n.json";

export default function CountriesCollaborationsBubble() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const country_code = searchParams.get("country_code") || "FRA";
  const [nbToShow, setNbToShow] = useState(10); // Default number of countries to show

  // TODO : ajouter en dessous la liste complète en tableau avec les mêmes données
  // TODO : ajouter un bouton pour télécharger les données au format CSV
  // TODO : ajouter un bouton pour télécharger les données au format Excel
  const configChart = {
    id: "CountriesCollaborationsBubble",
    title: {
      fr: `Top ${nbToShow} des pays ayant collaborés avec le pays sélectionné`,
      en: "Countries that collaborated with the selected country",
    },
    subtitle: "",
    description: null,
    integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
  };

  const { data, isLoading } = useQuery({
    queryKey: [
      configChart.id,
      country_code,
      Cookies.get("selectedPillars"),
      Cookies.get("selectedPrograms"),
      Cookies.get("selectedThematics"),
      Cookies.get("selectedDestinations"),
    ],
    queryFn: () => GetData(country_code),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

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
        <Col className="text-right">
          <Button disabled={nbToShow >= data.length} onClick={() => setNbToShow((prev) => prev + 5)} size="sm" variant="secondary">
            {getI18nLabel("show_more_countries")} ({nbToShow + 5})
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <ChartWrapper
            config={configChart}
            legend={null}
            options={options(data, currentLang, nbToShow)}
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
    </Container>
  );
}
