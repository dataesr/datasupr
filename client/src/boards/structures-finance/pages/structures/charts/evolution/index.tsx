import { useMemo, useState } from "react";
import { Row, Col, Button, ButtonGroup } from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "../../../../api";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createEvolutionChartOptions } from "./options";
import { RenderDataSingle, RenderDataBase100 } from "./render-data";
import { METRIC_COLORS, CHART_COLORS } from "../../../../constants/colors";

interface EvolutionChartProps {
  etablissementId: string;
  etablissementName: string;
}

type MetricKey = keyof typeof METRICS_CONFIG;

const METRICS_CONFIG = {
  effectif_sans_cpge: {
    label: "Effectifs totaux",
    format: "number" as const,
    color: METRIC_COLORS.effectifs,
    category: "Effectifs",
  },
  effectif_sans_cpge_l: {
    label: "Effectifs Licence",
    format: "number" as const,
    color: METRIC_COLORS.effectifsLicence,
    category: "Effectifs",
  },
  effectif_sans_cpge_m: {
    label: "Effectifs Master",
    format: "number" as const,
    color: METRIC_COLORS.effectifsMaster,
    category: "Effectifs",
  },
  effectif_sans_cpge_d: {
    label: "Effectifs Doctorat",
    format: "number" as const,
    color: METRIC_COLORS.effectifsDoctorat,
    category: "Effectifs",
  },

  taux_encadrement: {
    label: "Taux d'encadrement",
    format: "percent" as const,
    color: METRIC_COLORS.tauxEncadrement,
    category: "Ratios",
    suffix: "%",
  },
  emploi_etpt: {
    label: "Emplois (ETPT)",
    format: "decimal" as const,
    color: METRIC_COLORS.emploiEtpt,
    category: "Personnel",
  },
  charges_de_personnel_produits_encaissables: {
    label: "Charges personnel / Produits",
    format: "percent" as const,
    color: METRIC_COLORS.chargesPersonnel,
    category: "Ratios",
    suffix: "%",
  },

  scsp: {
    label: "SCSP",
    format: "euro" as const,
    color: METRIC_COLORS.scsp,
    category: "Finances",
  },
  scsp_par_etudiants: {
    label: "SCSP par étudiant",
    format: "euro" as const,
    color: CHART_COLORS.palette[1],
    category: "Finances",
  },
  ressources_propres: {
    label: "Ressources propres",
    format: "euro" as const,
    color: METRIC_COLORS.ressourcesPropres,
    category: "Finances",
  },
  charges_de_personnel: {
    label: "Charges de personnel",
    format: "euro" as const,
    color: METRIC_COLORS.chargesPersonnel,
    category: "Finances",
  },
  produits_de_fonctionnement_encaissables: {
    label: "Produits de fonctionnement",
    format: "euro" as const,
    color: METRIC_COLORS.produitsFonctionnement,
    category: "Finances",
  },

  anr_hors_investissements_d_avenir: {
    label: "ANR (hors IA)",
    format: "euro" as const,
    color: METRIC_COLORS.anr,
    category: "Recherche",
  },
  subventions_union_europeenne: {
    label: "Subventions UE",
    format: "euro" as const,
    color: METRIC_COLORS.subventionsUE,
    category: "Recherche",
  },
  contrats_et_prestations_de_recherche_hors_anr: {
    label: "Contrats recherche",
    format: "euro" as const,
    color: METRIC_COLORS.contratsRecherche,
    category: "Recherche",
  },

  droits_d_inscription: {
    label: "Droits d'inscription",
    format: "euro" as const,
    color: METRIC_COLORS.droitsInscription,
    category: "Formation",
  },
  formation_continue_diplomes_propres_et_vae: {
    label: "Formation continue",
    format: "euro" as const,
    color: METRIC_COLORS.formationContinue,
    category: "Formation",
  },
  taxe_d_apprentissage: {
    label: "Taxe d'apprentissage",
    format: "euro" as const,
    color: CHART_COLORS.palette[5],
    category: "Formation",
  },
  valorisation: {
    label: "Valorisation",
    format: "euro" as const,
    color: CHART_COLORS.palette[6],
    category: "Recherche",
  },
  anr_investissements_d_avenir: {
    label: "ANR investissements d'avenir",
    format: "euro" as const,
    color: CHART_COLORS.palette[7],
    category: "Recherche",
  },
  subventions_de_la_region: {
    label: "Subventions régionales",
    format: "euro" as const,
    color: CHART_COLORS.palette[8],
    category: "Recherche",
  },
  autres_ressources_propres: {
    label: "Autres ressources propres",
    format: "euro" as const,
    color: CHART_COLORS.palette[9],
    category: "Finances",
  },
  autres_subventions: {
    label: "Autres subventions",
    format: "euro" as const,
    color: CHART_COLORS.palette[10],
    category: "Finances",
  },

  part_droits_d_inscription: {
    label: "Part droits d'inscription",
    format: "percent" as const,
    color: METRIC_COLORS.droitsInscription,
    category: "Parts",
    suffix: "%",
  },
  part_subventions_union_europeenne: {
    label: "Part subventions UE",
    format: "percent" as const,
    color: METRIC_COLORS.subventionsUE,
    category: "Parts",
    suffix: "%",
  },
  part_anr_hors_investissements_d_avenir: {
    label: "Part ANR",
    format: "percent" as const,
    color: METRIC_COLORS.anr,
    category: "Parts",
    suffix: "%",
  },
} as const;

