import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useFinanceEtablissementEvolution } from "../../../../../../api/api";
import { RenderData } from "./render-data";

interface SanteFinanciereTableauProps {
  data?: any;
}

export default function SanteFinanciereTableau({
  data: propData,
}: SanteFinanciereTableauProps) {
  const [searchParams] = useSearchParams();
  const etablissementId = searchParams.get("structureId") || "";

  const { data: evolutionData } = useFinanceEtablissementEvolution(
    etablissementId,
    !!etablissementId
  );

  const allYearsData = useMemo(() => {
    if (!evolutionData || evolutionData.length === 0) return [];
    return [...evolutionData]
      .sort((a: any, b: any) => Number(b.exercice) - Number(a.exercice))
      .slice(0, 5)
      .reverse();
  }, [evolutionData]);

  const data = useMemo(() => {
    if (propData) return propData;
    return null;
  }, [propData]);

  const showResultatHorsSie =
    data?.resultat_net_comptable != null &&
    data?.resultat_net_comptable_hors_sie != null &&
    data.resultat_net_comptable !== data.resultat_net_comptable_hors_sie;

  if (!allYearsData || allYearsData.length === 0) return null;

  return (
    <div className="fr-mb-4w">
      <RenderData
        yearsData={allYearsData}
        showResultatHorsSie={showResultatHorsSie}
      />
    </div>
  );
}
