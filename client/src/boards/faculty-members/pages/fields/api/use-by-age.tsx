import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersAgeDistribution = (selectedYear?: string) => {
  return useQuery({
    queryKey: ["faculty-age-distribution", selectedYear],
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members-age-distribution`;

      if (selectedYear) {
        const params = new URLSearchParams();
        params.append("annee", selectedYear);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erreur ${response.status} lors de la récupération de la distribution par âge: ${errorData}`
        );
      }

      const data = await response.json();

      return data;
    },
    enabled: true,
  });
};

export default useFacultyMembersAgeDistribution;
