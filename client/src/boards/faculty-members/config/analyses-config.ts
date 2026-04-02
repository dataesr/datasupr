import { getCssColor } from "../../../utils/colors";

export interface FmMetricConfig {
  label: string;
  format: "number" | "percent";
  color: string;
  category: string;
  suffix?: string;
}

export interface FmAnalysisConfig {
  label: string;
  metrics: string[];
  category: string;
  chartType: "single" | "stacked" | "base100";
}

export const FM_STATIC_METRICS: Record<string, FmMetricConfig> = {
  effectif_total: {
    label: "Effectif total",
    format: "number",
    color: getCssColor("blue-france-main-525"),
    category: "Effectifs globaux",
  },
  effectif_femmes: {
    label: "Femmes",
    format: "number",
    color: getCssColor("fm-femmes"),
    category: "Effectifs globaux",
  },
  effectif_hommes: {
    label: "Hommes",
    format: "number",
    color: getCssColor("fm-hommes"),
    category: "Effectifs globaux",
  },
  effectif_ec: {
    label: "Enseignants-chercheurs",
    format: "number",
    color: getCssColor("fm-statut-ec"),
    category: "Effectifs globaux",
  },
  effectif_tit_non_ec: {
    label: "Titulaires non-EC",
    format: "number",
    color: getCssColor("fm-statut-titulaire"),
    category: "Effectifs globaux",
  },
  effectif_non_titulaire: {
    label: "Non-titulaires",
    format: "number",
    color: getCssColor("fm-statut-non-permanent"),
    category: "Effectifs globaux",
  },
  effectif_permanents: {
    label: "Permanents (EC + tit. non-EC)",
    format: "number",
    color: getCssColor("fm-statut-titulaire"),
    category: "Effectifs globaux",
  },
  effectif_temps_plein: {
    label: "Temps plein",
    format: "number",
    color: getCssColor("fm-quotite-temps-plein"),
    category: "Effectifs globaux",
  },
  effectif_temps_partiel: {
    label: "Temps partiel",
    format: "number",
    color: getCssColor("fm-quotite-temps-partiel"),
    category: "Effectifs globaux",
  },
  effectif_age_35_moins: {
    label: "35 ans et moins",
    format: "number",
    color: getCssColor("fm-age-35-et-moins"),
    category: "Effectifs globaux",
  },
  effectif_age_36_55: {
    label: "36 à 55 ans",
    format: "number",
    color: getCssColor("fm-age-36-55-ec"),
    category: "Effectifs globaux",
  },
  effectif_age_56_plus: {
    label: "56 ans et plus",
    format: "number",
    color: getCssColor("fm-age-56-et-plus-ec"),
    category: "Effectifs globaux",
  },

  taux_feminisation: {
    label: "Taux de féminisation global",
    format: "percent",
    color: getCssColor("fm-femmes"),
    category: "Genre",
    suffix: "%",
  },
  taux_feminisation_ec: {
    label: "Féminisation des EC",
    format: "percent",
    color: getCssColor("fm-femmes"),
    category: "Genre",
    suffix: "%",
  },
  taux_feminisation_permanents: {
    label: "Féminisation des permanents",
    format: "percent",
    color: getCssColor("fm-femmes"),
    category: "Genre",
    suffix: "%",
  },
  taux_feminisation_non_titulaires: {
    label: "Féminisation des non-titulaires",
    format: "percent",
    color: getCssColor("fm-femmes"),
    category: "Genre",
    suffix: "%",
  },

  taux_permanents: {
    label: "Taux de permanents",
    format: "percent",
    color: getCssColor("fm-statut-titulaire"),
    category: "Permanents et EC",
    suffix: "%",
  },
  taux_ec: {
    label: "Part des EC (total)",
    format: "percent",
    color: getCssColor("fm-statut-ec"),
    category: "Permanents et EC",
    suffix: "%",
  },
  taux_ec_sur_permanents: {
    label: "Part des EC parmi les permanents",
    format: "percent",
    color: getCssColor("fm-statut-ec"),
    category: "Permanents et EC",
    suffix: "%",
  },

  taux_temps_partiel: {
    label: "Taux de temps partiel global",
    format: "percent",
    color: getCssColor("fm-quotite-temps-partiel"),
    category: "Quotité",
    suffix: "%",
  },
  taux_temps_partiel_femmes: {
    label: "Temps partiel — femmes",
    format: "percent",
    color: getCssColor("fm-femmes"),
    category: "Quotité",
    suffix: "%",
  },
  taux_temps_partiel_hommes: {
    label: "Temps partiel — hommes",
    format: "percent",
    color: getCssColor("fm-hommes"),
    category: "Quotité",
    suffix: "%",
  },

  taux_age_35_moins: {
    label: "Part des 35 ans et moins",
    format: "percent",
    color: getCssColor("fm-age-35-et-moins"),
    category: "Âge",
    suffix: "%",
  },
  taux_age_56_plus: {
    label: "Part des 56 ans et plus",
    format: "percent",
    color: getCssColor("fm-age-56-et-plus-ec"),
    category: "Âge",
    suffix: "%",
  },
};

