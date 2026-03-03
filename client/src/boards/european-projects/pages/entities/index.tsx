import { Container, Row, Col, Title, Text } from "@dataesr/dsfr-plus";
import Callout from "../../../../components/callout";
import { getI18nLabel } from "../../../../utils";

import i18n from "./i18n.json";
import EntitySearchBar from "../../components/entity-searchbar";
import { useState } from "react";

export default function Entities({ entity_id }: { entity_id?: string }) {
  const [entityId, setEntityId] = useState<string>(entity_id || "");

  return (
    <Container as="section" className="fr-mt-2w">
      <Row>
        <Col>
          <Title as="h2">{getI18nLabel(i18n, "title")}</Title>
          <Text>
            <i>{getI18nLabel(i18n, "hint")}</i>
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Callout className="callout-style">{getI18nLabel(i18n, "description")}</Callout>
        </Col>
      </Row>
      <Row>
        <Col>
          <EntitySearchBar setEntityId={setEntityId} />
        </Col>
      </Row>
    </Container>
  );
}
