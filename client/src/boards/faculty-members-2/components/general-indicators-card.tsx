import { useSearchParams, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useFacultyMembersOverview } from "../api/use-overview";
import { generateContextualTitle } from "../utils";

const GeneralIndicatorsCard = () => {
  const [searchParams] = useSearchParams();
  const { geo_id, id, field_id: paramFieldId } = useParams();
  const selectedYear = searchParams.get("year") || "";

  const field_id = searchParams.get("field_id") || paramFieldId;
  const geo_id_param = searchParams.get("geo_id") || geo_id;
  const structure_id = searchParams.get("structure_id") || id;

  const { context, contextId, contextName } = useMemo(() => {
    if (field_id) {
      return {
        context: "fields" as const,
        contextId: field_id,
        contextName: "discipline",
      };
    } else if (geo_id_param) {
      return {
        context: "geo" as const,
        contextId: geo_id_param,
        contextName: "région",
      };
    } else if (structure_id) {
      return {
        context: "structures" as const,
        contextId: structure_id,
        contextName: "établissement",
      };
    } else {
      return {
        context: "fields" as const,
        contextId: undefined,
        contextName: "global",
      };
    }
  }, [field_id, geo_id_param, structure_id]);

  const {
    data: overviewData,
    isLoading,
    error,
  } = useFacultyMembersOverview({
    context,
    year: selectedYear,
    contextId,
  });

  const processedData = useMemo(() => {
    if (!overviewData) return null;

    if (contextId) {
      let maleCount = 0;
      let femaleCount = 0;

      overviewData.gender_distribution?.forEach((genderData) => {
        if (genderData._id === "Masculin") {
          maleCount = genderData.count;
        } else if (genderData._id === "Féminin") {
          femaleCount = genderData.count;
        }
      });

      return {
        totalCount: overviewData.total_count || 0,
        maleCount,
        femaleCount,
        itemName: overviewData.context_info?.name || contextId,
      };
    } else {
      let maleCount = 0;
      let femaleCount = 0;

      overviewData.gender_distribution?.forEach((genderData) => {
        if (genderData._id === "Masculin") {
          maleCount = genderData.count;
        } else if (genderData._id === "Féminin") {
          femaleCount = genderData.count;
        }
      });

      return {
        totalCount: overviewData.total_count || 0,
        maleCount,
        femaleCount,
        itemName: null,
      };
    }
  }, [overviewData, contextId]);

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
    return generateContextualTitle(
      "Effectif",
      context,
      contextId,
      calculatedData?.itemName
    );
  };

  if (isLoading) {
    return (
      <>
        <div className="fr-card--no-border">
          <div
            className="fr-card--shadow fr-mb-2w"
            style={{
              borderTopLeftRadius: "30px",
              borderBottomRightRadius: "30px",
              padding: "3px",
            }}
          >
            <div className="fr-mt-2w fr-mb-3w" style={{ textAlign: "center" }}>
              <span className="fr-text--sm">Chargement des données...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="fr-card--no-border">
          <div
            className="fr-card--shadow fr-mb-2w"
            style={{
              borderTopLeftRadius: "30px",
              borderBottomRightRadius: "30px",
              padding: "3px",
            }}
          >
            <div className="fr-mt-2w fr-mb-3w" style={{ textAlign: "center" }}>
              <span className="fr-text--sm fr-text--red">
                Erreur lors du chargement
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!calculatedData) {
    return (
      <>
        <div className="fr-card--no-border">
          <div
            className="fr-card--shadow fr-mb-2w"
            style={{
              borderTopLeftRadius: "30px",
              borderBottomRightRadius: "30px",
              padding: "3px",
            }}
          >
            <div className="fr-mt-2w fr-mb-3w" style={{ textAlign: "center" }}>
              <span className="fr-text--sm">
                Aucune donnée disponible
                {contextId && ` pour ce ${contextName}`}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { totalCount, maleCount, femaleCount, malePercent, femalePercent } =
    calculatedData;

  return (
    <>
      <div className="fr-card--no-border">
        <div
          className="fr-card--shadow fr-mb-2w"
          style={{
            borderTopLeftRadius: "30px",
            borderBottomRightRadius: "30px",
            padding: "3px",
          }}
        >
          <div className="fr-mt-2w" style={{ textAlign: "center" }}>
            <span className="fr-icon-user-line" aria-hidden="true"></span>
            <div className="fr-text--sm">{getTitle()}</div>
            <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              {totalCount.toLocaleString()}
            </div>
            {selectedYear && (
              <div className="fr-text--xs fr-text--grey fr-mt-1w">
                Année universitaire {selectedYear}
              </div>
            )}
          </div>

          <div className="fr-mb-3w fr-mx-2w">
            <div className="fr-grid-row fr-mb-1w fr-mt-3w">
              <div className="fr-col-6">
                <div
                  style={{
                    borderLeft: "4px solid var(--women-color, #e18b76)",
                    paddingLeft: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  <span className="fr-text--lg fr-text--bold">
                    {femalePercent}%
                  </span>
                  <div className="fr-text--xs">Femmes</div>
                  <div className="fr-text--xs fr-text--grey">
                    {femaleCount.toLocaleString()} enseignantes
                  </div>
                </div>
              </div>
              <div className="fr-col-6">
                <div
                  style={{
                    borderLeft: "4px solid var(--men-color, #efcb3a)",
                    paddingLeft: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  <span className="fr-text--lg fr-text--bold">
                    {malePercent}%
                  </span>
                  <div className="fr-text--xs">Hommes</div>
                  <div className="fr-text--xs fr-text--grey">
                    {maleCount.toLocaleString()} enseignants
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralIndicatorsCard;
