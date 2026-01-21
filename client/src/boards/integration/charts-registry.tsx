import { lazy } from "react";

/**
 * Registre central des composants graphiques disponibles pour l'intégration
 * Ajoutez ici tous les graphiques que vous souhaitez rendre disponibles via l'API d'intégration
 */
export const chartsRegistry = {
  // European Projects - Collaborations
  // MapOfEuropeCollaborationsFlow: lazy(() => import("../european-projects/pages/collaborations/charts/map-of-europe-collaborations-flow")),
  // CountryNeighbourgs: lazy(() => import("../european-projects/pages/collaborations/charts/country-neighbourgs")),
  CountriesCollaborationsBubble: lazy(
    () =>
      import("../european-projects/pages/collaborations/charts/countries-collaborations-bubble")
  ),
  CollaborationsEntityVariablePie: lazy(
    () =>
      import("../european-projects/pages/collaborations/charts/entity-variable-pie")
  ),

  // European Projects - Positioning
  top10beneficiaries: lazy(
    () =>
      import("../european-projects/pages/positioning/charts/top-10-beneficiaries")
  ),
  fundingRankingRates: lazy(
    () =>
      import("../european-projects/pages/positioning/charts/funding-ranking/rates")
  ),
  FundingRankingSubsidies: lazy(
    () =>
      import("../european-projects/pages/positioning/charts/funding-ranking/subsidies")
  ),
  FundingRankingParticipations: lazy(
    () =>
      import("../european-projects/pages/positioning/charts/funding-ranking/participations")
  ),
  fundingRankingCoordination: lazy(
    () =>
      import("../european-projects/pages/positioning/charts/funding-ranking/coordination")
  ),

  // European Projects - Synthesis
  // TODO

  // European Projects - Evolution PCRI
  fundingStackedArea: lazy(
    () =>
      import("../european-projects/pages/evolution-pcri/charts/funding-stacked-area")
  ),
  successRateEvolution: lazy(
    () =>
      import("../european-projects/pages/evolution-pcri/charts/success-rate-evolution")
  ),
  countriesHeatmap: lazy(
    () =>
      import("../european-projects/pages/evolution-pcri/charts/countries-heatmap")
  ),
  countriesRanking: lazy(
    () =>
      import("../european-projects/pages/evolution-pcri/charts/countries-ranking")
  ),
  fundingByCountry: lazy(
    () =>
      import("../european-projects/pages/evolution-pcri/charts/funding-by-country")
  ),
  efficiencyScatter: lazy(
    () =>
      import("../european-projects/pages/evolution-pcri/charts/efficiency-scatter")
  ),

  // Structures Finance
  ressourcesPropres: lazy(
    () =>
      import("../structures-finance/pages/structures/sections/resources/charts/ressources-propres")
  ),
  ressourcesPropresEvolution: lazy(
    () =>
      import("../structures-finance/pages/structures/sections/resources/charts/ressources-propres-evolution")
  ),
  "effectifs-niveau": lazy(
    () =>
      import("../structures-finance/pages/structures/sections/formations/charts/effectifs/effectifs-niveau")
  ),
  "effectifs-specifiques": lazy(
    () =>
      import("../structures-finance/pages/structures/sections/formations/charts/effectifs/effectifs-specifiques")
  ),
  "effectifs-disciplines": lazy(
    () =>
      import("../structures-finance/pages/structures/sections/formations/charts/effectifs/effectifs-disciplines")
  ),
  "effectifs-diplomes": lazy(
    () =>
      import("../structures-finance/pages/structures/sections/formations/charts/effectifs/effectifs-diplomes")
  ),
  "effectifs-degrees": lazy(
    () =>
      import("../structures-finance/pages/structures/sections/formations/charts/effectifs/effectifs-degrees")
  ),
  "effectifs-evolution": lazy(
    () =>
      import("../structures-finance/pages/structures/sections/formations/charts/effectifs-evolution")
  ),
};

export type ChartId = keyof typeof chartsRegistry;

export function getChart(chartId: string) {
  return chartsRegistry[chartId as ChartId];
}

export function isValidChartId(chartId: string): chartId is ChartId {
  return chartId in chartsRegistry;
}
