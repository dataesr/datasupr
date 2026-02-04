import { Row, Col, Title } from "@dataesr/dsfr-plus";

import BoardsSuggestComponent from "../../../../../../components/boards-suggest-component";
import Callout from "../../../../../../components/callout";
import CountriesCollaborationsBubble from "../../../collaborations/charts/countries-collaborations-bubble";
import CountriesCollaborationsTable from "../../../collaborations/charts/countries-collaborations-table";
import CountryNeighbourgs from "../../../collaborations/charts/country-neighbourgs";
import EntityVariablePie from "../../../collaborations/charts/entity-variable-pie";
import MapOfEuropeCollaborationsFlow from "../../../collaborations/charts/map-of-europe-collaborations-flow";

export default function CollaborationsContent() {
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
            Répartition des collaborations par entité
          </Title>
          <Callout className="callout-style">
            Visualisez la répartition des collaborations du pilier/programme/thématique/destination sélectionné(e) par entité.
            <br /> Vous pouvez rechercher une entité spécifique pour voir ses collaborations.
            <br /> Par exemple, si vous recherchez une université, vous verrez la part des collaborations impliquant cette université par rapport au
            total des collaborations du pilier/programme/thématique/destination. Toujours dans l'écosystème du pays sélectionné.
            <br /> Cela vous permet d'identifier les entités les plus actives et de comprendre leur rôle dans les collaborations au sein du pays.
            <br /> Attention, seules les entités du pays apparaissent dans la recherche.
          </Callout>
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
