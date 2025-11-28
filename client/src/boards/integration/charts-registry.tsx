import { lazy } from "react";

/**
 * Registre central des composants graphiques disponibles pour l'intégration
 * Ajoutez ici tous les graphiques que vous souhaitez rendre disponibles via l'API d'intégration
 */
export const chartsRegistry = {
  // European Projects - Collaborations
  // MapOfEuropeCollaborationsFlow: lazy(() => import("../european-projects/pages/collaborations/charts/map-of-europe-collaborations-flow")),
  // CountryNeighbourgs: lazy(() => import("../european-projects/pages/collaborations/charts/country-neighbourgs")),
  CountriesCollaborationsBubble: lazy(() => import("../european-projects/pages/collaborations/charts/countries-collaborations-bubble")),
  CollaborationsEntityVariablePie: lazy(() => import("../european-projects/pages/collaborations/charts/entity-variable-pie")),

  // European Projects - Positioning
  top10beneficiaries: lazy(() => import("../european-projects/pages/positioning/charts/top-10-beneficiaries")),
  fundingRankingRates: lazy(() => import("../european-projects/pages/positioning/charts/funding-ranking/rates")),
  FundingRankingSubsidies: lazy(() => import("../european-projects/pages/positioning/charts/funding-ranking/subsidies")),
  FundingRankingParticipations: lazy(() => import("../european-projects/pages/positioning/charts/funding-ranking/participations")),
  fundingRankingCoordination: lazy(() => import("../european-projects/pages/positioning/charts/funding-ranking/coordination")),

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
