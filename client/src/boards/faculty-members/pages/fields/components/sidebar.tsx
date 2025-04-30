import React from "react";
import { Col, Badge } from "@dataesr/dsfr-plus";

type DisciplineData = {
  fieldId: string;
  fieldLabel: string;
  maleCount: number;
  femaleCount: number;
  unknownCount: number;
  totalCount: number;
};

interface DisciplineStatsSidebarProps {
  disciplinesData: DisciplineData[];
}

const DisciplineStatsSidebar: React.FC<DisciplineStatsSidebarProps> = ({
  disciplinesData,
}) => {
  if (!disciplinesData || disciplinesData.length === 0) {
    return <Col md={4}>Aucune donnée disponible</Col>;
  }

  return (
    <Col>
      <div className=" fr-card--no-border ">
        <div
          className="fr-card--shadow "
          style={{
            borderTopLeftRadius: "10px",
            borderBottomRightRadius: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span className="fr-icon-user-line " aria-hidden="true"></span>
            <span className="fr-text--sm">Effectif total</span>

            <span style={{ fontWeight: "bold", color: "#000091" }}>
              {" "}
              {disciplinesData
                .reduce((sum, field) => sum + field.totalCount, 0)
                .toLocaleString()}
            </span>
          </div>

          <div className="fr-mb-3w">
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
                      (disciplinesData.reduce(
                        (sum, field) => sum + field.femaleCount,
                        0
                      ) /
                        disciplinesData.reduce(
                          (sum, field) => sum + field.totalCount,
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
                      (disciplinesData.reduce(
                        (sum, field) => sum + field.maleCount,
                        0
                      ) /
                        disciplinesData.reduce(
                          (sum, field) => sum + field.totalCount,
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
        <div className="fr-mb-3w">
          <div className="fr-grid-row fr-mb-1w ">
            <div className="fr-col">
              <span
                className="fr-icon-award-line fr-icon--sm fr-mr-1w"
                aria-hidden="true"
              ></span>
              <span className="fr-text--bold  fr-text--sm ">
                Top 3 des disciplines
              </span>
            </div>
          </div>
          <div className="fr-mb-3w">
            <div className="fr-card fr-card--no-border">
              {disciplinesData.slice(0, 3).map((d, i) => {
                const relativeWidth = Math.round(
                  (d.totalCount / disciplinesData[0].totalCount) * 100
                );
                const colors = ["#e9be00", "#c0c0c0", "#cd7f32"];
                return (
                  <div key={d.fieldId} className="fr-mb-2w">
                    <div className="fr-grid-row fr-grid-row--middle text-center">
                      <div className="fr-col-10">
                        <div
                          className="fr-text--bold"
                          style={{
                            color: colors[i],
                            textShadow: "0px 0px 1px rgba(0,0,0,0.2)",
                          }}
                        >
                          {d.fieldLabel}
                        </div>
                        <div className="fr-text--xs fr-mb-1w">
                          {d.totalCount.toLocaleString()} enseignants
                          <br />{" "}
                          {Math.round((d.femaleCount / d.totalCount) * 100)}% de
                          femmes
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "10px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "5px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${relativeWidth}%`,
                              background: `linear-gradient(90deg, ${colors[i]} 0%, rgba(255,255,255,0.7) 100%)`,
                              borderRadius: "5px 0 0 5px",
                              transition: "width 0.5s ease",
                            }}
                            role="progressbar"
                            aria-valuenow={relativeWidth}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                      </div>
                      <div className="fr-col-2 fr-text--right">
                        <Badge
                          className="fr-badge fr-badge--sm"
                          style={{
                            backgroundColor: colors[i],
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        >
                          {Math.round(
                            (d.totalCount /
                              disciplinesData.reduce(
                                (sum, f) => sum + f.totalCount,
                                0
                              )) *
                              100
                          )}
                          %
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className=" fr-p-2w fr-mb-1w">
          <div>
            <div className="fr-mb-1w">
              <span className="fr-text--bold fr-text--sm fr-ml-1w">
                Taux de féminisation
              </span>
            </div>
          </div>
          {disciplinesData.slice(0, 3).map((d) => {
            const femRate = Math.round((d.femaleCount / d.totalCount) * 100);
            return (
              <div key={d.fieldId} className="fr-mb-1w">
                <div className="fr-text--xs fr-mb-0">
                  {d.fieldLabel.substring(0, 20)}
                  {d.fieldLabel.length > 20 ? "..." : ""}
                </div>
                <div className="fr-grid-row fr-grid-row--middle">
                  <div className="fr-col-10">
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "3px",
                        overflow: "hidden",
                        marginBottom: "0",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${femRate}%`,
                          backgroundColor: femRate > 50 ? "#e1000f" : "#000091",
                          borderRadius: "3px 0 0 3px",
                          transition: "width 0.5s ease",
                        }}
                        role="progressbar"
                        aria-valuenow={femRate}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                  <div className="fr-text--right">
                    <span className="fr-text--bold">{femRate}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Col>
  );
};

export default DisciplineStatsSidebar;
