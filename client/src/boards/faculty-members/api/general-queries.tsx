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
      const url = new URL(
        `${VITE_APP_SERVER_URL}/faculty-members/filters/years`
      );

      if (structure_id) url.searchParams.append("structure_id", structure_id);
      if (field_id) url.searchParams.append("field_id", field_id);
      if (geo_id) url.searchParams.append("geo_id", geo_id);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des années");
      }
      return response.json();
    },
  });
};
