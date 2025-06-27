import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { generateContextualTitle, useContextDetection } from "../../utils";
import { useGeneralIndicators } from "./use-general-indicators";
import { useFacultyMembersResearchTeachers } from "../../api/use-research-teachers";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { formatToPercent } from "../../../../utils/format";

interface GeneralIndicatorsCardProps {
  type?: "general" | "research-teachers";
}

const GeneralIndicatorsCard: React.FC<GeneralIndicatorsCardProps> = ({
  type = "general",
}) => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const { context, contextId, contextName } = useContextDetection();

  const generalIndicators = useGeneralIndicators({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const researchTeachers = useFacultyMembersResearchTeachers({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const {
    data: overviewData,
    isLoading,
    error,
  } = type === "general" ? generalIndicators : researchTeachers;

  const processedData = useMemo(() => {
    if (!overviewData) return null;

    let maleCount = 0;
    let femaleCount = 0;
    let totalCount = 0;

    if (type === "general") {
      overviewData.gender_distribution?.forEach((genderData) => {
        if (genderData._id === "Masculin") {
          maleCount = genderData.count;
        } else if (genderData._id === "Féminin") {
          femaleCount = genderData.count;
        }
      });
      totalCount = overviewData.total_count || 0;
    } else if (type === "research-teachers") {
      overviewData.cnuGroups?.forEach((group) => {
        maleCount += group.maleCount || 0;
        femaleCount += group.femaleCount || 0;
        totalCount += group.totalCount || 0;
      });
    }

    return {
      totalCount,
      maleCount,
      femaleCount,
      itemName: overviewData.context_info?.name || contextId,
    };
  }, [overviewData, contextId, type]);

  const calculatedData = useMemo(() => {
    if (!processedData) return null;

    const { totalCount, maleCount, femaleCount } = processedData;

    const femalePercent = totalCount
      ? Math.round((femaleCount / totalCount) * 100)
      : 0;
    const malePercent = totalCount
      ? Math.round((maleCount / totalCount) * 100)
      : 0;

    return {
      ...processedData,
      femalePercent,
      malePercent,
    };
  }, [processedData]);

  const getTitle = () => {
    if (type === "research-teachers") {
      return "Enseignants-chercheurs";
    }
    return generateContextualTitle(
      null,
      context,
      contextId,
      overviewData,
      isLoading
    );
  };

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

  if (!calculatedData) {
    return (
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <span className="fr-text--sm">
          Aucune donnée disponible
          {contextId && ` pour ce ${contextName}`}
        </span>
      </div>
    );
  }

  const { totalCount, maleCount, femaleCount, malePercent, femalePercent } =
    calculatedData;

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <div className="fr-text--sm">{getTitle()}</div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginTop: "0.5rem",
          }}
        >
          {totalCount.toLocaleString()}
        </div>
        {selectedYear && (
          <div className="fr-text--xs">Année universitaire {selectedYear}</div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            textAlign: "center",
            flex: 1,
            borderRight: "1px solid #ddd",
            paddingRight: "1rem",
          }}
        >
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
          <div className="fr-text--xs">
            {femaleCount.toLocaleString()} enseignantes
          </div>
        </div>
        <div style={{ textAlign: "center", flex: 1, paddingLeft: "1rem" }}>
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "var(--men-color, #efcb3a)",
            }}
          >
            {malePercent}%
          </span>
          <div className="fr-text--xs">Hommes</div>
          <div className="fr-text--xs">
            {maleCount.toLocaleString()} enseignants
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralIndicatorsCard;
