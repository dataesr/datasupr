import { Col } from "@dataesr/dsfr-plus";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { DemographicData } from "../pages/geo/types";

const GeneralIndicatorsCard = ({
  structureData,
}: {
  structureData: DemographicData[];
}) => {
  const { fieldId } = useParams<{ fieldId: string }>();

  const filteredData = useMemo(() => {
    if (!structureData || structureData.length === 0) return [];

    if (fieldId) {
      return structureData.filter((item) => item.fieldId === fieldId);
    }

    return structureData;
  }, [structureData, fieldId]);

  if (!filteredData.length) {
    return <Col md={4}>Aucune donnée disponible pour cette discipline</Col>;
  }

  const totalCount = filteredData.reduce(
    (sum, item) => sum + item.totalCount,
    0
  );
  const femaleCount = filteredData.reduce(
    (sum, item) => sum + item.femaleCount,
    0
  );
  const maleCount = filteredData.reduce((sum, item) => sum + item.maleCount, 0);
  const femalePercent = totalCount
    ? Math.round((femaleCount / totalCount) * 100)
    : 0;
  const malePercent = totalCount
    ? Math.round((maleCount / totalCount) * 100)
    : 0;

  return (
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
          <span className="fr-text--sm">Effectif total</span>

          <span style={{ fontWeight: "bold" }}>
            {" "}
            {totalCount.toLocaleString()}
          </span>
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
  );
};

export default GeneralIndicatorsCard;
