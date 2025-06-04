import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

export const useFacultyMembersFieldsCnu = (
  year?: string,
  field_id?: string
) => {
  return useQuery({
    queryKey: ["faculty-members-fields-cnu", year, field_id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (field_id) params.append("field_id", field_id);

      const url = `${VITE_APP_SERVER_URL}/faculty-members/fields/cnu-analysis${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données CNU disciplines"
        );
      }
      return response.json();
    },
  });
};
