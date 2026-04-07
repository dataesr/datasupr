const { VITE_APP_SERVER_URL } = import.meta.env;

export interface GenderDomainItem {
  group: string;
  domain: string;
  genders: { gender: string; count: number }[];
  total: number;
}

export interface GenderByDomainData {
  byGroup: GenderDomainItem[];
}

export async function getData(params: string): Promise<GenderByDomainData> {
  if (!params) return { byGroup: [] };
  return fetch(`${VITE_APP_SERVER_URL}/european-projects/erc/gender-by-domain?${params}`).then((r) => r.json());
}