const PREDEFINED_ANALYSES = {
  "ressources-total": {
    label: "Total des ressources",
    metrics: ["produits_de_fonctionnement_encaissables"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-scsp": {
    label: "Subvention pour charges de service public (SCSP)",
    metrics: ["scsp"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-propres": {
    label: "Ressources propres de l'établissement",
    metrics: ["ressources_propres"],
    category: "Ressources",
    hasCustomChart: true,
    showBase100: false,
  },
  "ressources-vs-effectifs": {
    label: "Ressources vs effectifs d'étudiants",
    metrics: ["produits_de_fonctionnement_encaissables", "effectif_sans_cpge"],
    category: "Ressources",
    showBase100: true,
  },
  "ressources-droits-inscription": {
    label: "Droits d'inscription",
    metrics: ["droits_d_inscription"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-formation-continue": {
    label: "Formation continue et VAE",
    metrics: ["formation_continue_diplomes_propres_et_vae"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-taxe-apprentissage": {
    label: "Taxe d'apprentissage",
    metrics: ["taxe_d_apprentissage"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-valorisation": {
    label: "Valorisation",
    metrics: ["valorisation"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-anr-hors-ia": {
    label: "ANR hors investissements d'avenir",
    metrics: ["anr_hors_investissements_d_avenir"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-anr-ia": {
    label: "ANR investissements d'avenir",
    metrics: ["anr_investissements_d_avenir"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-contrats-recherche": {
    label: "Contrats et prestations de recherche",
    metrics: ["contrats_et_prestations_de_recherche_hors_anr"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-subventions-region": {
    label: "Subventions régionales",
    metrics: ["subventions_de_la_region"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-subventions-ue": {
    label: "Subventions de l'Union Européenne",
    metrics: ["subventions_union_europeenne"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-autres-propres": {
    label: "Autres ressources propres",
    metrics: ["autres_ressources_propres"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-autres-subventions": {
    label: "Autres subventions",
    metrics: ["autres_subventions"],
    category: "Ressources",
    showBase100: false,
  },

  "scsp-simple": {
    label: "SCSP",
    metrics: ["scsp"],
    category: "SCSP",
    showBase100: false,
  },
  "scsp-par-etudiant": {
    label: "SCSP par étudiant inscrit",
    metrics: ["scsp_par_etudiants"],
    category: "SCSP",
    showBase100: false,
  },
  "scsp-comparaison": {
    label: "SCSP et SCSP par étudiant",
    metrics: ["scsp", "scsp_par_etudiants"],
    category: "SCSP",
    showBase100: true,
  },

  "masse-salariale": {
    label: "Dépenses relatives à la masse salariale",
    metrics: ["charges_de_personnel"],
    category: "Masse salariale",
    showBase100: false,
  },
  "masse-salariale-poids": {
    label: "Poids des dépenses de personnel sur produits encaissables",
    metrics: ["charges_de_personnel_produits_encaissables"],
    category: "Masse salariale",
    showBase100: false,
  },
  "masse-salariale-comparaison": {
    label: "Charges de personnel et poids sur produits",
    metrics: [
      "charges_de_personnel_produits_encaissables",
      "charges_de_personnel",
    ],
    category: "Masse salariale",
    showBase100: true,
  },

  "enseignants-emplois": {
    label: "Nombre d'emplois d'enseignants permanents (ETPT)",
    metrics: ["emploi_etpt"],
    category: "Personnel enseignant",
    showBase100: false,
  },
  "enseignants-taux": {
    label: "Taux d'encadrement d'enseignants permanents",
    metrics: ["taux_encadrement"],
    category: "Personnel enseignant",
    showBase100: false,
  },
  "enseignants-comparaison": {
    label: "Taux d'encadrement et emplois ETPT",
    metrics: ["taux_encadrement", "emploi_etpt"],
    category: "Personnel enseignant",
    showBase100: true,
  },
} as const;

type AnalysisKey = keyof typeof PREDEFINED_ANALYSES;

export default function EvolutionChart({
  etablissementId,
  etablissementName,
}: EvolutionChartProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisKey | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data, isLoading } = useFinanceEtablissementEvolution(etablissementId);

  const analysesWithData = useMemo(() => {
    if (!data || data.length === 0) return new Set<AnalysisKey>();

    const available = new Set<AnalysisKey>();
    const analysisKeys = Object.keys(PREDEFINED_ANALYSES) as AnalysisKey[];

    analysisKeys.forEach((key) => {
      const analysis = PREDEFINED_ANALYSES[key];
      const allMetricsHaveData = analysis.metrics.every((metric) => {
        return data.some((item: any) => {
          const value = item[metric];
          return value != null && value !== 0;
        });
      });
      if (allMetricsHaveData) {
        available.add(key);
      }
    });

    return available;
  }, [data]);

  const categories = useMemo(() => {
    const cats = new Set(
      Array.from(analysesWithData).map(
        (key) => PREDEFINED_ANALYSES[key].category
      )
    );
    return ["all", ...Array.from(cats)];
  }, [analysesWithData]);

  const availableAnalyses = useMemo(() => {
    const analysesArray = Array.from(analysesWithData);
    if (selectedCategory === "all") {
      return analysesArray;
    }
    return analysesArray.filter(
      (key) => PREDEFINED_ANALYSES[key].category === selectedCategory
    );
  }, [selectedCategory, analysesWithData]);

  const selectedMetrics = useMemo(() => {
    if (!selectedAnalysis) return [];
    return [...PREDEFINED_ANALYSES[selectedAnalysis].metrics] as MetricKey[];
  }, [selectedAnalysis]);

  const showBase100 = useMemo(() => {
    if (!selectedAnalysis) return false;
    return PREDEFINED_ANALYSES[selectedAnalysis].showBase100 || false;
  }, [selectedAnalysis]);

  const chartOptions = useMemo(() => {
    if (!data || data.length === 0 || !selectedAnalysis) return null;

    return createEvolutionChartOptions(
      data,
      selectedMetrics,
      METRICS_CONFIG,
      false
    );
  }, [data, selectedMetrics, selectedAnalysis]);

  const chartOptionsBase100 = useMemo(() => {
    if (!data || data.length === 0 || !selectedAnalysis || !showBase100)
      return null;

    return createEvolutionChartOptions(
      data,
      selectedMetrics,
      METRICS_CONFIG,
      true
    );
  }, [data, selectedMetrics, selectedAnalysis, showBase100]);

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

  if (!data || data.length === 0 || analysesWithData.size === 0) {
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
        <h3
          className="fr-h6 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
            paddingLeft: "1rem",
          }}
        >
          Sélection de l'analyse
        </h3>

        <div className="fr-mb-3w">
          <p className="fr-text--sm fr-mb-2v">
            <strong>Période disponible :</strong> {periodText}
          </p>
          <p className="fr-text--sm fr-mb-2v">
            <strong>Analyses disponibles :</strong> {analysesWithData.size}{" "}
            analyse{analysesWithData.size > 1 ? "s" : ""} avec des données
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
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedAnalysis(null);
                }}
                variant={selectedCategory === cat ? "primary" : "secondary"}
                size="sm"
              >
                {cat === "all"
                  ? `Toutes (${analysesWithData.size})`
                  : `${cat} (${
                      Array.from(analysesWithData).filter(
                        (m) => PREDEFINED_ANALYSES[m].category === cat
                      ).length
                    })`}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <Row gutters>
          {availableAnalyses.length === 0 && (
            <Col md="12">
              <div className="fr-alert fr-alert--info fr-alert--sm">
                <p className="fr-text--sm">
                  Aucune analyse disponible dans cette catégorie
                </p>
              </div>
            </Col>
          )}
          {availableAnalyses.map((analysisKey) => {
            const analysis = PREDEFINED_ANALYSES[analysisKey];
            const isSelected = selectedAnalysis === analysisKey;

            return (
              <Col key={analysisKey} md="6" sm="12">
                <button
                  className="fr-btn fr-btn--sm"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "0.5rem",
                    backgroundColor: isSelected
                      ? CHART_COLORS.primary
                      : "var(--background-default-grey)",
                    color: isSelected
                      ? "var(--text-inverted-grey)"
                      : "var(--text-action-high-grey)",
                    border: `1px solid ${
                      isSelected
                        ? CHART_COLORS.primary
                        : "var(--border-default-grey)"
                    }`,
                    cursor: "pointer",
                    padding: "0.75rem 1rem",
                  }}
                  onClick={() => setSelectedAnalysis(analysisKey)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>
                      {isSelected ? "●" : "○"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{analysis.label}</div>
                      <div
                        style={{
                          fontSize: "11px",
                          opacity: 0.8,
                          marginTop: "0.25rem",
                        }}
                      >
                        {analysis.metrics.length} métrique
                        {analysis.metrics.length > 1 ? "s" : ""}
                        {analysis.showBase100 && " • Comparaison avec base 100"}
                      </div>
                    </div>
                  </div>
                </button>
              </Col>
            );
          })}
        </Row>

        {!selectedAnalysis && (
          <div className="fr-alert fr-alert--info fr-alert--sm fr-mt-2w">
            <p className="fr-text--sm">
              Sélectionnez une analyse pour afficher le(s) graphique(s)
            </p>
          </div>
        )}
      </div>

      {selectedAnalysis && selectedMetrics.length === 1 && chartOptions && (
        <ChartWrapper
          config={{
            id: "evolution-chart-single",
            idQuery: "evolution-single",
            title: {
              className: "fr-mt-0w",
              look: "h5",
              size: "h3",
              fr: (
                <>
                  {PREDEFINED_ANALYSES[selectedAnalysis].label} —{" "}
                  {etablissementName}
                </>
              ),
            },
            comment: {
              fr: (
                <>
                  Analyse de l'évolution de{" "}
                  {METRICS_CONFIG[selectedMetrics[0]].label.toLowerCase()} sur
                  la période {periodText}.
                </>
              ),
            },
            readingKey: {
              fr: (
                <>
                  Ce graphique présente l'évolution de{" "}
                  {METRICS_CONFIG[selectedMetrics[0]].label.toLowerCase()} sur{" "}
                  {years.length} années.
                </>
              ),
            },
            updateDate: new Date(),
            integrationURL: "/integration-url",
          }}
          options={chartOptions}
          legend={null}
          renderData={() => (
            <RenderDataSingle
              data={data}
              metricKey={selectedMetrics[0]}
              metricConfig={METRICS_CONFIG[selectedMetrics[0]]}
            />
          )}
        />
      )}

      {selectedAnalysis && selectedMetrics.length === 2 && (
        <>
          {chartOptions && (
            <>
              <ChartWrapper
                config={{
                  id: "evolution-chart-metric1",
                  idQuery: "evolution-metric1",
                  title: {
                    className: "fr-mt-0w",
                    look: "h5",
                    size: "h3",
                    fr: (
                      <>
                        {METRICS_CONFIG[selectedMetrics[0]].label} —{" "}
                        {etablissementName}
                      </>
                    ),
                  },
                  comment: {
                    fr: (
                      <>
                        Évolution de{" "}
                        {METRICS_CONFIG[selectedMetrics[0]].label.toLowerCase()}{" "}
                        sur la période {periodText}.
                      </>
                    ),
                  },
                  readingKey: {
                    fr: (
                      <>
                        Évolution historique de{" "}
                        {METRICS_CONFIG[selectedMetrics[0]].label.toLowerCase()}{" "}
                        sur {years.length} années.
                      </>
                    ),
                  },
                  updateDate: new Date(),
                  integrationURL: "/integration-url",
                }}
                options={createEvolutionChartOptions(
                  data,
                  [selectedMetrics[0]] as MetricKey[],
                  METRICS_CONFIG,
                  false
                )}
                legend={null}
                renderData={() => (
                  <RenderDataSingle
                    data={data}
                    metricKey={selectedMetrics[0]}
                    metricConfig={METRICS_CONFIG[selectedMetrics[0]]}
                  />
                )}
              />

              <div className="fr-mt-5w" />

              <ChartWrapper
                config={{
                  id: "evolution-chart-metric2",
                  idQuery: "evolution-metric2",
                  title: {
                    className: "fr-mt-0w",
                    look: "h5",
                    size: "h3",
                    fr: (
                      <>
                        {METRICS_CONFIG[selectedMetrics[1]].label} —{" "}
                        {etablissementName}
                      </>
                    ),
                  },
                  comment: {
                    fr: (
                      <>
                        Évolution de{" "}
                        {METRICS_CONFIG[selectedMetrics[1]].label.toLowerCase()}{" "}
                        sur la période {periodText}.
                      </>
                    ),
                  },
                  readingKey: {
                    fr: (
                      <>
                        Évolution historique de{" "}
                        {METRICS_CONFIG[selectedMetrics[1]].label.toLowerCase()}{" "}
                        sur {years.length} années.
                      </>
                    ),
                  },
                  updateDate: new Date(),
                  integrationURL: "/integration-url",
                }}
                options={createEvolutionChartOptions(
                  data,
                  [selectedMetrics[1]] as MetricKey[],
                  METRICS_CONFIG,
                  false
                )}
                legend={null}
                renderData={() => (
                  <RenderDataSingle
                    data={data}
                    metricKey={selectedMetrics[1]}
                    metricConfig={METRICS_CONFIG[selectedMetrics[1]]}
                  />
                )}
              />

              <div className="fr-mt-5w" />

              {chartOptionsBase100 && (
                <ChartWrapper
                  config={{
                    id: "evolution-chart-comparison",
                    idQuery: "evolution-comparison",
                    title: {
                      className: "fr-mt-0w",
                      look: "h5",
                      size: "h3",
                      fr: <>Comparaison en base 100 — {etablissementName}</>,
                    },
                    comment: {
                      fr: (
                        <>
                          Comparaison de l'évolution de{" "}
                          {METRICS_CONFIG[
                            selectedMetrics[0]
                          ].label.toLowerCase()}{" "}
                          et{" "}
                          {METRICS_CONFIG[
                            selectedMetrics[1]
                          ].label.toLowerCase()}{" "}
                          en base 100 (première année = 100).
                        </>
                      ),
                    },
                    readingKey: {
                      fr: (
                        <>
                          Ce graphique permet de comparer les dynamiques
                          d'évolution des deux indicateurs sur une échelle
                          normalisée.
                        </>
                      ),
                    },
                    updateDate: new Date(),
                    integrationURL: "/integration-url",
                  }}
                  options={chartOptionsBase100}
                  legend={null}
                  renderData={() => (
                    <RenderDataBase100
                      data={data}
                      metric1Key={selectedMetrics[0]}
                      metric1Config={METRICS_CONFIG[selectedMetrics[0]]}
                      metric2Key={selectedMetrics[1]}
                      metric2Config={METRICS_CONFIG[selectedMetrics[1]]}
                    />
                  )}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
