import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "@dataesr/dsfr-plus";

import { getCollaborations } from "./query";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import EntitySearchBar from "../../../../components/entity-searchbar";
import { useState } from "react";
import EntitiesTable from "../entities-table";

export default function EntityVariablePie() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [entityId, setEntityId] = useState<string>("");

  // const entityId = window.location.pathname.split("/").pop()?.split("?")[0] || "";

  const { data, isLoading } = useQuery({
    queryKey: ["EntitiesCollaborations", entityId],
    queryFn: () => getCollaborations(entityId),
  });

  if (isLoading || !data)
    return (
      <Container fluid className="fr-mt-5w">
        <Row>
          <Col>
            <EntitySearchBar setEntityId={setEntityId} />
          </Col>
        </Row>
        <Row>
          <Col>
            <DefaultSkeleton />
          </Col>
        </Row>
      </Container>
    );

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

  if (!entityId)
    return (
      <Container fluid className="fr-mt-5w">
        <Row>
          <Col style={{ height: "400px" }}>
            <EntitySearchBar setEntityId={setEntityId} />
          </Col>
        </Row>
      </Container>
    );

  return (
    <Container fluid className="fr-mt-5w">
      <Row>
        <Col>
          <EntitySearchBar setEntityId={setEntityId} />
        </Col>
      </Row>
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
      <Row>
        <Col>
          <EntitiesTable entityId={entityId} />
        </Col>
      </Row>
    </Container>
  );
}
