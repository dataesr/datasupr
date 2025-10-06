import { useSearchParams } from "react-router-dom";
import { ViewConditions } from "../utils/displayRules";

export function useOverviewParams(): ViewConditions {
  const [searchParams] = useSearchParams();
  
  return {
    view: searchParams.get("view") || "pillar",
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
