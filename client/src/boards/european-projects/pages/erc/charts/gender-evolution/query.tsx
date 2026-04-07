const { VITE_APP_SERVER_URL } = import.meta.env;

export interface GenderYearItem {
  call_year: string;
  genders: { gender: string; count: number }[];
  total: number;
}

export interface GenderEvolutionData {
  years: GenderYearItem[];
}

export async function getData(params: string): Promise<GenderEvolutionData> {
  if (!params) return { years: [] };
  return fetch(`${VITE_APP_SERVER_URL}/european-projects/erc/gender-evolution?${params}`).then((r) => r.json());
}
