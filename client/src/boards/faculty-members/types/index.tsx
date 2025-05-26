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
export interface GenderInfo {
  total_count: number;
  percent?: number;
  titulaires_percent: number;
  titulaires_count: number;
  enseignants_chercheurs_percent: number;
  enseignants_chercheurs_count: number;
  quotite_distribution?: {
    "Temps plein"?: {
      percent: number;
      count: number;
    };
    [key: string]:
      | {
          percent: number;
          count: number;
        }
      | undefined;
  };
  age_distribution?: {
    [ageRange: string]: {
      percent: number;
      count: number;
    };
  };
}

export interface GenderData {
  hommes: GenderInfo;
  femmes: GenderInfo;
  total_count: number;
}

export interface DisciplineItem {
  discipline: {
    code: string;
    label: string;
  };
  hommes: {
    total_count: number;
  };
  femmes: {
    total_count: number;
  };
  total_count: number;
}

export type GenderDataCardProps = {
  data: GenderData;
  gender: "hommes" | "femmes";
  isLoading: boolean;
  allDisciplines?: DisciplineItem[];
};

export interface CnuSectionsTableProps {
  cnuSections: CNUSection[];
  maxDisplay?: number;
  showDiscipline?: boolean;
  showGroup?: boolean;
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

export interface AgeDistributionChartProps {
  ageData: AgeDistributionData[];
  isLoading: boolean;
  year: string;
  forcedSelectedField?: string;
}
export interface Region {
  geo_id: string;
  geo_nom: string;
  niveau_geo: string;
  femaleCount: number;
  femalePercent: number;
  maleCount: number;
  malePercent: number;
  totalCount: number;
}

export interface GeoData {
  annee_universitaire: number | string;
  totalHeadcountMan: number;
  totalHeadcountWoman: number;
  totalHeadcountUnknown?: number;
  professional_categories?: unknown;
  subjects?: unknown;
  regions?: Region[];
}

export interface GeoDataType {
  data?: GeoData[];
  years?: string[] | number[];
  geos?: Array<{
    niveau_geo: string;
    geo_id: string;
    geo_nom: string;
  }>;
}

export interface GeoStats {
  femaleCount: number;
  femalePercent: number;
  geo_id: string;
  geo_nom: string;
  maleCount: number;
  malePercent: number;
  totalCount: number;
}

export interface AgeDistribution {
  age_class: string;
  headcount: number;
  femaleCount: number;
  maleCount: number;
  femalePercent: number;
  malePercent: number;
}

interface RegionData {
  geo_id: string;
  geo_nom: string;
  totalHeadcount?: number;
  totalHeadcountWoman?: number;
  totalHeadcountMan?: number;
  age_distribution?: {
    age_class: string;
    headcount: number;
    femaleCount: number;
    maleCount: number;
  }[];
}

export interface AgeDistributionByRegionProps {
  regionsData: RegionData[];
  year: string;
}

export interface Subject {
  id: string;
  label_fr: string;
  headcount: number;
  femaleCount?: number;
  maleCount?: number;
  femalePercent?: number;
  malePercent?: number;
}

export interface SubjectDistributionChartProps {
  subjects: Subject[];
  region: string;
  year?: string;
}

export interface Subject {
  id: string;
  label_fr: string;
  headcount: number;
  femaleCount?: number;
  maleCount?: number;
  femalePercent?: number;
  malePercent?: number;
}

export interface ProfessionalCategory {
  id: string;
  label_fr: string;
  headcount: number;
  femaleCount?: number;
  maleCount?: number;
  femalePercent?: number;
  malePercent?: number;
  age_distribution?: AgeClass[];
}

export interface AgeClass {
  age_class: string;
  headcount: number;
  femaleCount?: number;
  maleCount?: number;
  femalePercent?: number;
  malePercent?: number;
}

// export interface RegionData {
//   geo_id: string;
//   geo_nom: string;
//   annee_universitaire: string;
//   totalHeadcountMan: number;
//   totalHeadcountWoman: number;
//   subjects: Subject[];
//   professional_categories: ProfessionalCategory[];
//   age_distribution: AgeClass[];
// }

export interface AgeDistributionRegionData {
  geo_id: string;
  geo_nom: string;
  totalHeadcount: number;
  totalHeadcountWoman: number;
  totalHeadcountMan: number;
  age_distribution: AgeClass[];
  annee_universitaire: string;
  subjects?: Subject[];
  professional_categories: [];
}

export interface Demographie {
  total: number;
  femmes: {
    nombre: number;
    pourcentage: number;
  };
  hommes: {
    nombre: number;
    pourcentage: number;
  };
  non_specifie?: {
    nombre: number;
    pourcentage: number;
  };
}

export interface RegionApiData {
  geo_id: string;
  geo_nom: string;
  annee_universitaire: string;
  demographie: Demographie;
  disciplines: Subject[];
  categories_professionnelles: ProfessionalCategory[];
  age_distribution: AgeClass[];
  totalHeadcountMan: number;
  totalHeadcountWoman: number;
  subjects: Subject[];
  professional_categories: ProfessionalCategory[];
}