const SCALE_COLORS = Array.from({ length: 14 }, (_, i) => `scale-${i + 1}`);

export function buildDiscMetrics(
  discCodes: string[],
  discLabels: Record<string, string>
): Record<string, FmMetricConfig> {
  const metrics: Record<string, FmMetricConfig> = {};
  discCodes.forEach((code, i) => {
    const color = getCssColor(SCALE_COLORS[i % SCALE_COLORS.length]);
    const name = discLabels[code] || `Discipline ${code}`;
    metrics[`disc_${code}`] = {
      label: name,
      format: "number",
      color,
      category: "Disciplines",
    };
    metrics[`disc_f_${code}`] = {
      label: "Femmes",
      format: "number",
      color: getCssColor("fm-femmes"),
      category: "Disciplines",
    };
    metrics[`disc_h_${code}`] = {
      label: "Hommes",
      format: "number",
      color: getCssColor("fm-hommes"),
      category: "Disciplines",
    };
  });
  return metrics;
}

export function buildCnuGroupMetrics(
  cnuGroupCodes: string[],
  cnuGroupLabels: Record<string, string>
): Record<string, FmMetricConfig> {
  const metrics: Record<string, FmMetricConfig> = {};
  cnuGroupCodes.forEach((code, i) => {
    const color = getCssColor(SCALE_COLORS[i % SCALE_COLORS.length]);
    const name = cnuGroupLabels[code] || `Groupe CNU ${code}`;
    metrics[`cnu_g_${code}`] = {
      label: name,
      format: "number",
      color,
      category: "Groupes CNU",
    };
    metrics[`cnu_g_f_${code}`] = {
      label: "Femmes",
      format: "number",
      color: getCssColor("fm-femmes"),
      category: "Groupes CNU",
    };
    metrics[`cnu_g_h_${code}`] = {
      label: "Hommes",
      format: "number",
      color: getCssColor("fm-hommes"),
      category: "Groupes CNU",
    };
  });
  return metrics;
}

export function buildCnuSectionMetrics(
  cnuSections: Array<{ code: string; name: string }>
): Record<string, FmMetricConfig> {
  const metrics: Record<string, FmMetricConfig> = {};
  cnuSections.forEach((sect) => {
    metrics[`cnu_s_f_${sect.code}`] = {
      label: "Femmes",
      format: "number",
      color: getCssColor("fm-femmes"),
      category: "Sections CNU",
    };
    metrics[`cnu_s_h_${sect.code}`] = {
      label: "Hommes",
      format: "number",
      color: getCssColor("fm-hommes"),
      category: "Sections CNU",
    };
  });
  return metrics;
}

