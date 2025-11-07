import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../utils";

const VITE_APP_SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

interface DataCompletenessResponse {
  has_non_permanent_staff: boolean;
  non_permanent_count: number;
  annee_universitaire: string;
  context: {
    field_id?: string;
    geo_id?: string;
    structure_id?: string;
  };
}

export function useDataCompleteness() {
  const [searchParams] = useSearchParams();

  const anneeUniversitaire = searchParams.get("annee_universitaire");
  const fieldId = searchParams.get("field_id");
  const geoId = searchParams.get("geo_id");
  const structureId = searchParams.get("structure_id");

  const queryParams = new URLSearchParams();
  if (anneeUniversitaire)
    queryParams.set("annee_universitaire", anneeUniversitaire);
  if (fieldId) queryParams.set("field_id", fieldId);
  if (geoId) queryParams.set("geo_id", geoId);
  if (structureId) queryParams.set("structure_id", structureId);

  const { data, isLoading, error } = useQuery<DataCompletenessResponse>({
    queryKey: [
      "faculty-members/data-completeness",
      anneeUniversitaire,
      fieldId,
      geoId,
      structureId,
    ],
    queryFn: async () => {
      const response = await fetch(
        `${VITE_APP_SERVER_URL}/faculty-members/data-completeness?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data completeness");
      }
      return response.json();
    },
    enabled: !!anneeUniversitaire,
  });

  return {
    hasNonPermanentStaff: data?.has_non_permanent_staff ?? false,
    isLoading,
    error,
  };
}

export function useHasHistoricalNonPermanents() {
  const { context, contextId } = useContextDetection();

  const queryParams = new URLSearchParams();
  if (contextId) {
    if (context === "fields") queryParams.set("field_id", contextId);
    else if (context === "geo") queryParams.set("geo_id", contextId);
    else if (context === "structures")
      queryParams.set("structure_id", contextId);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["faculty-members/evolution", context, contextId],
    queryFn: async () => {
      if (!context) return null;

      const endpoints = {
        fields: "/faculty-members/fields/evolution",
        geo: "/faculty-members/geo/evolution",
        structures: "/faculty-members/structures/evolution",
      };

      const response = await fetch(
        `${VITE_APP_SERVER_URL}${endpoints[context]}?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch evolution data");
      }

      return response.json();
    },
    enabled: !!context,
  });

  const hasHistoricalNonPermanents =
    data?.status_evolution?.some((yearData: any) =>
      yearData.status_breakdown?.some(
        (s: any) => s.status === "non_titulaire" && s.count > 0
      )
    ) ?? false;

  return {
    hasHistoricalNonPermanents,
    isLoading,
  };
}
