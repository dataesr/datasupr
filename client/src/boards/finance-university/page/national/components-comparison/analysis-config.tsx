import { Row, Col } from "@dataesr/dsfr-plus";
import { useMemo, useEffect } from "react";

interface AnalysisConfigProps {
  xAxis: string;
  yAxis: string;
  sizeMetric: string;
  colorMetric: string;
  colorBy: "region" | "type" | "typologie" | "metric";
  data?: any[];
  onXAxisChange: (value: string) => void;
  onYAxisChange: (value: string) => void;
  onSizeMetricChange: (value: string) => void;
  onColorMetricChange: (value: string) => void;
  onColorByChange: (value: "region" | "type" | "typologie" | "metric") => void;
}

const metricOptions = [
  { value: "scsp_par_etudiants", label: "SCSP par étudiant" },
  { value: "taux_encadrement", label: "Taux d'encadrement" },
  { value: "effectif_sans_cpge", label: "Effectif étudiant" },
  { value: "scsp", label: "SCSP total" },
  { value: "recettes_propres", label: "Recettes propres" },
  { value: "part_ressources_propres", label: "Part ressources propres (%)" },
  { value: "charges_de_personnel", label: "Charges de personnel" },
  {
    value: "taux_de_remuneration_des_permanents",
    label: "Taux rémunération permanents (%)",
  },
  {
    value: "charges_de_personnel_produits_encaissables",
    label: "Charges personnel / Produits (%)",
  },
  { value: "emploi_etpt", label: "Emplois (ETPT)" },
  { value: "part_droits_d_inscription", label: "Part droits inscription (%)" },
  {
    value: "part_formation_continue_diplomes_propres_et_vae",
    label: "Part formation continue (%)",
  },
  { value: "part_taxe_d_apprentissage", label: "Part taxe apprentissage (%)" },
  {
    value: "part_anr_hors_investissements_d_avenir",
    label: "Part ANR hors invest. (%)",
  },
  {
    value: "part_contrats_et_prestations_de_recherche_hors_anr",
    label: "Part contrats recherche (%)",
  },
  {
    value: "part_subventions_de_la_region",
    label: "Part subventions région (%)",
  },
  {
    value: "part_subventions_union_europeenne",
    label: "Part subventions UE (%)",
  },
];

const analysisSuggestions = [
  {
    label: "Efficacité budgétaire",
    description: "SCSP/étudiant vs Taux d'encadrement",
    config: {
      xAxis: "taux_encadrement",
      yAxis: "scsp_par_etudiants",
      sizeMetric: "effectif_sans_cpge",
      colorMetric: "part_ressources_propres",
      colorBy: "metric" as const,
    },
  },
  {
    label: "Autonomie financière",
    description: "Part ressources propres vs SCSP/étudiant",
    config: {
      xAxis: "part_ressources_propres",
      yAxis: "scsp_par_etudiants",
      sizeMetric: "effectif_sans_cpge",
      colorMetric: "",
      colorBy: "region" as const,
    },
  },
  {
    label: "Coûts RH",
    description: "Taux rémunération vs Charges/Produits",
    config: {
      xAxis: "taux_de_remuneration_des_permanents",
      yAxis: "charges_de_personnel_produits_encaissables",
      sizeMetric: "emploi_etpt",
      colorMetric: "",
      colorBy: "type" as const,
    },
  },
  {
    label: "Recherche vs Formation",
    description: "Part contrats recherche vs Part formation continue",
    config: {
      xAxis: "part_contrats_et_prestations_de_recherche_hors_anr",
      yAxis: "part_formation_continue_diplomes_propres_et_vae",
      sizeMetric: "scsp",
      colorMetric: "",
      colorBy: "typologie" as const,
    },
  },
];

