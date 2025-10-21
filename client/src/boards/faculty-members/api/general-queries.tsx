import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
const { VITE_APP_SERVER_URL } = import.meta.env;

export const useFacultyMembersYears = () => {
  const [searchParams] = useSearchParams();
  const structure_id = searchParams.get("structure_id");
  const field_id = searchParams.get("field_id");
  const geo_id = searchParams.get("geo_id");

  const queryKey = [
    "faculty-members-years",
    { structure_id, field_id, geo_id },
  ];

  return useQuery({
    queryKey,
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members/filters/years`;

      const params = new URLSearchParams();
      if (structure_id) params.append("structure_id", structure_id);
      if (field_id) params.append("field_id", field_id);
      if (geo_id) params.append("geo_id", geo_id);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des années");
      }
      return response.json();
    },
  });
};
