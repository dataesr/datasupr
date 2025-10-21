import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

const { VITE_APP_SERVER_URL } = import.meta.env;

interface NavigationItem {
  region_name: ReactNode;
  id: string;
  name: string;
  type?: string;
  region?: string;
  total_count: number;
  status?: string;
  is_active?: boolean;
  latest_year?: string;
}

interface NavigationResponse {
  type: string;
  annee_universitaire: string;
  items: NavigationItem[];
  total_items: number;
}

interface UseNavigationParams {
  type: "fields" | "regions" | "structures" | "academies";
  annee_universitaire: string;
  enabled?: boolean;
}

export const useNavigation = ({
  type,
  annee_universitaire,
}: UseNavigationParams) => {
  return useQuery({
    queryKey: ["faculty-navigation", type],
    queryFn: async (): Promise<NavigationResponse> => {
      const params = new URLSearchParams();
      if (annee_universitaire)
        params.append("annee_universitaire", annee_universitaire);

      const url = `${VITE_APP_SERVER_URL}/faculty-members/navigation/${type}${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
  });
};

export type { NavigationItem, NavigationResponse };
