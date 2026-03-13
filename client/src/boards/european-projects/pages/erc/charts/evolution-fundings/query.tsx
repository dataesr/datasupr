const { VITE_APP_SERVER_URL } = import.meta.env;

export interface EvolutionItem {
  call_year: string;
  destination_code: string;
  destination_name_en: string;
  total_funding_project: number;
  total_involved: number;
  total_pi: number;
}

export interface EvolutionData {
  country: {
    successful: EvolutionItem[];
    evaluated: EvolutionItem[];
  };
  total: {
    successful: EvolutionItem[];
    evaluated: EvolutionItem[];
  };
}

export async function getData(params: string): Promise<EvolutionData> {
  if (params === "") {
    return {
      country: { successful: [], evaluated: [] },
      total: { successful: [], evaluated: [] },
    };
  }

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/erc/evolution?${params}`).then((response) => response.json());
}
