import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useFinanceEtablissementEvolution } from "../../api";

const { VITE_APP_SERVER_URL } = import.meta.env;

interface MultipleStructuresResponse {
  hasMultiples: boolean;
  count: number;
  etablissements: Array<{
    etablissement_id_paysage: string;
    etablissement_lib: string;
    etablissement_id_paysage_actuel: string;
    etablissement_actuel_lib: string;
    type: string;
    typologie: string;
    exercice: number;
    date_de_creation?: string;
    date_de_fermeture?: string;
    effectif_sans_cpge?: number;
    anuniv: string;
  }>;
}

interface CheckExistsResponse {
  exists: boolean;
  etablissement_id_paysage?: string;
  etablissement_lib?: string;
  etablissement_lib_historique?: string;
  etablissementActuel?: {
    etablissement_id_paysage: string;
    etablissement_id_paysage_actuel: string;
    etablissement_lib: string;
    etablissement_actuel_lib: string;
  } | null;
}

export const useCheckMultipleStructures = (
  id?: string,
  annee?: string,
  enabled = true
) => {
  return useQuery<MultipleStructuresResponse>({
    queryKey: ["finance", "check-multiples", id ?? null, annee ?? null],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/etablissements/${id}/check-multiples${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la vérification des établissements multiples"
        );
      }
      return response.json();
    },
    enabled: enabled && Boolean(id),
  });
};

export const useFinanceStructureDetail = (
  id?: string,
  annee?: string,
  enabled = true,
  useHistorical = false
) => {
  return useQuery({
    queryKey: [
      "finance",
      "etab-detail",
      id ?? null,
      annee ?? null,
      useHistorical,
    ],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      if (useHistorical) sp.append("useHistorical", "true");
      const url = `${VITE_APP_SERVER_URL}/structures-finance/etablissements/${id}/detail${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération du détail de l'établissement"
        );
      }
      return response.json();
    },
    enabled: enabled && Boolean(id),
  });
};

export const useCheckStructureExists = (
  id?: string,
  annee?: string,
  enabled = true
) => {
  return useQuery<CheckExistsResponse>({
    queryKey: ["finance", "check-exists", id ?? null, annee ?? null],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/etablissements/${id}/check-exists${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la vérification de l'établissement");
      }
      return response.json();
    },
    enabled: enabled && Boolean(id) && Boolean(annee),
  });
};

export const useMetricEvolution = (metricKey: string) => {
  const [searchParams] = useSearchParams();
  const etablissementId = searchParams.get("structureId") || "";
  const selectedYear = searchParams.get("year") || "";

  const { data: evolutionData } = useFinanceEtablissementEvolution(
    etablissementId,
    !!etablissementId
  );

  return useMemo(() => {
    if (!evolutionData || evolutionData.length === 0) return undefined;

    const currentStructureId = String(etablissementId || "").trim();
    const filteredData = evolutionData.filter((item: any) => {
      if (!currentStructureId) return true;
      return (
        String(item.etablissement_id_paysage || "").trim() ===
        currentStructureId
      );
    });

    const uniqueByExercice = new Map();
    filteredData.forEach((item: any) => {
      const key = item.exercice || item.anuniv;
      if (!uniqueByExercice.has(key)) uniqueByExercice.set(key, item);
    });

    const yearNum = selectedYear ? Number(selectedYear) : null;
    return Array.from(uniqueByExercice.values())
      .sort((a: any, b: any) => Number(a.exercice) - Number(b.exercice))
      .filter((item: any) => !yearNum || Number(item.exercice) <= yearNum)
      .map((item: any) => ({
        exercice: Number(item.exercice),
        anuniv: item.anuniv,
        value: Number(item[metricKey]),
        sanfin_source: item.sanfin_source,
      }))
      .filter((item: any) => item.value != null && !isNaN(item.value));
  }, [evolutionData, metricKey, selectedYear, etablissementId]);
};
