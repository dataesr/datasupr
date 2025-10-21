import { Row, Col } from "@dataesr/dsfr-plus";
import CountriesCollaborationsBubble from "../../../collaborations/charts/countries-collaborations-bubble";
import CountriesCollaborationsTable from "../../../collaborations/charts/countries-collaborations-table";
// import EntityVariablePie from "../../../collaborations/charts/entity-variable-pie";
import { ContentType } from "../../utils/displayRules";
import CountryNeighbourgs from "../../../collaborations/charts/country-neighbourgs";

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
          {/* <EntityVariablePie /> */}
        </div>
      );

    default:
      return <div>Aucun contenu de collaboration disponible</div>;
  }
}
