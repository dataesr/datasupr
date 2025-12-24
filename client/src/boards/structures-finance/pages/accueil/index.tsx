import { useNavigate } from "react-router-dom";
import { Row, Col, Button } from "@dataesr/dsfr-plus";
import { useMemo, useState } from "react";
import { useFinanceEtablissements, useFinanceYears } from "../../api";
import "./styles.scss";
import { CHART_COLORS, DSFR_COLORS } from "../../constants/colors";

interface QuickAccessCard {
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  stats?: string;
}

export default function AccueilView() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: yearsData } = useFinanceYears();
  const latestYear = useMemo(
    () => (yearsData?.years || [])[0] || "2024",
    [yearsData]
  );
  const { data: etablissementsData } = useFinanceEtablissements(
    String(latestYear)
  );

  const filteredEtablissements = useMemo(() => {
    if (!etablissementsData || !Array.isArray(etablissementsData)) return [];
    if (!searchTerm.trim()) return [];

    const search = searchTerm.toLowerCase().trim();
    return etablissementsData
      .filter((etab: any) => {
        const nom = etab.nom || "";
        return nom.toLowerCase().includes(search);
      })
      .slice(0, 5);
  }, [etablissementsData, searchTerm]);

  const handleEtablissementSelect = (etablissementId: string) => {
    navigate(
      `/structures-finance/etablissements?year=${latestYear}&type=tous&region=toutes&structureId=${etablissementId}`
    );
    setSearchTerm("");
  };

  const cards: QuickAccessCard[] = [
    {
      title: "Vue nationale",
      description:
        "Analyse globale des données financières des établissements d'enseignement supérieur en France. Visualisez les tendances nationales et les agrégations par type et région.",
      icon: "ri-dashboard-line",
      color: CHART_COLORS.primary,
      path: "/structures-finance/national",
      stats: "Vue d'ensemble et évolution temporelle",
    },
    {
      title: "Structures",
      description:
        "Explorez les données financières détaillées d'un établissement spécifique. Analysez l'évolution temporelle des indicateurs clés et comparez jusqu'à 2 métriques.",
      icon: "ri-building-line",
      color: CHART_COLORS.secondary,
      path: "/structures-finance/etablissements",
      stats: "Analyse individuelle par établissement",
    },
    {
      title: "Comparaisons",
      description:
        "Comparez les performances financières entre établissements. Visualisez les corrélations, les taux d'encadrement et les indicateurs multi-métriques par type ou région.",
      icon: "ri-bar-chart-grouped-line",
      color: CHART_COLORS.tertiary,
      path: "/structures-finance/comparaisons",
      stats: "Comparaisons inter-établissements",
    },
  ];

  return (
    <div className="accueil-view">
      <div className="accueil-header fr-mb-6w">
        <h1 className="fr-h1 fr-mb-2w">
          Tableaux de bord financiers des universités
        </h1>
        <p
          className="fr-text--lead fr-mb-0"
          style={{ color: "var(--text-default-grey)" }}
        >
          Explorez et analysez les données financières des établissements
          d'enseignement supérieur français. Sélectionnez une section pour
          commencer votre analyse.
        </p>
      </div>

      <div
        className="fr-mb-5w fr-p-4w"
        style={{
          backgroundColor: DSFR_COLORS.backgroundDefaultHover,
          borderRadius: "8px",
          border: `2px solid ${CHART_COLORS.secondary}`,
        }}
      >
        <div className="fr-mb-3w">
          <h2
            className="fr-h5 fr-mb-2v"
            style={{
              borderLeft: `4px solid ${CHART_COLORS.secondary}`,
              paddingLeft: "1rem",
            }}
          >
            🔍 Accès rapide à un établissement
          </h2>
          <p
            className="fr-text--sm fr-mb-0"
            style={{
              color: "var(--text-default-grey)",
              paddingLeft: "1.25rem",
            }}
          >
            Recherchez un établissement par nom pour accéder directement à sa
            page détaillée
          </p>
        </div>

        <div style={{ position: "relative" }}>
          <div className="fr-search-bar" role="search">
            <input
              className="fr-input"
              placeholder="Sorbonne, Paris, Lyon, Toulouse..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="fr-btn" title="Rechercher">
              Rechercher
            </button>
          </div>

          {searchTerm && filteredEtablissements.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "var(--background-default-grey)",
                border: "1px solid var(--border-default-grey)",
                borderRadius: "4px",
                marginTop: "0.5rem",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 1000,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              {filteredEtablissements.map((etab: any) => (
                <button
                  key={etab.id}
                  onClick={() => handleEtablissementSelect(etab.id)}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    textAlign: "left",
                    border: "none",
                    borderBottom: "1px solid var(--border-default-grey)",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--background-default-grey-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div style={{ fontWeight: 500 }}>{etab.nom}</div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-default-grey)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {etab.type && <span>{etab.type}</span>}
                    {etab.region && (
                      <span>
                        {" • "}
                        {etab.region}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchTerm && filteredEtablissements.length === 0 && (
            <div
              className="fr-alert fr-alert--info fr-alert--sm fr-mt-2w"
              style={{ marginBottom: 0 }}
            >
              <p className="fr-text--sm fr-mb-0">
                Aucun établissement trouvé pour "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>

      <Row gutters>
        {cards.map((card) => (
          <Col key={card.path} md="6" className="fr-mb-4w">
            <div
              className="accueil-card"
              style={{
                borderTop: `4px solid ${card.color}`,
              }}
              onClick={() => navigate(card.path)}
            >
              <div className="accueil-card-header">
                <div
                  className="accueil-card-icon"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <i
                    className={card.icon}
                    style={{ color: card.color, fontSize: "32px" }}
                  ></i>
                </div>
                <h2 className="fr-h4 fr-mb-0" style={{ color: card.color }}>
                  {card.title}
                </h2>
              </div>

              <p
                className="fr-text--sm fr-mb-3w"
                style={{ color: "var(--text-default-grey)" }}
              >
                {card.description}
              </p>

              {card.stats && (
                <div className="fr-badge fr-badge--sm fr-mb-3w">
                  {card.stats}
                </div>
              )}

              <Button
                size="sm"
                icon="arrow-right-line"
                iconPosition="right"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.path);
                }}
                style={{
                  backgroundColor: card.color,
                  borderColor: card.color,
                }}
              >
                Accéder
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
