import { useSearchParams } from "react-router-dom";
import { ViewConditions } from "../utils/displayRules";

export function useOverviewParams(): ViewConditions {
  const [searchParams] = useSearchParams();
  
  // Parser le paramètre view composé (ex: "synthesis|program" ou "positioning|pillar")
  const viewParam = searchParams.get("view") || "synthesis|pillar";
  const [activeTab, contentView] = viewParam.includes("|") 
    ? viewParam.split("|") 
    : ["synthesis", viewParam];
  
  return {
    activeTab: activeTab as "synthesis" | "positioning" | "collaborations",
    view: contentView,
    pillarId: searchParams.get("pillarId"),
    programId: searchParams.get("programId"),
    thematicIds: searchParams.get("thematicIds"),
    destinationIds: searchParams.get("destinationIds"),
  };
}

export function useCurrentLanguage(): string {
  const [searchParams] = useSearchParams();
  return searchParams.get("language") || "fr";
}
