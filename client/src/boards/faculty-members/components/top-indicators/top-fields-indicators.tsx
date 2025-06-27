import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../utils";
import { formatToPercent } from "../../../../utils/format";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { useTopIndicators } from "./use-top-indicators";

const TopItemsIndicators: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId } = useContextDetection();

  const {
    data: structureGenderData,
    isLoading,
    error,
  } = useTopIndicators({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const itemsData = useMemo(() => {
    if (contextId || !structureGenderData || !selectedYear) return [];

    const distributionData = structureGenderData.gender_distribution;

    if (!distributionData) return [];

    return distributionData
      .map((item) => {
        const totalCount = item.total_count;
        let maleCount = 0;
        let femaleCount = 0;

        item.gender_breakdown?.forEach((genderData) => {
          if (genderData.gender === "Masculin") {
            maleCount = genderData.count;
          } else if (genderData.gender === "Féminin") {
            femaleCount = genderData.count;
          }
        });

        return {
          item_id: item._id.structure_code,
          itemLabel: item._id.structure_name,
          maleCount,
          femaleCount,
          totalCount,
        };
      })
      .sort((a, b) => b.totalCount - a.totalCount);
  }, [structureGenderData, selectedYear, contextId]);

  if (contextId) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <DefaultSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <span className="fr-text--sm fr-text--red">
          Erreur lors du chargement des données
        </span>
      </div>
    );
  }

  if (!itemsData || itemsData.length === 0) {
    return (
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <span className="fr-text--sm">
          Aucune donnée disponible pour l'année {selectedYear}
        </span>
      </div>
    );
  }

  const totalAllItems = itemsData.reduce((sum, d) => sum + d.totalCount, 0);

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <div className="fr-text--sm">Top 3 des établissements</div>
        <div className="fr-text--xs fr-text--grey">
          Année universitaire {selectedYear}
        </div>
      </div>

      {itemsData.slice(0, 3).map((item, index) => {
        const femalePercent = Math.round(
          ((item.femaleCount || 0) / (item.totalCount || 1)) * 100
        );

        return (
          <div
            key={item.item_id}
            style={{
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: index < 2 ? "1px solid #ddd" : "none",
            }}
          >
            <div className="fr-text--sm fr-text--bold">{item.itemLabel}</div>
            <div className="fr-text--xs fr-text--grey">
              {item.totalCount.toLocaleString()} enseignants
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "var(--women-color, #e18b76)",
                  }}
                >
                  {formatToPercent(femalePercent)}
                </span>
                <div className="fr-text--xs">Femmes</div>
              </div>
              <div style={{ textAlign: "center", flex: 1 }}>
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "var(--men-color, #efcb3a)",
                  }}
                >
                  {formatToPercent(100 - femalePercent)}
                </span>
                <div className="fr-text--xs">Hommes</div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="fr-text--xs fr-text--grey">
        Total: {totalAllItems.toLocaleString()} enseignants
      </div>
    </div>
  );
};

export default TopItemsIndicators;
