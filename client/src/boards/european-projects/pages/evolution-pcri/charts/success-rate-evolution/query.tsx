import type { EvolutionDataItem } from "./types";

const { VITE_APP_SERVER_URL } = import.meta.env;

export const getData = async (params: string): Promise<EvolutionDataItem[]> => {
  const response = await fetch(`${VITE_APP_SERVER_URL}//european-projects/evolution-pcri/get-evolution-by-country?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};
