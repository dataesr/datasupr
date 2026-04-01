const { VITE_APP_SERVER_URL } = import.meta.env;

export interface ErcEntityData {
  name: string;
  acronym: string | null;
  total_fund_eur: number;
}

export interface ErcMainEntitiesData {
  total_fund_eur: number;
  list: ErcEntityData[];
}

export async function getData(params: string): Promise<ErcMainEntitiesData> {
  if (!params) return { total_fund_eur: 0, list: [] };
  return fetch(`${VITE_APP_SERVER_URL}/european-projects/erc/main-entities?${params}`).then((r) => r.json());
}
