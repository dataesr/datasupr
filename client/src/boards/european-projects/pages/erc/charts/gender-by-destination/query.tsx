const { VITE_APP_SERVER_URL } = import.meta.env;

export interface GenderCount {
  gender: "female" | "male" | "non binary";
  count: number;
}

export interface GenderByDestinationItem {
  destination_code: string;
  genders: GenderCount[];
  total: number;
}

export interface GenderByDestinationData {
  byDestination: GenderByDestinationItem[];
  total: GenderCount[];
}

export async function getData(params: string): Promise<GenderByDestinationData> {
  if (!params) return { byDestination: [], total: [] };
  return fetch(`${VITE_APP_SERVER_URL}/european-projects/erc/gender-by-destination?${params}`).then((r) => r.json());
}
