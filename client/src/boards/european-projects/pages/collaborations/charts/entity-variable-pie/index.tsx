import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "@dataesr/dsfr-plus";

import { getCollaborations } from "./query";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
// import { useSearchParams } from "react-router-dom";

// import i18nGlobal from "../../../../i18n-global.json";
// import i18nLocal from "./i18n.json";

export default function EntityVariablePie() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  // const country_code = searchParams.get("country_code") || "FRA";

  const entityId = window.location.pathname.split("/").pop()?.split("?")[0] || "";

  const { data, isLoading } = useQuery({
    queryKey: ["EntitiesCollaborations", entityId],
    queryFn: () => getCollaborations(entityId),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  // const i18n = { ...i18nGlobal, ...i18nLocal };
  // function getI18nLabel(key) {
  //   return i18n[key][currentLang];
  // }

  const configChart = {
    id: "EntitiesCollaborations",
    title: {
      fr: `Top 20 des entités ayant collaboré avec ${data.name_fr}`,
      en: `Top 20 entities collaborating with ${data.name_en}`,
    },
    subtitle: "",
    description: null,
    integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
  };

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
            options={options(data, currentLang)}
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
    </Container>
  );
}