export const PREDEFINED_FM_STATIC_ANALYSES: Record<string, FmAnalysisConfig> = {
  // Effectifs globaux
  "effectif-total": {
    label: "Effectif total",
    metrics: ["effectif_total"],
    category: "Effectifs globaux",
    chartType: "single",
  },
  "genre-effectifs": {
    label: "Femmes et Hommes",
    metrics: ["effectif_hommes", "effectif_femmes"],
    category: "Effectifs globaux",
    chartType: "stacked",
  },
  "statut-effectifs": {
    label: "Effectifs par statut (EC, titulaires, non-titulaires)",
    metrics: ["effectif_non_titulaire", "effectif_tit_non_ec", "effectif_ec"],
    category: "Effectifs globaux",
    chartType: "stacked",
  },
  "quotite-effectifs": {
    label: "Temps plein et temps partiel",
    metrics: ["effectif_temps_partiel", "effectif_temps_plein"],
    category: "Effectifs globaux",
    chartType: "stacked",
  },
  "age-effectifs": {
    label: "Effectifs par classe d'âge",
    metrics: [
      "effectif_age_35_moins",
      "effectif_age_36_55",
      "effectif_age_56_plus",
    ],
    category: "Effectifs globaux",
    chartType: "stacked",
  },
  "effectifs-base100": {
    label: "EC, permanents et non-titulaires (base 100)",
    metrics: [
      "effectif_ec",
      "effectif_permanents",
      "effectif_non_titulaire",
      "effectif_total",
    ],
    category: "Effectifs globaux",
    chartType: "base100",
  },

  // Genre
  "taux-feminisation": {
    label: "Taux de féminisation global",
    metrics: ["taux_feminisation"],
    category: "Genre",
    chartType: "single",
  },
  "femi-ec": {
    label: "Féminisation des EC",
    metrics: ["taux_feminisation_ec"],
    category: "Genre",
    chartType: "single",
  },
  "femi-permanents": {
    label: "Féminisation des permanents",
    metrics: ["taux_feminisation_permanents"],
    category: "Genre",
    chartType: "single",
  },
  "femi-non-titulaires": {
    label: "Féminisation des non-titulaires",
    metrics: ["taux_feminisation_non_titulaires"],
    category: "Genre",
    chartType: "single",
  },
  "femi-par-statut-base100": {
    label: "Féminisation par statut (base 100)",
    metrics: [
      "taux_feminisation",
      "taux_feminisation_ec",
      "taux_feminisation_permanents",
      "taux_feminisation_non_titulaires",
    ],
    category: "Genre",
    chartType: "base100",
  },
  "genre-base100": {
    label: "Effectifs femmes vs hommes (base 100)",
    metrics: ["effectif_femmes", "effectif_hommes"],
    category: "Genre",
    chartType: "base100",
  },

  // Permanents et EC
  "taux-permanents": {
    label: "Taux de permanents",
    metrics: ["taux_permanents"],
    category: "Permanents et EC",
    chartType: "single",
  },
  "taux-ec": {
    label: "Part des EC (total)",
    metrics: ["taux_ec"],
    category: "Permanents et EC",
    chartType: "single",
  },
  "taux-ec-sur-permanents": {
    label: "Part des EC parmi les permanents",
    metrics: ["taux_ec_sur_permanents"],
    category: "Permanents et EC",
    chartType: "single",
  },
  "effectif-ec-seul": {
    label: "Effectif des EC",
    metrics: ["effectif_ec"],
    category: "Permanents et EC",
    chartType: "single",
  },
  "effectif-permanents-seul": {
    label: "Effectif des permanents",
    metrics: ["effectif_permanents"],
    category: "Permanents et EC",
    chartType: "single",
  },
  "statut-base100": {
    label: "EC, permanents, non-titulaires (base 100)",
    metrics: ["effectif_ec", "effectif_permanents", "effectif_non_titulaire"],
    category: "Permanents et EC",
    chartType: "base100",
  },

  // Quotité
  "taux-temps-partiel": {
    label: "Taux de temps partiel global",
    metrics: ["taux_temps_partiel"],
    category: "Quotité",
    chartType: "single",
  },
  "temps-partiel-femmes": {
    label: "Temps partiel — femmes",
    metrics: ["taux_temps_partiel_femmes"],
    category: "Quotité",
    chartType: "single",
  },
  "temps-partiel-hommes": {
    label: "Temps partiel — hommes",
    metrics: ["taux_temps_partiel_hommes"],
    category: "Quotité",
    chartType: "single",
  },
  "temps-partiel-base100": {
    label: "Temps partiel H/F vs global (base 100)",
    metrics: [
      "taux_temps_partiel_femmes",
      "taux_temps_partiel_hommes",
      "taux_temps_partiel",
    ],
    category: "Quotité",
    chartType: "base100",
  },
};

