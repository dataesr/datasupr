import { ContentType } from "../../utils/displayRules";

interface CollaborationsContentProps {
  contentType: ContentType;
  pillarId?: string | null;
  programId?: string | null;
  thematicIds?: string | null;
  destinationIds?: string | null;
}

export default function CollaborationsContent({ contentType, pillarId, programId, thematicIds, destinationIds }: CollaborationsContentProps) {
  switch (contentType) {
    case "pillar-comparison":
      return (
        <div>
          <p>Collaborations - Réseaux de partenaires par pilier</p>
          <p>Cartographie des collaborations</p>
          <p>Analyse des écosystèmes</p>
        </div>
      );

    case "pillar-detail":
      return (
        <div>
          <p>Collaborations - Partenaires du pilier {pillarId}</p>
          <p>Institutions collaboratrices</p>
          <p>Projets conjoints</p>
        </div>
      );

    case "program-detail":
      return (
        <div>
          <p>Collaborations - Partenaires du programme {programId}</p>
          <p>Consortium principal</p>
          <p>Réseaux d'excellence</p>
        </div>
      );

    case "thematic-detail":
      return (
        <div>
          <p>Collaborations - Partenaires des thématiques {thematicIds}</p>
          <p>Communautés de recherche</p>
        </div>
      );

    case "destination-detail":
      return (
        <div>
          <p>Collaborations - Partenaires des destinations {destinationIds}</p>
          <p>Alliances stratégiques</p>
        </div>
      );

    default:
      return <div>Aucun contenu de collaboration disponible</div>;
  }
}
