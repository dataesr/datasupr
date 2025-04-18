import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersByFields = (
  selectedYear?: string,
  getAllYears: boolean = false,
  fieldId?: string
) => {
  return useQuery({
    queryKey: ["faculty-fields", selectedYear, getAllYears, fieldId],
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members-overview-fields-data`;

      const params = new URLSearchParams();

      if (!getAllYears && selectedYear) {
        params.append("annee", selectedYear);
      }

      if (fieldId) {
        params.append("fieldId", fieldId);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données par discipline"
        );
      }

      const data = await response.json();

      return data;
    },
    enabled: true,
  });
};

export default useFacultyMembersByFields;
