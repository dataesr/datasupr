import { useSearchParams } from "react-router-dom";
import { Row, Col, Title } from "@dataesr/dsfr-plus";

import BoardsSuggestComponent from "../../../../../../components/boards-suggest-component";
import Callout from "../../../../../../components/callout";
import CountriesCollaborationsBubble from "../../../collaborations/charts/countries-collaborations-bubble";
import CountriesCollaborationsTable from "../../../collaborations/charts/countries-collaborations-table";
import CountryNeighbourgs from "../../../collaborations/charts/country-neighbourgs";
import EntityVariablePie from "../../../collaborations/charts/entity-variable-pie";
import MapOfEuropeCollaborationsFlow from "../../../collaborations/charts/map-of-europe-collaborations-flow";
import { getI18nLabel } from "../../../../../../utils";

const i18n = {
  "collaborations-by-entity-title": {
    fr: "Répartition des collaborations par entité",
    en: "Collaboration distribution by entity",
  },
  "collaborations-by-entity-callout": {
    fr: "Visualisez la répartition des collaborations du pilier/programme/thématique/destination sélectionné(e) par entité. Vous pouvez rechercher une entité spécifique pour voir ses collaborations. Par exemple, si vous recherchez une université, vous verrez la part des collaborations impliquant cette université par rapport au total des collaborations du pilier/programme/thématique/destination. Toujours dans l'écosystème du pays sélectionné. Cela vous permet d'identifier les entités les plus actives et de comprendre leur rôle dans les collaborations au sein du pays. Attention, seules les entités du pays apparaissent dans la recherche.",
    en: "Visualize the collaboration distribution of the selected pillar/program/topic/destination by entity. You can search for a specific entity to see its collaborations. For example, if you search for a university, you will see the share of collaborations involving that university compared to the total collaborations of the pillar/program/topic/destination. Always within the selected country's ecosystem. This allows you to identify the most active entities and understand their role in collaborations within the country. Note that only entities from the country appear in the search.",
  },
};

export default function CollaborationsContent() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  return (
    <div>
      <Row>
        <Col>
          <MapOfEuropeCollaborationsFlow />
        </Col>
      </Row>
      <Row>
        <Col>
          <CountriesCollaborationsTable />
        </Col>
        <Col>
          <CountryNeighbourgs />
        </Col>
        <Row>
          <Col>
            <CountriesCollaborationsBubble />
          </Col>
        </Row>
      </Row>
      <Row className="fr-mt-5w">
        <Col>
          <Title as="h2" look="h4">
            {getI18nLabel(i18n, "collaborations-by-entity-title", currentLang)}
          </Title>
          <Callout className="callout-style">{getI18nLabel(i18n, "collaborations-by-entity-callout", currentLang)}</Callout>
        </Col>
      </Row>
      <Row>
        <Col>
          <EntityVariablePie />
        </Col>
      </Row>
      <BoardsSuggestComponent />
    </div>
  );
}
