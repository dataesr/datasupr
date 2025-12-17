import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

interface UseResearchTeachersParams {
  annee_universitaire?: string;
  contextId?: string;
  context?: "fields" | "geo" | "structures";
}

export const useFacultyMembersResearchTeachers = ({
  annee_universitaire,
  contextId,
  context = "fields",
}: UseResearchTeachersParams) => {
  return useQuery({
    queryKey: [
      "faculty-members-research-teachers",
      context,
      annee_universitaire,
      contextId,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (annee_universitaire)
        params.append("annee_universitaire", annee_universitaire);

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

      const endpoint = `${VITE_APP_SERVER_URL}/faculty-members/${context}/research-teachers`;
      const url = params.toString() ? `${endpoint}?${params}` : endpoint;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!context,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
