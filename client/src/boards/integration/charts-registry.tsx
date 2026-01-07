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

  // European Projects - Synthesis
  // TODO

  // European Projects - Evolution PCRI
  fundingStackedArea: lazy(() => import("../european-projects/pages/evolution-pcri/charts/funding-stacked-area")),
  successRateEvolution: lazy(() => import("../european-projects/pages/evolution-pcri/charts/success-rate-evolution")),
  countriesHeatmap: lazy(() => import("../european-projects/pages/evolution-pcri/charts/countries-heatmap")),
  countriesRanking: lazy(() => import("../european-projects/pages/evolution-pcri/charts/countries-ranking")),
  fundingByCountry: lazy(() => import("../european-projects/pages/evolution-pcri/charts/funding-by-country")),
  efficiencyScatter: lazy(() => import("../european-projects/pages/evolution-pcri/charts/efficiency-scatter")),

  // Fundings
  frenchPartnersByLaboratory: lazy(() => import("../fundings/pages/laboratories/charts/french-partners-by-laboratory")),
  frenchPartnersByStructure: lazy(() => import("../fundings/pages/structures/charts/french-partners-by-structure")),
  fundedLabs: lazy(() => import("../fundings/pages/national/charts/funded-labs")),
  fundedLabsBudget: lazy(() => import("../fundings/pages/national/charts/funded-labs-budget")),
  fundedStructures: lazy(() => import("../fundings/pages/national/charts/funded-structures")),
  fundedStructuresBudget: lazy(() => import("../fundings/pages/national/charts/funded-structures-budget")),
  fundedStructuresEurope: lazy(() => import("../fundings/pages/national/charts/funded-structures-europe")),
  fundedStructuresEuropeBudget: lazy(() => import("../fundings/pages/national/charts/funded-structures-europe-budget")),
  internationalPartnersByLaboratory: lazy(() => import("../fundings/pages/laboratories/charts/international-partners-by-laboratory")),
  internationalPartnersByStructure: lazy(() => import("../fundings/pages/structures/charts/international-partners-by-structure")),
  participationsOverTime: lazy(() => import("../fundings/pages/national/charts/participations-over-time")),
  participationsOverTimeBudget: lazy(() => import("../fundings/pages/national/charts/participations-over-time-budget")),
  topCounty: lazy(() => import("../fundings/pages/national/charts/top-county")),
  topCountyByBtructure: lazy(() => import("../fundings/pages/structures/charts/top-county-by-structure")),
  topCountyByLaboratory: lazy(() => import("../fundings/pages/laboratories/charts/top-county-by-laboratory")),
  topFundersByLaboratory: lazy(() => import("../fundings/pages/laboratories/charts/top-funders-by-laboratory")),
  topFundersByStructure: lazy(() => import("../fundings/pages/structures/charts/top-funders-by-structure")),
  topLabsByStructure: lazy(() => import("../fundings/pages/structures/charts/top-labs-by-structure")),
  topProjectsByLaboratory: lazy(() => import("../fundings/pages/laboratories/charts/top-projects-by-laboratory")),
  topProjectsByStructure: lazy(() => import("../fundings/pages/structures/charts/top-projects-by-structure")),
};

export type ChartId = keyof typeof chartsRegistry;

export function getChart(chartId: string) {
  return chartsRegistry[chartId as ChartId];
}

export function isValidChartId(chartId: string): chartId is ChartId {
  return chartId in chartsRegistry;
}
