import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;
const useFacultyMembersByUniversity = (
  universityId?: string,
  selectedYear?: string
) => {
  return useQuery({
    queryKey: ["faculty-members-university", universityId, selectedYear],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (universityId && universityId.trim() !== "") {
        params.append("university_id", universityId);
        console.log("Paramètre university_id ajouté:", universityId);
      }

      if (selectedYear && selectedYear.trim() !== "") {
        params.append("year", selectedYear);
      }

      const baseUrl = `${VITE_APP_SERVER_URL}/faculty-members-overview-university-data`;
      const url = params.toString()
        ? `${baseUrl}?${params.toString()}`
        : baseUrl;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données universitaires"
        );
      }

      const data = await response.json();
      return data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};

export default useFacultyMembersByUniversity;