export default function AnalysisConfig({
  xAxis,
  yAxis,
  sizeMetric,
  colorMetric,
  colorBy,
  data = [],
  onXAxisChange,
  onYAxisChange,
  onSizeMetricChange,
  onColorMetricChange,
  onColorByChange,
}: AnalysisConfigProps) {
  const availableMetrics = useMemo(() => {
    if (!data || data.length === 0) return metricOptions;

    const metricCounts: Record<string, number> = {};

    data.forEach((item) => {
      metricOptions.forEach((metric) => {
        const value = item[metric.value];
        if (value != null && value !== 0) {
          metricCounts[metric.value] = (metricCounts[metric.value] || 0) + 1;
        }
      });
    });

    const threshold = Math.ceil(data.length * 0.5);
    return metricOptions.filter(
      (metric) => (metricCounts[metric.value] || 0) >= threshold
    );
  }, [data]);

  useEffect(() => {
    if (availableMetrics.length === 0) return;

    const availableValues = availableMetrics.map((m) => m.value);

    if (!availableValues.includes(xAxis) && availableMetrics[0]) {
      onXAxisChange(availableMetrics[0].value);
    }
    if (!availableValues.includes(yAxis) && availableMetrics[1]) {
      onYAxisChange(availableMetrics[1].value);
    }
    if (
      sizeMetric &&
      !availableValues.includes(sizeMetric) &&
      availableMetrics[2]
    ) {
      onSizeMetricChange(availableMetrics[2].value);
    }
    if (colorMetric && !availableValues.includes(colorMetric)) {
      onColorMetricChange("");
    }
  }, [availableMetrics]);

  const applyPreset = (preset: (typeof analysisSuggestions)[0]) => {
    onXAxisChange(preset.config.xAxis);
    onYAxisChange(preset.config.yAxis);
    onSizeMetricChange(preset.config.sizeMetric);
    onColorMetricChange(preset.config.colorMetric);
    onColorByChange(preset.config.colorBy);
  };

  return (
    <div>
      <div className="fr-mb-3w">
        <h3 className="fr-h6 fr-mb-2w">Analyses suggérées</h3>
        <Row gutters>
          {analysisSuggestions.map((preset) => (
            <Col key={preset.label} md="3">
              <div
                className="fr-card fr-card--sm"
                style={{
                  cursor: "pointer",
                  height: "100%",
                  border: "1px solid var(--border-default-grey)",
                }}
                onClick={() => applyPreset(preset)}
              >
                <div className="fr-card__body fr-p-2w">
                  <div className="fr-card__content">
                    <p
                      className="fr-text--sm fr-text--bold fr-mb-1v"
                      style={{ color: "var(--blue-cumulus-sun-368)" }}
                    >
                      {preset.label}
                    </p>
                    <p
                      className="fr-text--xs fr-mb-0"
                      style={{ color: "var(--text-default-grey)" }}
                    >
                      {preset.description}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <div
        className="fr-p-3w fr-mb-3w"
        style={{
          backgroundColor: "var(--background-default-grey-hover)",
          borderRadius: "4px",
        }}
      >
        <div
          className="fr-mb-2w"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 className="fr-h6 fr-mb-0">Configuration du graphique</h3>
          <p
            className="fr-text--xs fr-mb-0"
            style={{ color: "var(--text-default-grey)" }}
          >
            {availableMetrics.length} métrique
            {availableMetrics.length > 1 ? "s" : ""} disponible
            {availableMetrics.length > 1 ? "s" : ""} pour cette sélection
          </p>
        </div>

        <Row gutters className="fr-mb-2w">
          <Col md="6">
            <div className="fr-select-group">
              <label className="fr-label">
                <strong>Axe horizontal (X)</strong>
              </label>
              <select
                className="fr-select"
                value={xAxis}
                onChange={(e) => onXAxisChange(e.target.value)}
              >
                {availableMetrics.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </Col>

          <Col md="6">
            <div className="fr-select-group">
              <label className="fr-label">
                <strong>Axe vertical (Y)</strong>
              </label>
              <select
                className="fr-select"
                value={yAxis}
                onChange={(e) => onYAxisChange(e.target.value)}
              >
                {availableMetrics.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </Col>
        </Row>

        <Row gutters className="fr-mb-2w">
          <Col md="6">
            <div className="fr-select-group">
              <label className="fr-label">
                <strong>Taille des bulles</strong>
              </label>
              <select
                className="fr-select"
                value={sizeMetric}
                onChange={(e) => onSizeMetricChange(e.target.value)}
              >
                <option value="">Taille uniforme</option>
                {availableMetrics.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </Col>

          <Col md="6">
            <div className="fr-select-group">
              <label className="fr-label">
                <strong>Couleur des bulles</strong>
              </label>
              <select
                className="fr-select"
                value={colorBy}
                onChange={(e) =>
                  onColorByChange(
                    e.target.value as "region" | "type" | "typologie" | "metric"
                  )
                }
              >
                <option value="region">Par région</option>
                <option value="type">Par type</option>
                <option value="typologie">Par typologie</option>
                <option value="metric">Par métrique</option>
              </select>
            </div>
          </Col>
        </Row>

        {colorBy === "metric" && (
          <Row gutters>
            <Col md="6">
              <div className="fr-select-group">
                <label className="fr-label">
                  <strong>Métrique pour la couleur</strong>
                </label>
                <select
                  className="fr-select"
                  value={colorMetric}
                  onChange={(e) => onColorMetricChange(e.target.value)}
                >
                  <option value="">Sélectionnez...</option>
                  {availableMetrics.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
