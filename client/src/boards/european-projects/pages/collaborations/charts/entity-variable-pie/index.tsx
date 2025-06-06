import { useQuery } from "@tanstack/react-query";
import { Col, Container, Row } from "@dataesr/dsfr-plus";

import { getCollaborations } from "./query";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
// import { useSearchParams } from "react-router-dom";

// import i18nGlobal from "../../../../i18n-global.json";
// import i18nLocal from "./i18n.json";

export default function EntityVariablePie() {
  // const [searchParams] = useSearchParams();
  // const currentLang = searchParams.get("language") || "fr";
  // const country_code = searchParams.get("country_code") || "FRA";

  const configChart = {
    id: "CountriesCollaborationsBubble",
    queryId: "CountriesCollaborations",
    title: {
      fr: `Top des pays ayant collaborés avec le pays sélectionné`,
      en: "Countries that collaborated with the selected country",
    },
    subtitle: "",
    description: null,
    integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
  };

  const { data, isLoading } = useQuery({
    queryKey: [configChart.id],
    queryFn: () => getCollaborations(),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  // const i18n = { ...i18nGlobal, ...i18nLocal };
  // function getI18nLabel(key) {
  //   return i18n[key][currentLang];
  // }

  return (
    <Container fluid className="fr-mt-5w">
      {/* <Row>
        <Col>
          <Title as="h2" look="h4">
            {getI18nLabel("title")}
          </Title>
        </Col>
        <Col className="text-right">
          <Button disabled={nbToShow >= data.length} onClick={() => setNbToShow((prev) => prev + 5)} size="sm" variant="secondary">
            {getI18nLabel("show_more_countries")}
          </Button>
        </Col>
      </Row> */}
      <Row>
        <Col>
          <ChartWrapper
            config={configChart}
            legend={null}
            options={options(data)}
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
    </Container>
  );
}
