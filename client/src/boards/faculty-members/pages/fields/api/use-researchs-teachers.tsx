import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersResearchsTeachers = (
  selectedYear?: string,
  fieldId?: string
) => {
  return useQuery({
    queryKey: ["faculty-researchs-teachers", selectedYear, fieldId],
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members-research-teachers-by-fields`;
      const params = new URLSearchParams();

      if (selectedYear) {
        params.append("annee", selectedYear);
      }

      if (fieldId) {
        params.append("fieldId", fieldId);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erreur ${response.status} lors de la récupération des données enseignants-chercheurs: ${errorData}`
        );
      }

      const data = await response.json();
      return data;
    },
    enabled: true,
  });
};

export default useFacultyMembersResearchsTeachers;
