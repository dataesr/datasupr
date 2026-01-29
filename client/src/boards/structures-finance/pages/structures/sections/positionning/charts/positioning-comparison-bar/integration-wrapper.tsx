import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useFinanceAdvancedComparison,
  useFinanceStructureDetail,
} from "../../../../../../api/api";
import { usePositioningFilteredData } from "../../hooks/usePositioningFilteredData";
import { FilterMode } from "../../components/positioning-filters";
import PositioningComparisonBarChart from "./index";
import DefaultSkeleton from "../../../../../../../../components/charts-skeletons/default";

export default function PositioningComparisonBarIntegrationWrapper() {
  const [searchParams] = useSearchParams();

  const structureId = searchParams.get("structureId") || "";
  const selectedYear = searchParams.get("year") || "";
  const filterMode = (searchParams.get("filter") as FilterMode) || "all";

  const { data: comparisonData, isLoading: isLoadingComparison } =
    useFinanceAdvancedComparison(
      {
        annee: String(selectedYear),
        type: "",
        typologie: "",
        region: "",
      },
      !!selectedYear
    );

  const { data: structureData, isLoading: isLoadingStructure } =
    useFinanceStructureDetail(
      structureId,
      String(selectedYear),
      !!structureId && !!selectedYear,
      false
    );

  const allItems = useMemo(() => {
    if (!comparisonData || !comparisonData.items) return [];
    return comparisonData.items;
  }, [comparisonData]);

  const filteredItems = usePositioningFilteredData(
    allItems,
    structureData,
    filterMode
  );

  if (isLoadingComparison || isLoadingStructure) {
    return <DefaultSkeleton height="400px" />;
  }

  if (!structureData) {
    return (
      <div className="fr-alert fr-alert--warning">
        <p className="fr-alert__title">Établissement non trouvé</p>
        <p>Aucune donnée disponible pour cet établissement.</p>
      </div>
    );
  }

  const structureName =
    structureData?.etablissement_actuel_lib ||
    structureData?.etablissement_lib ||
    "l'établissement";

  return (
    <PositioningComparisonBarChart
      data={filteredItems}
      currentStructureId={structureData?.etablissement_id_paysage_actuel}
      currentStructureName={structureName}
      selectedYear={String(selectedYear)}
    />
  );
}
