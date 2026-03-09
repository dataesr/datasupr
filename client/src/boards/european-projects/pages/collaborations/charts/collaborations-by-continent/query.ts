const { VITE_APP_SERVER_URL } = import.meta.env;

export type CollaborationData = {
  country_code: string;
  country_name_fr: string;
  country_name_en: string;
  total_collaborations: number;
  total_amount: number;
  by_year: { year: string; count: number }[];
};

export async function getCollaborations(params: string): Promise<CollaborationData[]> {
  if (params === "") {
    return [];
  }

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/collaborations/get-collaborations?${params}`).then((response) => response.json());
}
