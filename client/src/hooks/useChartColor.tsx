import { useSearchParams } from "react-router-dom";

export type ChartColorType = "default" | "pillars" | "programs" | "thematics" | "destinations";

/**
 * Hook personnalisé pour déterminer la couleur du graphique en fonction de la vue et des paramètres
 * @returns La couleur du thème à utiliser pour le graphique
 */
export function useChartColor(): ChartColorType {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "default";
  const destinationIds = searchParams.get("destinationIds");

  // Logique de détermination de la couleur basée sur la vue et les paramètres
  if (view === "pillars") {
    return "pillars";
  }

  if (view === "program") {
    return "pillars";
  }

  if (view === "thematic") {
    return "programs";
  }

  if (view === "destination" && !destinationIds) {
    return "thematics";
  }

  if (view === "destination" && destinationIds) {
    return "destinations";
  }

  // Couleur par défaut
  return "default";
}

/**
 * Hook personnalisé avec configuration personnalisée pour déterminer la couleur du graphique
 * @param customLogic - Fonction personnalisée pour déterminer la couleur
 * @returns La couleur du thème à utiliser pour le graphique
 */
export function useCustomChartColor(customLogic?: (view: string, destinationIds: string | null) => ChartColorType): ChartColorType {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "default";
  const destinationIds = searchParams.get("destinationIds");

  if (customLogic) {
    return customLogic(view, destinationIds);
  }

  // Logique par défaut identique à useChartColor
  if (view === "program") {
    return "pillars";
  }

  if (view === "thematic") {
    return "programs";
  }

  if (view === "destination" && !destinationIds) {
    return "thematics";
  }

  if (view === "destination" && destinationIds) {
    return "destinations";
  }

  return "pillars";
}
