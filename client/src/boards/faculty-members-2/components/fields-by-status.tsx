import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Title } from "@dataesr/dsfr-plus";
import "./styles.scss";
import { useFacultyMembersOverview } from "../api/use-overview";
import { useContextDetection } from "../utils";

interface StatusSummaryProps {
  isSingleItem?: boolean;
}

const StatusSummary: React.FC<StatusSummaryProps> = ({
  isSingleItem = false,
}) => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("year") || "";
  const { context, contextId } = useContextDetection();

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

    let statusDistribution;
    switch (context) {
      case "fields":
        statusDistribution = overviewData.disciplineStatusDistribution;
        break;
      case "geo":
        statusDistribution = overviewData.regionStatusDistribution;
        break;
      case "structures":
        statusDistribution = overviewData.structureStatusDistribution;
        break;
      default:
        return null;
    }

    if (!statusDistribution) return null;

    if (contextId) {
      // Cas spécifique : une discipline/région/structure sélectionnée
      const selectedItem = statusDistribution.find((item) => {
        switch (context) {
          case "fields":
            return item._id.discipline_code === contextId;
          case "geo":
            return item._id.geo_code === contextId;
          case "structures":
            return item._id.structure_code === contextId;
          default:
            return false;
        }
      });

      if (!selectedItem) return null;

      let enseignantsChercheurs = 0;
      let titulairesNonChercheurs = 0;
      let nonTitulaires = 0;

      selectedItem.status_breakdown?.forEach((status) => {
        switch (status.status) {
          case "enseignant_chercheur":
            enseignantsChercheurs = status.count;
            break;
          case "titulaire_non_chercheur":
            titulairesNonChercheurs = status.count;
            break;
          case "non_titulaire":
            nonTitulaires = status.count;
            break;
        }
      });

      const totalTitulaires = enseignantsChercheurs + titulairesNonChercheurs;
      const totalCount = selectedItem.total_count;

      let itemName;
      switch (context) {
        case "fields":
          itemName = selectedItem._id.discipline_name;
          break;
        case "geo":
          itemName = selectedItem._id.geo_name;
          break;
        case "structures":
          itemName = selectedItem._id.structure_name;
          break;
        default:
          itemName = null;
      }

      return {
        totalCount,
        totalTitulaires,
        totalEnseignantsChercheurs: enseignantsChercheurs,
        totalNonTitulaires: nonTitulaires,
        titulairesPercent:
          totalCount > 0 ? (totalTitulaires / totalCount) * 100 : 0,
        enseignantsChercheursPercent:
          totalCount > 0 ? (enseignantsChercheurs / totalCount) * 100 : 0,
        nonTitulairesPercent:
          totalCount > 0 ? (nonTitulaires / totalCount) * 100 : 0,
        itemName,
      };
    } else {
      // Cas global : toutes les disciplines/régions/structures
      let totalEnseignantsChercheurs = 0;
      let totalTitulairesNonChercheurs = 0;
      let totalNonTitulaires = 0;
      let totalCount = 0;

      statusDistribution.forEach((item) => {
        totalCount += item.total_count;

        item.status_breakdown?.forEach((status) => {
          switch (status.status) {
            case "enseignant_chercheur":
              totalEnseignantsChercheurs += status.count;
              break;
            case "titulaire_non_chercheur":
              totalTitulairesNonChercheurs += status.count;
              break;
            case "non_titulaire":
              totalNonTitulaires += status.count;
              break;
          }
        });
      });

      const totalTitulaires =
        totalEnseignantsChercheurs + totalTitulairesNonChercheurs;

      return {
        totalCount,
        totalTitulaires,
        totalEnseignantsChercheurs,
        totalNonTitulaires,
        titulairesPercent:
          totalCount > 0 ? (totalTitulaires / totalCount) * 100 : 0,
        enseignantsChercheursPercent:
          totalCount > 0 ? (totalEnseignantsChercheurs / totalCount) * 100 : 0,
        nonTitulairesPercent:
          totalCount > 0 ? (totalNonTitulaires / totalCount) * 100 : 0,
        itemName: null,
      };
    }
  }, [overviewData, contextId, context]);

  const getLabels = () => {
    const labels = {
      fields: {
        singular: "discipline",
        plural: "disciplines",
        article: "cette",
        preposition: "pour",
      },
      geo: {
        singular: "région",
        plural: "régions",
        article: "cette",
        preposition: "pour",
      },
      structures: {
        singular: "établissement",
        plural: "établissements",
        article: "cet",
        preposition: "pour",
      },
    };
    return labels[context];
  };

  const labels = getLabels();

  if (isLoading) {
    return (
      <div className="sidebar-status-summary fr-p-2w">
        <div className="fr-text--center fr-text--xs">
          Chargement des statuts...
        </div>
      </div>
    );
  }

  if (error || !processedData) {
    return (
      <div className="sidebar-status-summary fr-p-2w">
        <div className="fr-text--center fr-text--xs">
          Aucune donnée de statut disponible
          {contextId &&
            ` ${labels.preposition} ${labels.article} ${labels.singular}`}
        </div>
      </div>
    );
  }

  const statusItems = [
    {
      label: "Titulaires",
      percent: Math.round(processedData.titulairesPercent || 0),
      count: processedData.totalTitulaires,
      color: "var(--blue-cumulus-sun-368)",
      icon: "ri-shield-check-line",
    },
    {
      label: "Enseignants-chercheurs",
      percent: Math.round(processedData.enseignantsChercheursPercent || 0),
      count: processedData.totalEnseignantsChercheurs,
      color: "var(--pink-tuile-sun-425)",
      icon: "ri-book-open-line",
    },
    {
      label: "Non titulaires",
      percent: Math.round(processedData.nonTitulairesPercent || 0),
      count: processedData.totalNonTitulaires,
      color: "var(--beige-gris-galet-sun-407)",
      icon: "ri-user-line",
    },
  ].filter((item) => item.percent > 0);

  return (
    <div className="sidebar-status-summary fr-p-2w">
      {!isSingleItem && (
        <Title as="h3" look="h6" className="fr-mb-1w">
          Résumé des statuts
          {processedData.itemName && (
            <div className="fr-text--xs fr-text--mention-grey fr-mt-1v">
              {processedData.itemName}
            </div>
          )}
        </Title>
      )}

      <div className="sidebar-status-items">
        {statusItems.map((item, index) => (
          <div className="sidebar-status-item" key={index}>
            <div
              className="status-icon"
              style={{ backgroundColor: item.color }}
            >
              <i className={item.icon} aria-hidden="true"></i>
            </div>

            <div className="status-info">
              <div className="status-label">
                <div className="fr-text--xs">{item.label}</div>
                <div className="fr-text--bold">{item.percent}%</div>
              </div>
              {item.count !== undefined && (
                <div className="fr-text--xs fr-text--mention-grey">
                  {item.count.toLocaleString()} personnes
                </div>
              )}

              <div className="status-progress-container">
                <div
                  className="status-progress"
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fr-mt-2w fr-text--xs fr-text--mention-grey">
        Total: {processedData.totalCount?.toLocaleString() || 0} enseignants
        <br />
        Année universitaire {selectedYear}
        {processedData.itemName && (
          <>
            <br />
            {labels.singular.charAt(0).toUpperCase() + labels.singular.slice(1)}
            : {processedData.itemName}
          </>
        )}
      </div>
    </div>
  );
};

export default StatusSummary;
