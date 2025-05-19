import { Title } from "@dataesr/dsfr-plus";
import { DisciplineStatusSummaryProps } from "../../../types";
import "./styles.scss";

const DisciplineStatusSummary: React.FC<DisciplineStatusSummaryProps> = ({
  aggregatedStats,
  fields,
  isSingleDiscipline = false,
}) => {
  if (!fields || fields.length === 0) return null;

  const statusItems = [
    {
      label: "Titulaires",
      percent: aggregatedStats?.titulairesPercent || 0,
      count: aggregatedStats?.totalTitulaires,
      color: "var(--blue-cumulus-sun-368)",
      icon: "ri-shield-check-line",
    },
    {
      label: "Enseignants-chercheurs",
      percent: aggregatedStats?.enseignantsChercheursPercent || 0,
      count: aggregatedStats?.totalEnseignantsChercheurs,
      color: "var(--pink-tuile-sun-425)",
      icon: "ri-book-open-line",
    },
    {
      label: "Non titulaires",
      percent: aggregatedStats?.nonTitulairesPercent || 0,
      count:
        aggregatedStats?.totalNonTitulaires ||
        aggregatedStats?.nonTitulairesPercent,
      color: "var(--beige-gris-galet-sun-407)",
      icon: "ri-user-line",
    },
  ].filter((item) => item.percent > 0);

  return (
    <div className="sidebar-status-summary fr-p-2w ">
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
    </div>
  );
};

export default DisciplineStatusSummary;
