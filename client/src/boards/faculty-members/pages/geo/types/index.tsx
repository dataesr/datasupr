export interface Region {
  geo_id: string;
  geo_nom: string;
  niveau_geo: string;
}

export interface RegionDemographics extends Region {
  femaleCount: number;
  femalePercent: number;
  maleCount: number;
  malePercent: number;
  totalCount: number;
}

export interface RegionMapPoint extends Highcharts.Point {
  name: string;
  options: {
    "hc-key": string;
    geo_id: string;
    value: number;
    totalCount: number;
    maleCount: number;
    femaleCount: number;
    malePercent: number;
    femalePercent: number;
  };
}

export interface AgeDistributionItem {
  age_class: string;
  headcount: number;
  femaleCount: number;
  maleCount: number;
}

export interface RegionWithAgeData {
  geo_id: string;
  geo_nom: string;
  totalHeadcount: number;
  totalHeadcountWoman: number;
  totalHeadcountMan: number;
  age_distribution: AgeDistributionItem[];
}

export interface ProfessionalCategory {
  id: string;
  label_fr: string;
  headcount: number;
}

export interface Subject {
  id: string;
  label_fr: string;
  headcount: number;
  femaleCount?: number;
  maleCount?: number;
}

export interface YearlyGeoData {
  annee_universitaire: string | number;
  totalHeadcountMan: number;
  totalHeadcountWoman: number;
  totalHeadcountUnknown?: number;
  professional_categories: ProfessionalCategory[];
  subjects: Subject[];
  regions?: RegionDemographics[];
}

export interface GeoDataResponse {
  data?: YearlyGeoData[];
  years?: (string | number)[];
  geos?: Region[];
}

export interface RegionDemographie {
  total: number;
  femmes: {
    nombre: number;
    pourcentage: number;
  };
  hommes: {
    nombre: number;
    pourcentage: number;
  };
}

export interface RegionApiData {
  geo_id: string;
  geo_nom: string;
  annee_universitaire?: string | number;
  totalHeadcountMan?: number;
  totalHeadcountWoman?: number;
  demographie?: RegionDemographie;
  age_distribution: AgeDistributionItem[];
  disciplines?: Subject[];
  categories_professionnelles?: ProfessionalCategory[];
  subjects?: Subject[];
  professional_categories?: ProfessionalCategory[];
}

export interface AgeDistributionByRegionProps {
  regionsData: RegionWithAgeData[];
  year: string;
}

export interface DemographicData {
  id?: string;
  label?: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
  unknownCount?: number;
  fieldId?: string;
}

export interface GenderDistributionProps {
  maleCount: number | undefined;
  femaleCount: number | undefined;
}

export interface SubjectDistributionChartProps {
  subjects: Subject[];
  region: string;
  year?: string;
}

export interface RegionDataResponse {
  data: RegionApiData[];
  years?: (string | number)[];
}
