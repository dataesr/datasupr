import { getContentType, ViewConditions, ContentType } from "../utils/displayRules";
import SyntheseContent from "./tabs/SyntheseContent";
import PositionnementContent from "./tabs/PositionnementContent";
import CollaborationsContent from "./tabs/CollaborationsContent";

type TabType = "synthesis" | "positioning" | "collaborations";

interface SmartTabContentProps extends ViewConditions {
  tabType: TabType;
}

export default function SmartTabContent(props: SmartTabContentProps) {
  const { tabType } = props;
  const contentType: ContentType = getContentType(props);

  const renderTabSpecificContent = () => {
    const commonProps = { contentType };

    switch (tabType) {
      case "synthesis":
        return <SyntheseContent {...commonProps} />;

      case "positioning":
        return <PositionnementContent {...commonProps} />;

      case "collaborations":
        return <CollaborationsContent {...commonProps} />;

      default:
        return null;
    }
  };

  return <>{renderTabSpecificContent()}</>;
}
