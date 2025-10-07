import { ContentType } from "../../utils/displayRules";
import PillarsFunding from "../../../overview/components/pillars-funding";
import ProgramsFunding from "../../../overview/components/programs-funding";
import { Title } from "@dataesr/dsfr-plus";
import TopicsFunding from "../../../overview/components/topics-funding";
import DestinationsFunding from "../../../overview/components/destinations-funding";
import PillarsOverview from "../../../overview/components/pillars-overview";
import ProgramsOverview from "../../../overview/components/programs-overview";
import ThematicsOverview from "../../../overview/components/destinations-overview";
import DestinationsOverview from "../../../overview/components/destinations-overview";
// import DestinationsFunding from "../../../overview/components/destinations-funding";

interface SyntheseContentProps {
  contentType: ContentType;
  pillarId?: string | null;
  programId?: string | null;
  thematicIds?: string | null;
  destinationIds?: string | null;
}

export default function SyntheseContent({ contentType, pillarId, programId, thematicIds, destinationIds }: SyntheseContentProps) {
  switch (contentType) {
    case "pillar-comparison":
      return (
        <div>
          <Title as="h2">Comparaison de la répartition des financements par pilier</Title>
          <PillarsFunding />
          <p>Tableaux de synthèse des financements</p>
        </div>
      );

    case "pillar-detail":
      return (
        <div>
          {/* <PillarsFunding /> */}
          <Title as="h2">Détails du pilier {pillarId}</Title>
          <PillarsOverview />

          <Title as="h2">Composition du pilier</Title>
          <Title as="h3">Répartition des financements par programme</Title>
          <ProgramsFunding />
        </div>
      );

    case "program-detail":
      return (
        <div>
          <p>Synthèse - Détails du programme {programId}</p>
          <ProgramsOverview />

          <p>Indicateurs de performance du programme</p>
          <Title as="h2">Composition du programme</Title>
          <Title as="h3">Répartition des financements par thématique</Title>
          <TopicsFunding />
        </div>
      );

    case "thematic-detail":
      return (
        <div>
          <p>Synthèse - Détails des thématiques {thematicIds}</p>
          <ThematicsOverview />
          <p>Analyse comparative des thématiques</p>
          <Title as="h2">Composition des thématiques</Title>
          <Title as="h3">Répartition des financements par destination</Title>
          <DestinationsFunding />
        </div>
      );

    case "destination-detail":
      return (
        <div>
          <p>Synthèse - Détails des destinations {destinationIds}</p>
          <DestinationsOverview />
          <p>Répartition budgétaire par destination</p>
        </div>
      );

    default:
      return <div>Aucun contenu disponible</div>;
  }
}
