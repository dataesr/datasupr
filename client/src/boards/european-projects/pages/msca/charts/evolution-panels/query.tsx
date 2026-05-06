const { VITE_APP_SERVER_URL } = import.meta.env;

export interface EvolutionPanelItem {
  call_year: string;
  panel_id: string;
  panel_name: string;
  total_funding: number;
  total_involved: number;
}

export interface EvolutionPanelData {
  country: {
    successful: EvolutionPanelItem[];
    evaluated: EvolutionPanelItem[];
  };
  total: {
    successful: EvolutionPanelItem[];
    evaluated: EvolutionPanelItem[];
  };
}

export async function getData(params: string): Promise<EvolutionPanelData> {
  if (params === "") {
    return {
      country: { successful: [], evaluated: [] },
      total: { successful: [], evaluated: [] },
    };
  }

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/msca/evolution-by-panel?${params}`).then((response) => response.json());
}
