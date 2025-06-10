import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@dataesr/dsfr-plus";
import { useFacultyMembersOverview } from "../api/use-overview";
import { useContextDetection } from "../utils";

const TopItemsIndicators: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("année_universitaire") || "";
  const { context, contextId } = useContextDetection();

  const {
    data: overviewData,
    isLoading,
    error,
  } = useFacultyMembersOverview({
    context,
    année_universitaire: selectedYear,
    contextId,
  });

  const itemsData = useMemo(() => {
    if (contextId || !overviewData || !selectedYear) return [];

    let distributionData;
    switch (context) {
      case "fields":
        distributionData = overviewData.disciplineGenderDistribution;
        break;
      case "geo":
        distributionData = overviewData.regionGenderDistribution;
        break;
      case "structures":
        distributionData = overviewData.structureGenderDistribution;
        break;
      default:
        return [];
    }

    if (!distributionData) return [];

    return distributionData
      .map((item) => {
        let itemCode, itemName;

        switch (context) {
          case "fields":
            itemCode = item._id.discipline_code;
            itemName = item._id.discipline_name;
            break;
          case "geo":
            itemCode = item._id.geo_code;
            itemName = item._id.geo_name;
            break;
          case "structures":
            itemCode = item._id.structure_code;
            itemName = item._id.structure_name;
            break;
          default:
            itemCode = "";
            itemName = "";
        }

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
          item_id: itemCode,
          itemLabel: itemName,
          maleCount,
          femaleCount,
          unknownCount: 0,
          totalCount,
        };
      })
      .sort((a, b) => b.totalCount - a.totalCount);
  }, [overviewData, selectedYear, context, contextId]);

  const totalAllItems = useMemo(() => {
    return itemsData.reduce((sum, d) => sum + d.totalCount, 0);
  }, [itemsData]);

  const getLabels = () => {
    const labels = {
      fields: { singular: "discipline", plural: "disciplines" },
      geo: { singular: "région", plural: "régions" },
      structures: { singular: "établissement", plural: "établissements" },
    };
    return labels[context];
  };

  const labels = getLabels();

  if (contextId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="fr-card fr-card--no-border">
        <div className="fr-text--center fr-py-3w">
          <div className="fr-mb-2w">
            <span
              className="fr-icon-loader-line fr-icon--lg"
              aria-hidden="true"
            ></span>
          </div>
          <div className="fr-text--sm">
            Chargement du top {labels.plural}...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-card fr-card--no-border">
        <div className="fr-text--center fr-py-3w">
          <div className="fr-mb-2w">
            <span
              className="fr-icon-error-line fr-icon--lg fr-text--red"
              aria-hidden="true"
            ></span>
          </div>
          <div className="fr-text--sm fr-text--red">
            Erreur lors du chargement des {labels.plural}
          </div>
        </div>
      </div>
    );
  }

  if (!itemsData || itemsData.length === 0) {
    return (
      <div className="fr-card fr-card--no-border">
        <div className="fr-text--center fr-py-3w">
          <div className="fr-mb-2w">
            <span
              className="fr-icon-information-line fr-icon--lg"
              aria-hidden="true"
            ></span>
          </div>
          <div className="fr-text--sm">
            Aucune donnée disponible pour l'année {selectedYear}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fr-mb-3w">
      <div className="fr-card fr-card--no-border">
        <div className="fr-card__body">
          <div className="fr-card__header">
            <h3 className="fr-card__title fr-text--md">
              Top 3 des {labels.plural}
            </h3>
            <div className="fr-text--xs fr-text--grey">
              Année universitaire {selectedYear}
            </div>
          </div>

          <div className="fr-card__content">
            {itemsData.slice(0, 3).map((item, index) => {
              const relativeWidth = Math.round(
                item.totalCount && itemsData[0].totalCount
                  ? (item.totalCount / itemsData[0].totalCount) * 100
                  : 0
              );

              const femalePercent = Math.round(
                ((item.femaleCount || 0) / (item.totalCount || 1)) * 100
              );

              const itemPercent = Math.round(
                ((item.totalCount || 0) / totalAllItems) * 100
              );

              const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
              const medals = ["🥇", "🥈", "🥉"];

              return (
                <div key={item.item_id} className="fr-mb-2w">
                  <div className="fr-grid-row fr-grid-row--middle">
                    <div className="fr-col-1">
                      <div
                        className="fr-text--lg"
                        style={{ fontSize: "1.2rem" }}
                      >
                        {medals[index]}
                      </div>
                    </div>

                    <div className="fr-col-9">
                      <div
                        className="fr-text--bold fr-text--sm"
                        style={{
                          color: colors[index],
                          textShadow: "0px 0px 1px rgba(0,0,0,0.3)",
                        }}
                      >
                        {item.itemLabel}
                      </div>
                      <div className="fr-text--xs fr-mb-1w fr-text--grey">
                        <strong>
                          {item.totalCount?.toLocaleString() || 0}
                        </strong>{" "}
                        enseignants
                        <br />
                        <span style={{ color: "#e1000f" }}>
                          {femalePercent}% de femmes
                        </span>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "4px",
                          overflow: "hidden",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${relativeWidth}%`,
                            background: `linear-gradient(90deg, ${colors[index]} 0%, ${colors[index]}88 100%)`,
                            borderRadius: "3px 0 0 3px",
                            transition: "width 0.8s ease-out",
                          }}
                          role="progressbar"
                          aria-valuenow={relativeWidth}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${item.itemLabel}: ${relativeWidth}% par rapport au premier ${labels.singular}`}
                        ></div>
                      </div>
                    </div>

                    <div className="fr-col-2 fr-text--right">
                      <Badge
                        className="fr-badge fr-badge--sm"
                        style={{
                          backgroundColor: colors[index],
                          color: index === 0 ? "#000" : "#fff",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                        }}
                      >
                        {itemPercent}%
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="fr-card__footer fr-text--xs fr-text--grey">
            Total: {totalAllItems.toLocaleString()} enseignants
            <br />
            {itemsData.length} {labels.plural} au total
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopItemsIndicators;
