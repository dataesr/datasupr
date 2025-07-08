import { useSearchParams, useParams, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useContext } from "./pages/research-teachers/utils/use-context";

export type ContextType = "fields" | "geo" | "structures";

export interface ContextInfo {
  context: ContextType;
  contextId: string | undefined;
  contextName: string;
  isAcademie?: boolean;
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
    }
    if (geo_id_param) {
      const isAcademie = geo_id_param.toString().startsWith("A");

      return {
        context: "geo" as const,
        contextId: geo_id_param,
        contextName: isAcademie ? "académie" : "région",
        isAcademie: isAcademie,
      };
    }
    if (structure_id) {
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
        contextName: "discipline",
      };
    }
    if (path.includes("/geo/")) {
      return {
        context: "geo" as const,
        contextId: undefined,
        contextName: "région",
      };
    }
    if (path.includes("/universite/")) {
      return {
        context: "structures" as const,
        contextId: undefined,
        contextName: "établissement",
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
  baseTitle: string | null,
  context: ContextType,
  contextId?: string,
  allData?: { context_info?: { name: string; type?: string } | null },
  isLoading?: boolean
): string {
  if (isLoading) {
    return baseTitle ? `${baseTitle} - Chargement...` : "Chargement...";
  }

  const isAcademie =
    contextId && context === "geo" && contextId.toString().startsWith("A");

  if (contextId && !allData?.context_info) {
    const fallbackTitles = {
      fields: "Toutes disciplines",
      geo: isAcademie ? "Toutes académies" : "Toutes régions",
      structures: "Tous les établissements",
    };
    return baseTitle
      ? `${baseTitle} - ${fallbackTitles[context]}`
      : fallbackTitles[context];
  }

  if (contextId && allData?.context_info?.name) {
    return baseTitle
      ? `${baseTitle} - ${allData.context_info.name}`
      : allData.context_info.name;
  }

  const genericTitles = {
    fields: "Toutes disciplines",
    geo: isAcademie ? "Toutes académies" : "Toutes régions",
    structures: "Tous les établissements",
  };

  return baseTitle
    ? `${baseTitle} - ${genericTitles[context]}`
    : genericTitles[context];
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

export function useBreadcrumbItems(
  context: ContextType,
  contextId?: string,
  contextName?: string
): { label: string; href: string }[] {
  const location = useLocation();
  const { data: contextData, isLoading: isContextLoading } = useContext({
    context,
    contextId,
  });

  const searchParams = new URLSearchParams(location.search);
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const isAcademie =
    contextId && context === "geo" && contextId.toString().startsWith("A");

  const currentPage = (() => {
    if (location.pathname.includes("/typologie")) return "Typologie";
    if (location.pathname.includes("/evolution")) return "Évolution";
    if (location.pathname.includes("/enseignants-chercheurs"))
      return "Enseignants-chercheurs";
    return null;
  })();

  if (!contextId) {
    switch (context) {
      case "fields":
        return [
          {
            label: "Toutes les disciplines",
            href: "/personnel-enseignant/discipline/vue-d'ensemble/",
          },
          ...(currentPage ? [{ label: currentPage, href: "#" }] : []),
        ];
      case "geo":
        return [
          {
            label: "Donnée nationale",
            href: "/personnel-enseignant/geo/vue-d'ensemble/",
          },
          ...(currentPage ? [{ label: currentPage, href: "#" }] : []),
        ];
      case "structures":
        return [
          {
            label: "Tous les établissements",
            href: "/personnel-enseignant/universite/vue-d'ensemble/",
          },
          ...(currentPage ? [{ label: currentPage, href: "#" }] : []),
        ];
      default:
        return [];
    }
  } else {
    const baseLabel =
      context === "fields"
        ? "Toutes les disciplines"
        : context === "geo"
        ? "Donnée nationale"
        : "Tous les établissements";

    const baseHref =
      context === "fields"
        ? "/personnel-enseignant/discipline/vue-d'ensemble/"
        : context === "geo"
        ? "/personnel-enseignant/geo/vue-d'ensemble/"
        : "/personnel-enseignant/universite/vue-d'ensemble/";

    const overviewHref = `${baseHref}?annee_universitaire=${selectedYear}&${
      context === "fields"
        ? `field_id=${contextId}`
        : context === "geo"
        ? `geo_id=${contextId}`
        : `structure_id=${contextId}`
    }`;

    let name = isContextLoading
      ? "Chargement..."
      : contextData?.name || contextName || "Inconnu";
    console.log(contextData);
    if (context === "geo" && isAcademie && !isContextLoading) {
      name = `Académie de ${contextData.lib}`;
    } else if (context === "geo" && !isAcademie && !isContextLoading) {
      name = `Région ${contextData.lib}`;
    }

    if (context === "geo" && isAcademie && contextData?.region_name) {
      const regionHref = `${baseHref}?annee_universitaire=${selectedYear}&geo_id=${contextData.region_id}`;

      return [
        { label: baseLabel, href: baseHref },
        { label: `Région ${contextData.region_name}`, href: regionHref },
        { label: name, href: overviewHref },
        ...(currentPage ? [{ label: currentPage, href: "#" }] : []),
      ];
    }

    return [
      { label: baseLabel, href: baseHref },
      { label: name, href: overviewHref },
      ...(currentPage ? [{ label: currentPage, href: "#" }] : []),
    ];
  }
}

const rootStyles = getComputedStyle(document.documentElement);

export const getColorForDiscipline = (discipline: string) => {
  if (discipline === "Sciences")
    return rootStyles.getPropertyValue("--sciences-field-color");
  if (discipline === "Lettres et sciences humaines")
    return rootStyles.getPropertyValue("--literature-human-sc-field-color");
  if (discipline === "Droit, économie et gestion")
    return rootStyles.getPropertyValue("--law-economics-field-color");
  if (discipline === "Médecine")
    return rootStyles.getPropertyValue("--medecine-field-color");
  if (discipline === "Pharmacie")
    return rootStyles.getPropertyValue("--pharmacy-field-color");
  if (discipline === "Odontologie")
    return rootStyles.getPropertyValue("--ondotologie-field-color");
  if (discipline === "Autres Santé")
    return rootStyles.getPropertyValue("--other-health-field-color");
  if (discipline === "Personnel des grands établissements")
    return rootStyles.getPropertyValue("--non-univ-field-color");
  if (discipline === "Non spécifiée")
    return rootStyles.getPropertyValue("--unspecified-field-color");
};
