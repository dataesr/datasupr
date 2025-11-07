import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../utils";
import { useTopIndicators } from "./use-top-indicators";
import { formatToPercent } from "../../../../utils/format";
import { Row, Title } from "@dataesr/dsfr-plus";

const TopItemsIndicators: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId } = useContextDetection();
  const {
    data: genderData,
    isLoading,
    error,
  } = useTopIndicators({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const word =
    context === "fields"
      ? "disciplines"
      : context === "geo"
      ? "régions"
      : "structures";

  const itemsData = useMemo(() => {
    if (contextId || !genderData || !selectedYear) return [];
    const distributionData = genderData.gender_distribution;
    if (!distributionData) return [];

    return distributionData
      .map((item) => {
        const totalCount = item.total_count;
        let maleCount = 0,
          femaleCount = 0;
        item.gender_breakdown?.forEach((genderData) => {
          if (genderData.gender === "Masculin") maleCount = genderData.count;
          else if (genderData.gender === "Féminin")
            femaleCount = genderData.count;
        });

        let itemIdField = "",
          itemLabelField = "";
        switch (context) {
          case "fields":
            itemIdField = "field_code";
            itemLabelField = "field_name";
            break;
          case "structures":
            itemIdField = "structure_code";
            itemLabelField = "structure_name";
            break;
          case "geo":
            itemIdField = "geo_code";
            itemLabelField = "geo_name";
            break;
          default:
            throw new Error(`Contexte inconnu : ${context}`);
        }

        return {
          item_id: item._id[itemIdField],
          itemLabel: item._id[itemLabelField],
          maleCount,
          femaleCount,
          totalCount,
        };
      })
      .sort((a, b) => b.totalCount - a.totalCount);
  }, [genderData, selectedYear, contextId, context]);

  if (contextId || isLoading || error || !itemsData || itemsData.length === 0)
    return null;

  return (
    <div
      style={{
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "220px",
      }}
    >
      <div style={{ flex: 1 }}>
        <Row horizontalAlign="center">
          <Title as="h3" look="h5">
            Top 3 {word}
          </Title>
        </Row>

        {itemsData.slice(0, 3).map((item) => {
          const femalePercent = Math.round(
            ((item.femaleCount || 0) / (item.totalCount || 1)) * 100
          );
          const malePercent = 100 - femalePercent;
          const truncatedName =
            item.itemLabel.length > 20
              ? item.itemLabel.substring(0, 30) + "..."
              : item.itemLabel;

          return (
            <div key={item.item_id}>
              <div
                style={{
                  textAlign: "center",
                  margin: 0,
                  padding: 0,
                  lineHeight: "1.2",
                }}
                className="fr-text--sm fr-text--bold"
              >
                {truncatedName}
              </div>
              <div
                style={{
                  textAlign: "center",
                  margin: 0,
                  padding: 0,
                }}
                className="fr-text--xs fr-text--grey"
              >
                {item.totalCount.toLocaleString()} ens.
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: 0,
                  padding: 0,
                }}
              >
                <div
                  style={{
                    height: "8px",
                    display: "flex",
                    borderRadius: "3px",
                    overflow: "hidden",
                    flex: 1,
                    margin: 0,
                  }}
                >
                  <div
                    style={{
                      width: `${femalePercent}%`,
                      backgroundColor: "var(--women-color, #e18b76)",
                      height: "100%",
                    }}
                  ></div>
                  <div
                    style={{
                      width: `${malePercent}%`,
                      backgroundColor: "var(--men-color, #efcb3a)",
                      height: "100%",
                    }}
                  ></div>
                </div>
              </div>
              <div
                className="fr-text--xs text-center"
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "var(--women-color, #e18b76)" }}>
                  {formatToPercent(femalePercent)}
                </span>
                {" / "}
                <span style={{ color: "var(--men-color, #efcb3a)" }}>
                  {formatToPercent(malePercent)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopItemsIndicators;
