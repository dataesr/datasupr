import { Title } from "@dataesr/dsfr-plus";
import "./styles.scss";
import useFacultyMembersByStatus from "../api/use-by-status";

interface DisciplineStatusSummaryProps {
  selectedYear: string;
  isSingleDiscipline?: boolean;
  field_id?: string;
}

const DisciplineStatusSummary: React.FC<DisciplineStatusSummaryProps> = ({
  selectedYear,
  isSingleDiscipline = false,
  field_id,
}) => {
  const {
    data: statusData,
    isLoading,
    error,
  } = useFacultyMembersByStatus(selectedYear, field_id);

  if (isLoading) {
    return (
      <div className="sidebar-status-summary fr-p-2w">
        <div className="fr-text--center fr-text--xs">
          Chargement des statuts...
        </div>
      </div>
    );
  }

  if (error || !statusData || statusData.length === 0) {
    return (
      <div className="sidebar-status-summary fr-p-2w">
        <div className="fr-text--center fr-text--xs">
          Aucune donnée de statut disponible
        </div>
      </div>
    );
  }

  // Récupérer les données pour l'année sélectionnée
  const yearData = statusData.find((data) => data.year === selectedYear);

  if (!yearData || !yearData.disciplines || yearData.disciplines.length === 0) {
    return (
      <div className="sidebar-status-summary fr-p-2w">
        <div className="fr-text--center fr-text--xs">
          Aucune donnée disponible pour {selectedYear}
        </div>
      </div>
    );
  }

  const { aggregatedStats, disciplines: fields } = yearData;

  const statusItems = [
    {
      label: "Titulaires",
      percent: Math.round(aggregatedStats?.titulairesPercent || 0),
      count: aggregatedStats?.totalTitulaires,
      color: "var(--blue-cumulus-sun-368)",
      icon: "ri-shield-check-line",
    },
    {
      label: "Enseignants-chercheurs",
      percent: Math.round(aggregatedStats?.enseignantsChercheursPercent || 0),
      count: aggregatedStats?.totalEnseignantsChercheurs,
      color: "var(--pink-tuile-sun-425)",
      icon: "ri-book-open-line",
    },
    {
      label: "Non titulaires",
      percent: Math.round(aggregatedStats?.nonTitulairesPercent || 0),
      count: aggregatedStats?.totalNonTitulaires,
      color: "var(--beige-gris-galet-sun-407)",
      icon: "ri-user-line",
    },
  ].filter((item) => item.percent > 0);

  return (
    <div className="sidebar-status-summary fr-p-2w">
      {!isSingleDiscipline && (
        <Title as="h3" look="h6" className="fr-mb-1w">
          Résumé des statuts
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

      {isSingleDiscipline && fields.length > 0 && (
        <div className="fr-mt-2w fr-text--xs fr-text--mention-grey">
          Données basées sur {yearData.totalCount?.toLocaleString() || 0}{" "}
          enseignants
        </div>
      )}
    </div>
  );
};

export default DisciplineStatusSummary;
