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
  année_universitaire: string;
  items: NavigationItem[];
  total_items: number;
}

interface UseNavigationParams {
  type: "fields" | "regions" | "structures";
  année_universitaire?: string;
  enabled?: boolean;
}

export const useNavigation = ({
  type,
  année_universitaire,
}: UseNavigationParams) => {
  return useQuery({
    queryKey: ["faculty-navigation", type],
    queryFn: async (): Promise<NavigationResponse> => {
      const params = new URLSearchParams();
      if (année_universitaire) params.append("year", année_universitaire);

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
