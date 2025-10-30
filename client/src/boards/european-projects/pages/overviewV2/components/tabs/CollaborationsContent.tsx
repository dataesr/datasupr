import { Row, Col, Title } from "@dataesr/dsfr-plus";
import CountriesCollaborationsBubble from "../../../collaborations/charts/countries-collaborations-bubble";
import CountriesCollaborationsTable from "../../../collaborations/charts/countries-collaborations-table";
import EntityVariablePie from "../../../collaborations/charts/entity-variable-pie";
import { ContentType } from "../../utils/displayRules";
import CountryNeighbourgs from "../../../collaborations/charts/country-neighbourgs";
import Callout from "../../../../../../components/callout";

interface CollaborationsContentProps {
  contentType: ContentType;
  pillarId?: string | null;
  programId?: string | null;
  thematicIds?: string | null;
  destinationIds?: string | null;
}

export default function CollaborationsContent({ contentType }: CollaborationsContentProps) {
  // export default function CollaborationsContent({ contentType, pillarId, programId, thematicIds, destinationIds }: CollaborationsContentProps) {
  switch (contentType) {
    case "pillar-comparison":
    case "pillar-detail":
    case "program-detail":
    case "thematic-detail":
    case "destination-detail":
      return (
        <div>
          <CountriesCollaborationsBubble />
          <Row>
            <Col>
              <CountriesCollaborationsTable />
            </Col>
            <Col>
              <CountryNeighbourgs />
              <br />
              <br />
              <br />
              Carte de flux à ajouter ici
            </Col>
          </Row>
          <Row className="fr-mt-5w">
            <Col>
              <Title as="h2" look="h4">
                Répartition des collaborations par entité
              </Title>
              <Callout className="callout-style">
                Visualisez la répartition des collaborations du pilier/programme/thématique/destination sélectionné(e) par entité.
                <br /> Vous pouvez rechercher une entité spécifique pour voir ses collaborations.
                <br /> Par exemple, si vous recherchez une université, vous verrez la part des collaborations impliquant cette université par rapport
                au total des collaborations du pilier/programme/thématique/destination. Toujours dans l'écosystème du pays sélectionné.
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
        </div>
      );

    default:
      return <div>Aucun contenu de collaboration disponible</div>;
  }
}
