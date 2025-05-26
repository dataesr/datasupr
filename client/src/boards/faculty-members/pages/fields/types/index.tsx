import { DemographicData } from "../../geo/types";

export interface Field {
  fieldId?: string;
  field_id?: string;
  fieldLabel?: string;
  field_label?: string;
  year?: string;
  academic_year?: string;
  maleCount?: number;
  numberMan?: number;
  femaleCount?: number;
  numberWoman?: number;
  unknownCount?: number;
  numberUnknown?: number;
  totalCount?: number;
  total_count?: number;
  cnuGroups?: CNUGroup[];
  headcount_per_cnu_group?: CNUGroup[];
}

export interface TopFieldsIndicatorsProps {
  disciplinesData: Field[];
}

export interface CNUGroup {
  cnuGroupId?: string | number;
  cnu_group_id?: string | number;
  cnuGroupLabel?: string;
  cnu_group_label?: string;
  maleCount?: number;
  numberMan?: number;
  femaleCount?: number;
  numberWoman?: number;
  unknownCount?: number;
  numberUnknown?: number;
  totalCount?: number;
  fieldId?: string;
  fieldLabel?: string;
  cnuSections?: CNUSection[];
  headcount_per_cnu_section?: CNUSection[];
  ageDistribution?: AgeDistribution;
}

export interface CNUSection {
  cnuSectionId?: string | number;
  cnu_section_id?: string | number;
  cnuSectionLabel?: string;
  cnu_section_label?: string;
  maleCount?: number;
  numberMan?: number;
  femaleCount?: number;
  numberWoman?: number;
  unknownCount?: number;
  numberUnknown?: number;
  totalCount?: number;
  cnuGroupId?: string | number;
  cnuGroupLabel?: string;
  fieldId?: string | number;
  fieldLabel?: string;
  ageDistribution?: AgeClass[];
}

export interface StatusData {
  academic_year?: string;
  total_count?: number;
  aggregatedStats?: {
    titulairesPercent?: number;
    enseignantsChercheursPercent?: number;
    totalTitulaires?: number;
    totalEnseignantsChercheurs?: number;
    totalEcTitulaires?: number;
    ecTitulairesPercent?: number;
    nonTitulairesPercent?: number;
    totalNonTitulaires?: number;
  };
  disciplines?: Array<{
    field_id?: string;
    field_label?: string;
    total_count?: number;
    titulaires?: number;
    titulaires_percent?: number;
    non_titulaires?: number;
    enseignants_chercheurs?: number;
    enseignants_chercheurs_percent?: number;
    non_enseignants_chercheurs?: number;
    ec_titulaires?: number;
  }>;
}

export interface AgeDistributionData {
  year: string;
  fieldId: string;
  fieldLabel: string;
  totalCount: number;
  ageDistribution: Array<{
    ageClass: string;
    count: number;
    percent: number;
  }>;
}

export interface AgeClass {
  ageClass: string;
  count: number;
  percent: number;
}

export interface CnuSectionsTableProps {
  cnuSections: CNUSection[];
  showDiscipline?: boolean;
  showGroup?: boolean;
  showAgeDemographics?: boolean;
}

export interface FieldSimple {
  fieldId: string;
  fieldLabel: string;
}

export interface NormalizedDiscipline extends DemographicData {
  fieldId: string;
  fieldLabel: string;
}

export interface AgeGroup {
  count: number;
  percent: number | string;
}

export interface AgeDistribution {
  younger_35?: AgeGroup;
  middle_36_55?: AgeGroup;
  older_56?: AgeGroup;
}

export interface CnuGroupsTableProps {
  cnuGroups: CNUGroup[];
  showAgeDemographics?: boolean;
}

export interface AgeClassEvolutionData {
  counts: number[];
  percents: number[];
}

export interface DisciplineAgeEvolution {
  fieldId: string;
  fieldLabel: string;
  ageData: {
    [ageClass: string]: AgeClassEvolutionData;
  };
}

export interface AgeEvolutionData {
  years: string[];
  ageEvolution: {
    [disciplineId: string]: DisciplineAgeEvolution;
  };
}

export interface AgeEvolutionChartProps {
  ageEvolutionData: AgeEvolutionData;
  disciplineId?: string;
  isLoading: boolean;
}

export interface DisciplineTrend {
  fieldId: string;
  fieldLabel: string;
  totalCount: number[];
  femmes_percent: number[];
  titulaires_percent: number[];
  enseignants_chercheurs_percent: number[];
}

export interface GlobalTrend {
  totalCount: number[];
  femmes_percent: number[];
  hommes_percent: number[];
  titulaires_percent: number[];
  enseignants_chercheurs_percent: number[];
}

export interface StatusEvolutionData {
  years: string[];
  globalTrend: GlobalTrend;
  disciplinesTrend: {
    [disciplineId: string]: DisciplineTrend;
  };
}

export interface StatusEvolutionChartProps {
  evolutionData: StatusEvolutionData;
  disciplineId?: string;
  isLoading: boolean;
}

export interface AggregatedStats {
  titulairesPercent?: number;
  enseignantsChercheursPercent?: number;
  nonTitulairesPercent?: number;
  ecTitulairesPercent?: number;
  totalTitulaires?: number;
  totalEnseignantsChercheurs?: number;
  totalNonTitulaires?: number;
  totalEcTitulaires?: number;
}

export interface DisciplineStatusSummaryProps {
  aggregatedStats?: AggregatedStats;
  fields?: Array<{
    field_id?: string;
    field_label?: string;
    total_count?: number;
    titulaires?: number;
    titulaires_percent?: number;
    non_titulaires?: number;
    enseignants_chercheurs?: number;
    enseignants_chercheurs_percent?: number;
    non_enseignants_chercheurs?: number;
    ec_titulaires?: number;
  }>;
  isSingleDiscipline?: boolean;
  totalCount?: number;
}

export interface AgeDistributionChartProps {
  ageData: AgeDistributionData[];
  isLoading: boolean;
  year: string;
  forcedSelectedField?: string;
}
export interface CnuGroupsChartProps {
  cnuGroups: CNUGroup[];
}
export interface EstablishmentData {
  establishmentTypes: Array<{
    type: string;
    totalCount: number;
  }>;
}

export interface EstablishmentTypeChartProps {
  establishmentData: EstablishmentData;
  isLoading: boolean;
  year: string;
}
