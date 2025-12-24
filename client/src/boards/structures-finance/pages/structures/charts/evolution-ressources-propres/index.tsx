import { useMemo, useState } from "react";
import { Row, Col, Button, ButtonGroup } from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "../../../../api";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createEvolutionRessourcesPropresChartOptions } from "./options";
import { METRIC_COLORS, CHART_COLORS } from "../../../../constants/colors";

interface EvolutionRessourcesPropresChartProps {
  etablissementId: string;
  etablissementName: string;
}

const METRICS_CONFIG = {
  part_droits_d_inscription: {
    label: "Part droits d'inscription",
    format: "percent" as const,
    color: METRIC_COLORS.droitsInscription,
    category: "Ressources propres",
  },
  part_formation_continue_diplomes_propres_et_vae: {
    label: "Part formation continue",
    format: "percent" as const,
    color: METRIC_COLORS.formationContinue,
    category: "Ressources propres",
  },
  part_taxe_d_apprentissage: {
    label: "Part taxe d'apprentissage",
    format: "percent" as const,
    color: CHART_COLORS.palette[2],
    category: "Ressources propres",
  },
  part_valorisation: {
    label: "Part valorisation",
    format: "percent" as const,
    color: CHART_COLORS.palette[3],
    category: "Ressources propres",
  },
  part_anr_hors_investissements_d_avenir: {
    label: "Part ANR (hors IA)",
    format: "percent" as const,
    color: METRIC_COLORS.anr,
    category: "Ressources propres",
  },
  part_anr_investissements_d_avenir: {
    label: "Part ANR (IA)",
    format: "percent" as const,
    color: CHART_COLORS.palette[5],
    category: "Ressources propres",
  },
  part_contrats_et_prestations_de_recherche_hors_anr: {
    label: "Part contrats recherche",
    format: "percent" as const,
    color: METRIC_COLORS.contratsRecherche,
    category: "Ressources propres",
  },
  part_subventions_de_la_region: {
    label: "Part subventions région",
    format: "percent" as const,
    color: CHART_COLORS.palette[7],
    category: "Ressources propres",
  },
  part_subventions_union_europeenne: {
    label: "Part subventions UE",
    format: "percent" as const,
    color: METRIC_COLORS.subventionsUE,
    category: "Ressources propres",
  },
  part_autres_ressources_propres: {
    label: "Part autres ressources propres",
    format: "percent" as const,
    color: CHART_COLORS.palette[9],
    category: "Ressources propres",
  },
  part_autres_subventions: {
    label: "Part autres subventions",
    format: "percent" as const,
    color: CHART_COLORS.palette[10],
    category: "Ressources propres",
  },

  scsp: {
    label: "SCSP",
    format: "euro" as const,
    color: METRIC_COLORS.scsp,
    category: "Financement",
  },
  scsp_par_etudiants: {
    label: "SCSP par étudiant",
    format: "euro" as const,
    color: CHART_COLORS.palette[1],
    category: "Financement",
  },
  emploi_etpt: {
    label: "Emplois (ETPT)",
    format: "decimal" as const,
    color: METRIC_COLORS.emploiEtpt,
    category: "Personnel",
  },
} as const;

type MetricKey = keyof typeof METRICS_CONFIG;

