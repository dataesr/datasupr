import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import { useGetParams } from "./utils";
import { getData } from "./query";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useSearchParams } from "react-router-dom";

import "highcharts/highcharts-more";

import i18nGlobal from "../../../../i18n-global.json";
import i18nLocal from "./i18n.json";
import Callout from "../../../../../../components/callout";

export default function CountriesCollaborationsBubble() {
  const [searchParams] = useSearchParams();
  const params = useGetParams();
  const currentLang = searchParams.get("language") || "fr";
  const [nbToShow, setNbToShow] = useState(10); // Default number of countries to show

  const chartId = "CountriesCollaborationsBubble";
  const configChart = {
    id: chartId,
    queryId: "CountriesCollaborations",
    integrationURL: `/integration?chart_id=${chartId}&${params}`,
  };

  const { data, isLoading } = useQuery({
    queryKey: [configChart.id, params],
    queryFn: () => getData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const i18n = { ...i18nGlobal, ...i18nLocal };
  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <Container fluid className="fr-mt-5w">
      <Row>
        <Col md={8}>
          <Title as="h2" look="h4">
            {`Top ${nbToShow} ${getI18nLabel("countries-collaborated")}`}
          </Title>
        </Col>
        <Col className="text-right">
          <Button disabled={nbToShow >= data.length} onClick={() => setNbToShow((prev) => prev + 5)} size="sm" variant="secondary">
            {getI18nLabel("show_more_countries")}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Callout className="callout-style">
            Le graphique représente les pays ayant collaboré avec le pays sélectionné. La taille des bulles est proportionnelle au nombre de
            collaborations réussies entre les pays. Vous pouvez augmenter le nombre de pays affichés en cliquant sur le bouton "Afficher plus de
            pays".
          </Callout>
        </Col>
      </Row>
      <Row>
        <Col>
          <ChartWrapper
            config={configChart}
            options={options(data, currentLang, nbToShow)}
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
    </Container>
  );
}
