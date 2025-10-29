export interface NavigationCardsProps {
  type: "fields" | "regions" | "structures";
  maxItems?: number;
}

export interface NavigationItem {
  id: string;
  name: string;
  total_count: number;
  region?: string;
  type?: string;
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
export interface ContextExplorerModalProps {
  isOpen: boolean;
  year: string;
  onClose: () => void;
  onExplore: (item: NavigationItem) => void;
}
export interface YearModalProps {
  isOpen: boolean;
  years: string[];
  currentYear: string;
  onClose: () => void;
  onApply: (year: string) => void;
}
export interface CnuCategory {
  categoryName: string;
  count: number;
}

export interface CnuGroup {
  cnuGroupId: string;
  cnuGroupLabel?: string;
  totalCount?: number;
  maleCount?: number;
  femaleCount?: number;
  categories?: CnuCategory[];
  ageDistribution?: { ageClass: string; count: number }[];
}
export interface CnuGroupsTableProps {
  context: "fields" | "geo" | "structures";
  contextId: string;
  annee_universitaire?: string;
  showAgeDemographics?: boolean;
}

export interface ResearchTeachersOverviewTableProps {
  context: "fields" | "geo" | "structures";
  annee_universitaire?: string;
  contextId?: string;
}

export interface BaseItem {
  maleCount: number;
  femaleCount: number;
  totalCount: number;
}

export interface FieldItem extends BaseItem {
  field_id: string;
  fieldLabel: string;
}

export interface RegionItem extends BaseItem {
  geo_id: string;
  geoName: string;
}

export interface StructureItem extends BaseItem {
  structure_id: string;
  structureName: string;
}
export interface UseCnuDataProps {
  context: "fields" | "geo" | "structures";
  contextId?: string;
  annee_universitaire?: string;
}
