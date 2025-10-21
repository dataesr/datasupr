import CountriesCollaborationsBubble from "../../../collaborations/charts/countries-collaborations-bubble";
import CountriesCollaborationsTable from "../../../collaborations/charts/countries-collaborations-table";
import { ContentType } from "../../utils/displayRules";

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
          <CountriesCollaborationsTable />
        </div>
      );

    default:
      return <div>Aucun contenu de collaboration disponible</div>;
  }
}
