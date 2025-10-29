import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../utils";

export function useContextParams() {
  const [searchParams] = useSearchParams();
  const { context } = useContextDetection();
  switch (context) {
    case "fields":
      return {
        contextId: searchParams.get("field_id"),
        groupId: searchParams.get("group_id"),
      } as { contextId: string | null; groupId: string | null };
    case "geo":
      return {
        contextId: searchParams.get("geo_id"),
        groupId: searchParams.get("department_id"),
      } as { contextId: string | null; groupId: string | null };
    case "structures":
      return {
        contextId: searchParams.get("structure_id"),
        groupId: searchParams.get("component_id"),
      } as { contextId: string | null; groupId: string | null };
    default:
      return { contextId: null, groupId: null } as {
        contextId: string | null;
        groupId: string | null;
      };
  }
}

export function getLabels(context: string) {
  const labels = {
    fields: {
      singular: "discipline",
      plural: "disciplines",
      groupSingular: "groupe CNU",
      groupPlural: "groupes CNU",
      sectionSingular: "section CNU",
      sectionPlural: "sections CNU",
      urlPath: "discipline",
      viewPath: "vue-disciplinaire",
    },
    geo: {
      singular: "région",
      plural: "régions",
      groupSingular: "département",
      groupPlural: "départements",
      sectionSingular: "section",
      sectionPlural: "sections",
      urlPath: "geo",
      viewPath: "vue-géographique",
    },
    structures: {
      singular: "établissement",
      plural: "établissements",
      groupSingular: "composante",
      groupPlural: "composantes",
      sectionSingular: "sous-section",
      sectionPlural: "sous-sections",
      urlPath: "universite",
      viewPath: "vue-par-établissement",
    },
  } as const;
  return labels[context as keyof typeof labels];
}