export function buildDiscAnalyses(
  discCodes: string[],
  discLabels: Record<string, string>
): Record<string, FmAnalysisConfig> {
  if (discCodes.length === 0) return {};
  const analyses: Record<string, FmAnalysisConfig> = {
    "disciplines-evolution": {
      label: "Effectifs par grande discipline",
      metrics: discCodes.map((c) => `disc_${c}`),
      category: "Disciplines",
      chartType: "stacked",
    },
  };
  discCodes.forEach((code) => {
    analyses[`disc-${code}`] = {
      label: discLabels[code] || `Discipline ${code}`,
      metrics: [`disc_h_${code}`, `disc_f_${code}`],
      category: "Disciplines",
      chartType: "stacked",
    };
  });
  return analyses;
}

export function buildCnuGroupAnalyses(
  cnuGroupCodes: string[],
  cnuGroupLabels: Record<string, string>
): Record<string, FmAnalysisConfig> {
  if (cnuGroupCodes.length === 0) return {};
  const analyses: Record<string, FmAnalysisConfig> = {
    "cnu-groups-evolution": {
      label: "Effectifs EC par groupe CNU",
      metrics: cnuGroupCodes.map((c) => `cnu_g_${c}`),
      category: "Groupes CNU",
      chartType: "stacked",
    },
  };
  cnuGroupCodes.forEach((code) => {
    analyses[`cnu-g-${code}`] = {
      label: cnuGroupLabels[code] || `Groupe CNU ${code}`,
      metrics: [`cnu_g_h_${code}`, `cnu_g_f_${code}`],
      category: "Groupes CNU",
      chartType: "stacked",
    };
  });
  return analyses;
}

export function buildCnuSectionAnalyses(
  cnuSections: Array<{ code: string; name: string }>
): Record<string, FmAnalysisConfig> {
  const analyses: Record<string, FmAnalysisConfig> = {};
  cnuSections.forEach(({ code, name }) => {
    analyses[`cnu-s-${code}`] = {
      label: `Section ${code} — ${name}`,
      metrics: [`cnu_s_h_${code}`, `cnu_s_f_${code}`],
      category: "Sections CNU",
      chartType: "stacked",
    };
  });
  return analyses;
}

export function buildAllFmAnalyses(
  data: any
): Record<string, FmAnalysisConfig> {
  return {
    ...PREDEFINED_FM_STATIC_ANALYSES,
    ...buildDiscAnalyses(data.disc_codes || [], data.disc_labels || {}),
    ...buildCnuGroupAnalyses(
      data.cnu_group_codes || [],
      data.cnu_group_labels || {}
    ),
    ...buildCnuSectionAnalyses(data.cnu_sections || []),
  };
}

export function buildAllFmMetricsConfig(
  data: any
): Record<string, FmMetricConfig> {
  return {
    ...FM_STATIC_METRICS,
    ...buildDiscMetrics(data.disc_codes || [], data.disc_labels || {}),
    ...buildCnuGroupMetrics(
      data.cnu_group_codes || [],
      data.cnu_group_labels || {}
    ),
    ...buildCnuSectionMetrics(data.cnu_sections || []),
  };
}
