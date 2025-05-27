import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersByStatus = (selectedYear?: string, fieldId?: string) => {
  return useQuery({
    queryKey: ["faculty-fields-status", selectedYear, fieldId],
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members-fields-status`;

      const params = new URLSearchParams();
      if (selectedYear) {
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
  });
};

export const useLatestFacultyMembersByStatus = () => {
  const query = useFacultyMembersByStatus();

  const latestData =
    query.data && query.data.length > 0 ? query.data[0] : undefined;

  return {
    ...query,
    data: latestData,
  };
};

export default useFacultyMembersByStatus;
