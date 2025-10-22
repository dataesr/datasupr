export interface NavigationCardsProps {
  type: "fields" | "regions" | "structures";
  maxItems?: number;
}

export interface NavigationItem {
  id: string;
  name: string;
  total_count: number;
  region?: string;
}
export interface StatusOptionsProps {
  disciplines: Array<{
    fieldLabel: string;
    totalCount: number;
    nonTitulaires: number;
    titulairesNonChercheurs: number;
    enseignantsChercheurs: number;
    totalTitulaires: number;
  }>;
  displayAsPercentage: boolean;
  alwaysIncludeLabels?: string[];
}
