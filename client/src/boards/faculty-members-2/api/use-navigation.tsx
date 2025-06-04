import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

interface NavigationItem {
  id: string;
  name: string;
  type?: string;
  region?: string;
  total_count: number;
}

interface NavigationResponse {
  type: string;
  year: string;
  items: NavigationItem[];
  total_items: number;
}

interface UseNavigationParams {
  type: "fields" | "regions" | "structures";
  year?: string;
  enabled?: boolean;
}

export const useNavigation = ({ type, year }: UseNavigationParams) => {
  return useQuery({
    queryKey: ["faculty-navigation", type, year || "current"],
    queryFn: async (): Promise<NavigationResponse> => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);

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
