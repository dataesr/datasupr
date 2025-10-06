import { ContentType } from "../../utils/displayRules";

interface PositionnementContentProps {
  contentType: ContentType;
  pillarId?: string | null;
  programId?: string | null;
  thematicIds?: string | null;
  destinationIds?: string | null;
}

export default function PositionnementContent({ contentType, pillarId, programId, thematicIds, destinationIds }: PositionnementContentProps) {
  switch (contentType) {
    case "pillar-comparison":
      return (
        <div>
          <p>Positionnement - Cartographie des piliers</p>
          <p>Analyse concurrentielle</p>
          <p>Benchmarks européens</p>
        </div>
      );

    case "pillar-detail":
      return (
        <div>
          <p>Positionnement - Position du pilier {pillarId}</p>
          <p>Comparaison avec les autres pays</p>
          <p>Forces et faiblesses</p>
        </div>
      );

    case "program-detail":
      return (
        <div>
          <p>Positionnement - Position du programme {programId}</p>
          <p>Ranking européen</p>
          <p>Écarts de performance</p>
        </div>
      );

    case "thematic-detail":
      return (
        <div>
          <p>Positionnement - Position des thématiques {thematicIds}</p>
          <p>Analyse comparative internationale</p>
        </div>
      );

    case "destination-detail":
      return (
        <div>
          <p>Positionnement - Position des destinations {destinationIds}</p>
          <p>Attractivité relative</p>
        </div>
      );

    default:
      return <div>Aucun contenu de positionnement disponible</div>;
  }
}
