import { Col, Badge } from "@dataesr/dsfr-plus";
import { TopFieldsIndicatorsProps } from "../types";

const TopFieldsIndicators: React.FC<TopFieldsIndicatorsProps> = ({
  disciplinesData,
}) => {
  if (!disciplinesData || disciplinesData.length === 0) {
    return <Col md={4}>Aucune donnée disponible</Col>;
  }

  return (
    <Col>
      <div className="fr-mb-3w">
        <div className="fr-card fr-card--no-border">
          {disciplinesData.slice(0, 3).map((d, i) => {
            const relativeWidth = Math.round(
              d.totalCount && disciplinesData[0].totalCount
                ? (d.totalCount / disciplinesData[0].totalCount) * 100
                : 0
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
                      {d.totalCount?.toLocaleString() || 0} enseignants
                      <br />{" "}
                      {Math.round(
                        ((d.femaleCount || 0) / (d.totalCount || 1)) * 100
                      )}
                      % de femmes
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
                        ((d.totalCount || 0) /
                          disciplinesData.reduce(
                            (sum, f) => sum + (f.totalCount || 0),
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
    </Col>
  );
};

export default TopFieldsIndicators;
