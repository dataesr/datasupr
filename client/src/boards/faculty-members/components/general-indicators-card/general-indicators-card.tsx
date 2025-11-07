import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useContextDetection } from "../../utils";
import { useGeneralIndicators } from "./use-general-indicators";
import { useFacultyMembersResearchTeachers } from "../../api/use-research-teachers";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { formatToPercent } from "../../../../utils/format";
import { Row, Title } from "@dataesr/dsfr-plus";

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
      if (overviewData.cnuGroups?.length) {
        overviewData.cnuGroups.forEach((group) => {
          maleCount += group.maleCount || 0;
          femaleCount += group.femaleCount || 0;
          totalCount += group.totalCount || 0;
        });
      }
    }
    return {
      totalCount,
      maleCount,
      femaleCount,
      itemName: overviewData.context_info?.name || contextId || "Global",
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

  if (isLoading) {
    return (
      <>
        <DefaultSkeleton />
      </>
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
        <Row className="fr-text--sm fr-text--red">
          Erreur lors du chargement des données
        </Row>
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Row horizontalAlign="center">
        <Title as="h3" look="h5">
          Effectif
        </Title>
      </Row>
      <Row horizontalAlign="center" className="fr-text--lead fr-text--bold ">
        {totalCount.toLocaleString()}
      </Row>
      <Row horizontalAlign="center" className="fr-text--sm fr-mb-2w">
        personnels enseignants
      </Row>

      <div style={{ display: "flex" }}>
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
            {formatToPercent(malePercent)}
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
