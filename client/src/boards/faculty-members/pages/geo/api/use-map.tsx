import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export interface RegionMapData {
  geo_id: string;
  geo_nom: string;
  total_count: number;
  male_count: number;
  female_count: number;
  male_percent: number;
  female_percent: number;
}

export interface MapStatistics {
  total_count: number;
  regions_count: number;
  max_region_count: number;
  p25: number;
  p50: number;
  p75: number;
}

export interface GeoMapResponse {
  regions: RegionMapData[];
  statistics: MapStatistics;
  annee_universitaire: string;
}

interface UseGeoMapDataParams {
  annee_universitaire: string;
}
export const useGeoMapData = ({ annee_universitaire }: UseGeoMapDataParams) => {
  return useQuery<GeoMapResponse>({
    queryKey: ["faculty-members", "geo", "map", annee_universitaire],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (annee_universitaire)
        params.append("annee_universitaire", annee_universitaire);

      const response = await fetch(
        `${VITE_APP_SERVER_URL}/faculty-members/geo/map-data?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  });
};
