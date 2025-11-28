// import FundingRanking from "../../../positioning/charts/funding-ranking";
import BoardsSuggestComponent from "../../../../../../components/boards-suggest-component";
import FundingRankingCoordination from "../../../positioning/charts/funding-ranking/coordination";
import FundingRankingParticipations from "../../../positioning/charts/funding-ranking/participations";
import FundingRankingRates from "../../../positioning/charts/funding-ranking/rates";
import FundingRankingSubsidies from "../../../positioning/charts/funding-ranking/subsidies";
import Intro from "../../../positioning/charts/intro";
import Top10Beneficiaries from "../../../positioning/charts/top-10-beneficiaries";
import { ContentType } from "../../utils/displayRules";

interface PositionnementContentProps {
  contentType: ContentType;
  pillarId?: string | null;
  programId?: string | null;
  thematicIds?: string | null;
  destinationIds?: string | null;
}

export default function PositionnementContent({ contentType }: PositionnementContentProps) {
  // export default function PositionnementContent({ contentType, pillarId, programId, thematicIds, destinationIds }: PositionnementContentProps) {
  switch (contentType) {
    case "pillar-comparison":
    case "pillar-detail":
    case "program-detail":
    case "thematic-detail":
    case "destination-detail":
      return (
        <div>
          <Intro /> {/** TODO: Permettre l'intégration comme pour le chartWrapper */}
          <Top10Beneficiaries />
          <FundingRankingRates />
          <FundingRankingSubsidies />
          <FundingRankingParticipations />
          <FundingRankingCoordination />
          <BoardsSuggestComponent />
        </div>
      );

    default:
      return <div>Aucun contenu de positionnement disponible</div>;
  }
}
