import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../utils";
import { formatToPercent } from "../../../../utils/format";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { useTopIndicators } from "./use-top-indicators";
import { Title, Text, Row, Col } from "@dataesr/dsfr-plus";

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

  let word = "";

  switch (context) {
    case "fields":
      word = "disciplines";
      break;
    case "geo":
      word = "régions";
      break;
    case "structures":
      word = "structures";
      break;
  }

  const itemsData = useMemo(() => {
    if (contextId || !genderData || !selectedYear) return [];

    const distributionData = genderData.gender_distribution;

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

        let itemIdField = "";
        let itemLabelField = "";

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

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "px",
      }}
    >
      <Row horizontalAlign="center">
        <Title as="h3" look="h6">
          Top 3 des {word}
          <Text
            className="fr-text--sm fr-text--regular"
            style={{
              marginBottom: "0px",
            }}
          >
            Année universitaire {selectedYear}
          </Text>
        </Title>
      </Row>

      {itemsData.slice(0, 3).map((item) => {
        const femalePercent = Math.round(
          ((item.femaleCount || 0) / (item.totalCount || 1)) * 100
        );

        return (
          <div
            key={item.item_id}
            style={{
              marginBottom: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <Row horizontalAlign="center" className="fr-text--sm fr-text--bold">
              {item.itemLabel}
            </Row>
            <Row
              horizontalAlign="center"
              className="fr-text--xs fr-text--grey fr-mb-1w"
            >
              {item.totalCount.toLocaleString()} enseignants
            </Row>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Col
                className="fr-py-2w"
                style={{
                  textAlign: "center",
                  flex: 1,
                  borderRight: "1px solid #ddd",
                }}
              >
                <Row
                  horizontalAlign="center"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "var(--women-color, #e18b76)",
                  }}
                >
                  {formatToPercent(femalePercent)}
                </Row>
                <Row horizontalAlign="center" className="fr-text--xs">
                  Femmes
                </Row>
              </Col>
              <Col
                className="fr-py-2w"
                style={{ textAlign: "center", flex: 1 }}
              >
                <Row
                  horizontalAlign="center"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "var(--men-color, #efcb3a)",
                  }}
                >
                  {formatToPercent(100 - femalePercent)}
                </Row>
                <Row horizontalAlign="center" className="fr-text--xs">
                  Hommes
                </Row>
              </Col>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopItemsIndicators;
