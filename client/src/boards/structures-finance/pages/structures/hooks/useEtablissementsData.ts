import { useMemo } from "react";
import { useFinanceEtablissements } from "../../../api";

/**
 * Hook pour récupérer et dédupliquer les établissements
 */
export function useEtablissementsData(selectedYear: string | number) {
  const { data: etablissementsData, isLoading } = useFinanceEtablissements(
    String(selectedYear),
    !!selectedYear
  );

  const allEtablissements = useMemo(() => {
    if (!etablissementsData) return [];

    let etabs = Array.isArray(etablissementsData)
      ? etablissementsData
      : etablissementsData.data || etablissementsData.etablissements || [];

    const totalBefore = etabs.length;

    // Dédupliquer par établissement actuel
    const etabsMap = new Map();
    etabs.forEach((etab: any) => {
      const currentId =
        etab.etablissement_id_paysage_actuel ||
        etab.etablissement_id_paysage ||
        etab.id;
      if (!currentId) return;

      const existing = etabsMap.get(currentId);
      if (
        !existing ||
        etab.etablissement_id_paysage === etab.etablissement_id_paysage_actuel
      ) {
        etabsMap.set(currentId, etab);
      }
    });

    etabs = Array.from(etabsMap.values());

    console.log(
      `Établissements dédupliqués: ${totalBefore} -> ${etabs.length} (par établissement actuel)`,
      `Exemple:`,
      etabs[0]
    );

    return etabs;
  }, [etablissementsData]);

  return {
    allEtablissements,
    isLoading,
  };
}
