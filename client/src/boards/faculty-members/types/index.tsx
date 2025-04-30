export interface FieldData {
  year: string;
  fieldId: string;
  fieldLabel: string;
  maleCount: number;
  femaleCount: number;
  unknownCount: number;
  totalCount: number;
  cnuGroups?: CNUGroup[];
}

export interface CNUSection {
  cnuSectionId: string;
  cnuSectionLabel: string;
  maleCount: number;
  femaleCount: number;
  unknownCount: number;
  totalCount: number;
  cnuGroupId: string;
  cnuGroupLabel: string;
  fieldId: string;
  fieldLabel: string;
  cnuGroups?: CNUGroup[];
}

export interface CNUGroup {
  cnuGroupId: string;
  cnuGroupLabel: string;
  maleCount: number;
  femaleCount: number;
  unknownCount: number;
  totalCount: number;
  fieldId: string;
  fieldLabel: string;
  cnuSections: CNUSection[];
}
export interface DisciplineData {
  fieldId: string;
  fieldLabel: string;
  maleCount: number;
  femaleCount: number;
  unknownCount: number;
  totalCount: number;
}

export interface RegionPoint {
  name: string;
  "hc-key": string;
  geo_id: string;
  value: number;
  totalCount: number;
  maleCount: number;
  femaleCount: number;
  malePercent: number;
  femalePercent: number;
}

export interface RegionMapPoint extends Highcharts.Point {
  name: string;
  options: RegionPoint;
  geo_id?: string;
  totalCount?: number;
  maleCount?: number;
  femaleCount?: number;
  malePercent?: number;
  femalePercent?: number;
}

interface Region {
  geo_id: string;
  geo_nom: string;
}

export interface FacultyFranceMapProps {
  availableGeos: Region[];
}

export interface FieldData {
  year: string;
  academic_year?: string;
  fieldId: string;
  field_id?: string;
  fieldLabel: string;
  field_label?: string;
  maleCount: number;
  femaleCount: number;
  unknownCount: number;
  totalCount: number;
  total_count?: number;
  cnuGroups?: CNUGroup[];
  headcount_per_cnu_group?: [];
}

export interface DisciplineStatus {
  titulaires: {
    count: number;
    percent: number;
  };
  nonTitulaires: {
    count: number;
    percent: number;
  };
  enseignantsChercheurs: {
    count: number;
    percent: number;
  };
  nonEnseignantsChercheurs: {
    count: number;
    percent: number;
  };
  ecTitulaires: {
    count: number;
    percent: number;
  };
}

export interface FieldsFlat {
  field_id: string;
  field_label: string;
  total_count: number;
  titulaires: number;
  non_titulaires: number;
  titulaires_percent: number;
  enseignants_chercheurs: number;
  non_enseignants_chercheurs: number;
  enseignants_chercheurs_percent: number;
  ec_titulaires: number;
}

export interface Field {
  fieldId?: string;
  field_id?: string;
  fieldLabel?: string;
  field_label?: string;
  totalCount?: number;
  total_count?: number;

  status?: DisciplineStatus;

  titulaires?: number;
  non_titulaires?: number;
  titulaires_percent?: number;
  enseignants_chercheurs?: number;
  non_enseignants_chercheurs?: number;
  enseignants_chercheurs_percent?: number;
  ec_titulaires?: number;
}

export interface AggregatedStats {
  totalTitulaires: number;
  totalEnseignantsChercheurs: number;
  totalEcTitulaires: number;
  titulairesPercent: number;
  enseignantsChercheursPercent: number;
  ecTitulairesPercent: number;
  nonTitulairesPercent: number;
  totalNonTitulaires: number;
}

export interface FieldsStatusData {
  year?: string;
  academic_year?: string;
  totalCount?: number;
  total_count?: number;
  disciplines?: Field[];
  fields?: Field[];
  aggregatedStats?: AggregatedStats;
  last_updated?: Date;
}

export interface DisciplineStatusSummaryProps {
  totalCount: number;
  aggregatedStats?: AggregatedStats;
  fields: Field[];
  isSingleDiscipline?: boolean;
}
