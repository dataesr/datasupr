import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

type EvolutionContext = "fields" | "geo" | "structures";

interface UseEvolutionParams {
  context: EvolutionContext;
  contextId?: string;
}

export const useFacultyMembersEvolution = ({
  context,
  contextId,
}: UseEvolutionParams) => {
  return useQuery({
    queryKey: ["faculty-members-evolution", context, contextId],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (contextId) {
        switch (context) {
          case "fields":
            params.append("field_id", contextId);
            break;
          case "geo":
            params.append("geo_id", contextId);
            break;
          case "structures":
            params.append("structure_id", contextId);
            break;
        }
      }

      const endpoint = `${VITE_APP_SERVER_URL}/faculty-members/${context}/evolution`;
      const url = params.toString() ? `${endpoint}?${params}` : endpoint;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!context,
  });
};

export interface EvolutionData {
  context_info?: {
    id: string;
    name: string;
    type: "discipline" | "region" | "structure";
  };
  years: string[];
  global_evolution: Array<{
    _id: string;
    total_count: number;
    gender_breakdown: Array<{
      gender: string;
      count: number;
    }>;
  }>;
  status_evolution: Array<{
    _id: string;
    status_breakdown: Array<{
      status: string;
      count: number;
    }>;
  }>;
  age_evolution: Array<{
    _id: string;
    total_count: number;
    age_breakdown: Array<{
      age_class: string;
      count: number;
    }>;
  }>;
  discipline_evolution?: Array<{
    _id: {
      year: string;
      discipline_code: string;
      discipline_name: string;
    };
    total_count: number;
    gender_breakdown: Array<{
      gender: string;
      count: number;
    }>;
  }>;
  region_evolution?: Array<{
    _id: {
      year: string;
      region_code: string;
      region_name: string;
    };
    total_count: number;
    gender_breakdown: Array<{
      gender: string;
      count: number;
    }>;
  }>;
  structure_evolution?: Array<{
    _id: {
      year: string;
      structure_id: string;
      structure_name: string;
    };
    total_count: number;
    gender_breakdown: Array<{
      gender: string;
      count: number;
    }>;
  }>;
}
