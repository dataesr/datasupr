const { VITE_APP_SERVER_URL } = import.meta.env;

export interface TreemapData {
  name: string;
  value: number;
  color?: string;
}

export async function getData(params: string): Promise<TreemapData[]> {
  if (params === "") return [];
  const data = await fetch(`${VITE_APP_SERVER_URL}/european-projects/msca/synthesis-by-panel?${params}`).then((r) => r.json());
  return data.map((panel: any) => ({
    name: panel.panel_name,
    value: panel.successful?.total_funding_project || 0,
    color: undefined, // or assign colors based on panel
  }));
}
