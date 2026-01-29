import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useFinanceAdvancedComparison,
  useFinanceStructureDetail,
} from "../../../../../../api/api";
import { usePositioningFilteredData } from "../../hooks/usePositioningFilteredData";
import { FilterMode } from "../../components/positioning-filters";
import PositioningScatterChart from "./index";
import DefaultSkeleton from "../../../../../../../../components/charts-skeletons/default";

export default function PositioningScatterIntegrationWrapper() {
  const [searchParams] = useSearchParams();

  const structureId = searchParams.get("structureId") || "";
  const selectedYear = searchParams.get("year") || "";
  const xMetric =
    searchParams.get("xMetric") || "produits_de_fonctionnement_encaissables";
  const yMetric = searchParams.get("yMetric") || "effectif_sans_cpge";
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

  const config = useMemo(() => {
    const metricLabels: Record<
      string,
      { xLabel: string; yLabel: string; title: string }
    > = {
      produits_de_fonctionnement_encaissables_effectif_sans_cpge: {
        xLabel: "Produits de fonctionnement encaissables (€)",
        yLabel: "Effectif étudiants (sans CPGE)",
        title: `Produits de fonctionnement encaissables vs Effectifs d'étudiants${selectedYear ? ` — ${selectedYear}` : ""}`,
      },
      scsp_par_etudiants_taux_encadrement: {
        xLabel: "SCSP par étudiant (€)",
        yLabel: "Taux d'encadrement (ETPT/étudiant)",
        title: `SCSP par étudiant vs Taux d'encadrement${selectedYear ? ` — ${selectedYear}` : ""}`,
      },
      scsp_ressources_propres: {
        xLabel: "SCSP (€)",
        yLabel: "Ressources propres (€)",
        title: `SCSP vs Ressources propres${selectedYear ? ` — ${selectedYear}` : ""}`,
      },
    };

    const key = `${xMetric}_${yMetric}`;
    const labels = metricLabels[key] || {
      xLabel: xMetric,
      yLabel: yMetric,
      title: `${xMetric} vs ${yMetric}${selectedYear ? ` — ${selectedYear}` : ""}`,
    };

    return {
      title: labels.title,
      xMetric,
      yMetric,
      xLabel: labels.xLabel,
      yLabel: labels.yLabel,
    };
  }, [xMetric, yMetric, selectedYear]);

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
    <PositioningScatterChart
      config={config}
      data={filteredItems}
      currentStructureId={structureData?.etablissement_id_paysage_actuel}
      currentStructureName={structureName}
    />
  );
}
