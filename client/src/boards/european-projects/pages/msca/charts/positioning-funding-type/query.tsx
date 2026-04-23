const { VITE_APP_SERVER_URL } = import.meta.env;

export interface CountryData {
  country_code: string;
  country_name_fr: string;
  country_name_en: string;
  total_funding_project: number;
  total_funding_entity: number;
  total_involved: number;
  total_pi: number;
}

export interface SynthesisData {
  total_funding_project: number;
  total_funding_entity: number;
  total_involved: number;
  total_pi: number;
  countries: CountryData[];
}

export interface PositioningByFundingTypeData {
  destination_code: string;
  destination_name_en: string;
  successful: SynthesisData | null;
  evaluated: SynthesisData | null;
}
[];

export async function getData(params: string): Promise<PositioningByFundingTypeData[]> {
  if (params === "") {
    return [];
  }

  // On récupère les données sans filtre pays pour avoir tous les pays
  const baseParams = params
    .split("&")
    .filter((p) => !p.startsWith("country_code="))
    .join("&");

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/msca/synthesis-by-destination?${baseParams}`).then((response) => response.json());
}
