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
  year: string;
}

interface UseGeoMapDataParams {
  year: string;
}
export const useGeoMapData = ({ year }: UseGeoMapDataParams) => {
  return useQuery<GeoMapResponse>({
    queryKey: ["faculty-members", "geo", "map", year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);

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
