const { VITE_APP_SERVER_URL } = import.meta.env;

export interface PanelFundingItem {
  panel_id: string;
  panel_name: string;
  panel_lib: string;
  domaine_scientifique: string;
  domaine_name_scientifique: string;
  destination_code: string;
  destination_name_en: string;
  total_funding_entity: number;
  total_pi: number;
}

export async function getData(params: string): Promise<PanelFundingItem[]> {
  if (params === "") {
    return [];
  }

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/erc/synthesis-by-panel?${params}`).then((response) => response.json());
}
