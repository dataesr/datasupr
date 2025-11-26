import { lazy } from "react";

/**
 * Registre central des composants graphiques disponibles pour l'intégration
 * Ajoutez ici tous les graphiques que vous souhaitez rendre disponibles via l'API d'intégration
 */
export const chartsRegistry = {
  // European Projects
  CountriesCollaborationsBubble: lazy(() => import("../european-projects/pages/collaborations/charts/countries-collaborations-bubble")),

  // Ajoutez d'autres graphiques ici selon vos besoins
  // "ep-autre-graph": lazy(() => import("../european-projects/pages/...")),
  // "atlas-map": lazy(() => import("../atlas/...")),
  // etc.
};

export type ChartId = keyof typeof chartsRegistry;

export function getChart(chartId: string) {
  return chartsRegistry[chartId as ChartId];
}

export function isValidChartId(chartId: string): chartId is ChartId {
  return chartId in chartsRegistry;
}
