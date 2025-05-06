import React from "react";

type StructureData = {
  man_count: number;
  woman_count: number;
  unknow_count: number;
  total_headcount: number;
};

interface StructureProps {
  structureData: StructureData[];
}

const GeneralIndicatorsCard: React.FC<StructureProps> = ({
  structureData,
}) => {
  if (!structureData || structureData.length === 0) {
    return <Col md={4}>Aucune donnée disponible</Col>;
  }

  return (
      <div className=" fr-card--no-border">
        <div
          className="fr-card--shadow fr-mb-2w"
          style={{
            borderTopLeftRadius: "30px",
            borderBottomRightRadius: "30px",
            padding: "3px",
          }}
        >
          <div className="fr-mt-2w" style={{ textAlign: "center" }}>
            <span className="fr-icon-user-line " aria-hidden="true"></span>
            <span className="fr-text--sm">Effectif total</span>

            <span style={{ fontWeight: "bold", color: "#000091" }}>
              {" "}
              {structureData
                .reduce((sum, item) => sum + item.total_headcount, 0)
                .toLocaleString()}
            </span>
          </div>

          <div className="fr-mb-3w fr-mx-2w">
            <div className="fr-grid-row fr-mb-1w text-center">
              <div className="fr-col">
                <span
                  className="fr-icon-team-line fr-icon--sm fr-mr-1w"
                  aria-hidden="true"
                ></span>
                <span className="fr-text--bold fr-text--sm">
                  Répartition Femme / Homme
                </span>
              </div>
            </div>
            <div className="fr-grid-row fr-mb-1w">
              <div className="fr-col-6">
                <div
                  style={{
                    borderLeft: "4px solid #e1000f",
                    paddingLeft: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  <span className="fr-text--lg fr-text--bold">
                    {Math.round(
                      (structureData.reduce(
                        (sum, item) => sum + item.woman_count,
                        0
                      ) /
                        structureData.reduce(
                          (sum, item) => sum + item.total_headcount,
                          0
                        )) *
                        100
                    )}
                    %
                  </span>
                  <div className="fr-text--xs">Femmes</div>
                </div>
              </div>
              <div className="fr-col-6">
                <div
                  style={{
                    borderLeft: "4px solid #000091",
                    paddingLeft: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  <span className="fr-text--lg fr-text--bold">
                    {Math.round(
                      (structureData.reduce(
                        (sum, item) => sum + item.man_count,
                        0
                      ) /
                        structureData.reduce(
                          (sum, item) => sum + item.total_headcount,
                          0
                        )) *
                        100
                    )}
                    %
                  </span>
                  <div className="fr-text--xs">Hommes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default GeneralIndicatorsCard;
