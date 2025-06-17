import { useSearchParams, useParams, useLocation } from "react-router-dom";
import { useMemo } from "react";

export type ContextType = "fields" | "geo" | "structures";

export interface ContextInfo {
  context: ContextType;
  contextId: string | undefined;
  contextName: string;
}

export function useContextDetection(): ContextInfo {
  const [searchParams] = useSearchParams();
  const { geo_id, id, field_id: paramFieldId } = useParams();
  const location = useLocation();

  const field_id = searchParams.get("field_id") || paramFieldId;
  const geo_id_param = searchParams.get("geo_id") || geo_id;
  const structure_id = searchParams.get("structure_id") || id;

  const contextInfo = useMemo(() => {
    if (field_id) {
      return {
        context: "fields" as const,
        contextId: field_id,
        contextName: "discipline",
      };
    } else if (geo_id_param) {
      return {
        context: "geo" as const,
        contextId: geo_id_param,
        contextName: "région",
      };
    } else if (structure_id) {
      return {
        context: "structures" as const,
        contextId: structure_id,
        contextName: "établissement",
      };
    }

    const path = location.pathname;
    if (path.includes("/discipline/")) {
      return {
        context: "fields" as const,
        contextId: undefined,
        contextName: "Toutes les grandes disciplines",
      };
    } else if (path.includes("/geo/")) {
      return {
        context: "geo" as const,
        contextId: undefined,
        contextName: "France",
      };
    } else if (path.includes("/universite/")) {
      return {
        context: "structures" as const,
        contextId: undefined,
        contextName: "Tous les établissements",
      };
    }

    return {
      context: "fields" as const,
      contextId: undefined,
      contextName: "global",
    };
  }, [field_id, geo_id_param, structure_id, location.pathname]);

  return contextInfo;
}

export function generateContextualTitle(
  baseTitle: string,
  context: ContextType,
  contextId?: string,
  contextName?: string
): string {
  if (contextId && contextName && contextName !== "global") {
    return `${baseTitle} - ${contextName}`;
  } else if (contextId) {
    const defaultNames = {
      fields: "discipline sélectionnée",
      geo: "région sélectionnée",
      structures: "établissement sélectionné",
    };
    return `${baseTitle} - ${defaultNames[context]}`;
  } else {
    const globalNames = {
      fields: "Toutes disciplines",
      geo: "Toutes régions",
      structures: "Tous établissements",
    };
    return `${baseTitle} - ${globalNames[context]}`;
  }
}

export function generateIntegrationURL(
  context: ContextType,
  page: string
): string {
  const contextPaths = {
    fields: "discipline",
    geo: "geo",
    structures: "universite",
  };

  return `/personnel-enseignant/${contextPaths[context]}/${page}`;
}
