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
