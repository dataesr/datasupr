import { getContentType, ViewConditions, ContentType } from "../utils/displayRules";
import SyntheseContent from "./tabs/SyntheseContent";
import PositionnementContent from "./tabs/PositionnementContent";
import CollaborationsContent from "./tabs/CollaborationsContent";

type TabType = "synthese" | "positionnement" | "collaborations";

interface SmartTabContentProps extends ViewConditions {
  tabType: TabType;
}

export default function SmartTabContent(props: SmartTabContentProps) {
  const { pillarId, programId, thematicIds, destinationIds, tabType } = props;
  const contentType: ContentType = getContentType(props);

  const renderTabSpecificContent = () => {
    const commonProps = {
      contentType,
      pillarId,
      programId,
      thematicIds,
      destinationIds,
    };

    switch (tabType) {
      case "synthese":
        return <SyntheseContent {...commonProps} />;

      case "positionnement":
        return <PositionnementContent {...commonProps} />;

      case "collaborations":
        return <CollaborationsContent {...commonProps} />;

      default:
        return null;
    }
  };

  return <>{renderTabSpecificContent()}</>;
}
