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
    itemId?: string;
    itemType?: "fields" | "geo" | "structures";
    totalCount: number;
    nonTitulaires: number;
    titulairesNonChercheurs: number;
    enseignantsChercheurs: number;
    totalTitulaires: number;
  }>;
  displayAsPercentage: boolean;
  alwaysIncludeLabels?: string[];
}

export interface Field {
  year: string;
  field_id: string;
  fieldLabel: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
}

export interface OptionsProps {
  fieldsData: Field[];
  selectedYear: string;
  displayMode: "count" | "percentage";
  e;
}
export type ContextType = "fields" | "geo" | "structures";

export interface ContextInfo {
  context: ContextType;
  contextId: string | undefined;
  contextName: string;
  isAcademie?: boolean;
}