export default function EvolutionRessourcesPropresChart({
  etablissementId,
  etablissementName,
}: EvolutionRessourcesPropresChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isMetricsSelectorOpen, setIsMetricsSelectorOpen] = useState(false);
  const [isBase100, setIsBase100] = useState(false);

  const { data, isLoading } = useFinanceEtablissementEvolution(etablissementId);

  const metricsWithData = useMemo(() => {
    if (!data || data.length === 0) return new Set<MetricKey>();

    const availableMetrics = new Set<MetricKey>();
    const allMetrics = Object.keys(METRICS_CONFIG) as MetricKey[];

    allMetrics.forEach((metricKey) => {
      const hasData = data.some((item: any) => {
        const value = item[metricKey];
        return value != null && value !== 0;
      });
      if (hasData) {
        availableMetrics.add(metricKey);
      }
    });

    return availableMetrics;
  }, [data]);

  const categories = useMemo(() => {
    const cats = new Set(
      Array.from(metricsWithData).map((key) => METRICS_CONFIG[key].category)
    );
    return ["all", ...Array.from(cats)];
  }, [metricsWithData]);

  const availableMetrics = useMemo(() => {
    const metricsArray = Array.from(metricsWithData);
    if (selectedCategory === "all") {
      return metricsArray;
    }
    return metricsArray.filter(
      (key) => METRICS_CONFIG[key].category === selectedCategory
    );
  }, [selectedCategory, metricsWithData]);

  useMemo(() => {
    const validMetrics = selectedMetrics.filter((m) => metricsWithData.has(m));
    if (validMetrics.length !== selectedMetrics.length) {
      const fallbackMetrics = Array.from(metricsWithData).slice(0, 2);
      setSelectedMetrics(
        validMetrics.length > 0 ? validMetrics : fallbackMetrics
      );
    }
  }, [metricsWithData]);

  const toggleMetric = (metric: MetricKey) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metric)) {
        return prev.filter((m) => m !== metric);
      }
      return [...prev, metric];
    });
  };

  const chartOptions = useMemo(() => {
    if (!data || data.length === 0) return null;

    return createEvolutionRessourcesPropresChartOptions(
      data,
      selectedMetrics,
      METRICS_CONFIG,
      isBase100
    );
  }, [data, selectedMetrics, isBase100]);

  const years = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((d) => d.exercice))]
      .filter((y): y is number => typeof y === "number")
      .sort((a, b) => a - b);
  }, [data]);

  const periodText = useMemo(() => {
    if (years.length === 0) return "Aucune donnée";
    return `${years[0]} - ${years[years.length - 1]} (${years.length} ${
      years.length > 1 ? "années" : "année"
    })`;
  }, [years]);

  if (isLoading) {
    return (
      <div className="fr-p-3w" style={{ textAlign: "center" }}>
        <p>Chargement des données d'évolution...</p>
      </div>
    );
  }

  if (!data || data.length === 0 || metricsWithData.size === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune donnée d'évolution disponible pour cet établissement</p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="fr-mb-3w fr-p-3w"
        style={{
          backgroundColor: "var(--background-default-grey-hover)",
          borderRadius: "8px",
          border: "1px solid var(--border-default-grey)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: isMetricsSelectorOpen ? "1rem" : "0",
          }}
        >
          <h3
            className="fr-h6 fr-mb-0"
            style={{
              borderLeft: `4px solid ${CHART_COLORS.primary}`,
              paddingLeft: "1rem",
            }}
          >
            Sélection des métriques
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{ fontSize: "13px", color: "var(--text-default-grey)" }}
            >
              <strong>{selectedMetrics.length}</strong> métrique
              {selectedMetrics.length > 1 ? "s" : ""} sélectionnée
              {selectedMetrics.length > 1 ? "s" : ""}
              {selectedMetrics.length > 0 && (
                <>
                  {" "}
                  :{" "}
                  {selectedMetrics
                    .map((m) => METRICS_CONFIG[m].label)
                    .join(", ")}
                </>
              )}
            </div>
            {selectedMetrics.length > 0 && (
              <Button
                size="sm"
                variant={isBase100 ? "primary" : "secondary"}
                onClick={() => setIsBase100(!isBase100)}
              >
                Base 100
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsMetricsSelectorOpen(!isMetricsSelectorOpen)}
              icon={
                isMetricsSelectorOpen ? "arrow-up-s-line" : "arrow-down-s-line"
              }
              iconPosition="right"
            >
              {isMetricsSelectorOpen ? "Masquer" : "Modifier"}
            </Button>
          </div>
        </div>

        {isMetricsSelectorOpen && (
          <>
            <div className="fr-mb-3w fr-mt-3w">
              <p className="fr-text--sm fr-mb-2v">
                <strong>Période disponible :</strong> {periodText}
              </p>
              <p className="fr-text--sm fr-mb-2v">
                <strong>Métriques disponibles :</strong> {metricsWithData.size}{" "}
                métrique{metricsWithData.size > 1 ? "s" : ""} avec des données
              </p>
              <p
                className="fr-text--sm"
                style={{ color: "var(--text-default-grey)" }}
              >
                Sélectionnez plusieurs métriques à comparer. Utilisez la base
                100 pour normaliser les échelles.
              </p>
            </div>

            <div className="fr-mb-3w">
              <label className="fr-label fr-mb-1w">
                <strong>Catégorie</strong>
              </label>
              <ButtonGroup size="sm" isInlineFrom="md">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    variant={selectedCategory === cat ? "primary" : "secondary"}
                    size="sm"
                  >
                    {cat === "all"
                      ? `Toutes (${metricsWithData.size})`
                      : `${cat} (${
                          Array.from(metricsWithData).filter(
                            (m) => METRICS_CONFIG[m].category === cat
                          ).length
                        })`}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            {/* Liste des métriques voir avec Yann */}
            <Row gutters>
              {availableMetrics.length === 0 && (
                <Col md="12">
                  <div className="fr-alert fr-alert--info fr-alert--sm">
                    <p className="fr-text--sm">
                      Aucune métrique disponible dans cette catégorie
                    </p>
                  </div>
                </Col>
              )}
              {availableMetrics.map((metricKey) => {
                const config = METRICS_CONFIG[metricKey];
                const isSelected = selectedMetrics.includes(metricKey);
                const isDisabled = false;

                return (
                  <Col key={metricKey} md="4" sm="6">
                    <button
                      className="fr-btn fr-btn--sm"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        marginBottom: "0.5rem",
                        backgroundColor: isSelected
                          ? config.color
                          : isDisabled
                          ? "var(--background-disabled-grey)"
                          : "var(--background-default-grey)",
                        color: isSelected
                          ? "var(--text-inverted-grey)"
                          : isDisabled
                          ? "var(--text-disabled-grey)"
                          : "var(--text-action-high-grey)",
                        border: `1px solid ${
                          isSelected
                            ? config.color
                            : "var(--border-default-grey)"
                        }`,
                        opacity: isDisabled ? 0.5 : 1,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                      }}
                      onClick={() => !isDisabled && toggleMetric(metricKey)}
                      disabled={isDisabled}
                    >
                      <span style={{ marginRight: "0.5rem" }}>
                        {isSelected ? "✓" : "○"}
                      </span>
                      {config.label}
                      <span
                        className="fr-badge fr-badge--sm fr-ml-1w"
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(255,255,255,0.3)"
                            : "var(--background-alt-grey)",
                          color: isSelected
                            ? "var(--text-inverted-grey)"
                            : "var(--text-default-grey)",
                          fontSize: "9px",
                        }}
                      >
                        {config.category}
                      </span>
                    </button>
                  </Col>
                );
              })}
            </Row>

            {selectedMetrics.length === 0 && (
              <div className="fr-alert fr-alert--info fr-alert--sm fr-mt-2w">
                <p className="fr-text--sm">
                  Sélectionnez au moins une métrique pour afficher le graphique
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {chartOptions && selectedMetrics.length > 0 && (
        <ChartWrapper
          config={{
            id: "evolution-ressources-propres-chart",
            idQuery: "evolution-ressources-propres",
            title: {
              className: "fr-mt-0w",
              look: "h5",
              size: "h3",
              fr: <>Évolution des ressources propres — {etablissementName}</>,
            },
            comment: {
              fr: (
                <>
                  Analyse de l'évolution des parts de ressources propres et des
                  indicateurs de financement sur la période {periodText}.
                </>
              ),
            },
            readingKey: {
              fr: (
                <>
                  Ce graphique présente l'évolution de{" "}
                  {selectedMetrics
                    .map((m) => METRICS_CONFIG[m].label)
                    .join(", ")}{" "}
                  sur {years.length} années. Les parts sont exprimées en
                  pourcentage des ressources propres totales.
                </>
              ),
            },
            updateDate: new Date(),
            integrationURL: "/integration-url",
          }}
          options={chartOptions}
          legend={null}
        />
      )}
    </div>
  );
}
