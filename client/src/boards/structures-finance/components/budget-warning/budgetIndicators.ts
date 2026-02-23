// Liste des métriques qui peuvent provenir de données budgétaires
export const BUDGET_SENSITIVE_METRICS = new Set([
  "ressources_propres",
  "tot_ress_formation",
  "droits_d_inscription",
  "formation_continue_diplomes_propres_et_vae",
  "taxe_d_apprentissage",
  "tot_ress_recherche",
  "valorisation",
  "anr_investissements_d_avenir",
  "anr_hors_investissements_d_avenir",
  "contrats_et_prestations_de_recherche_hors_anr",
  "tot_ress_autres_recette",
  "subventions_de_la_region",
  "subventions_union_europeenne",
  "autres_subventions",
  "autres_ressources_propres",
  "ressources_propres_encaissables",
  "resultat_net_comptable",
  "resultat_net_comptable_hors_sie",
  "capacite_d_autofinancement",
  "caf_produits_encaissables",
  "fonds_de_roulement_net_global",
  "besoin_en_fonds_de_roulement",
  "tresorerie",
  "fonds_de_roulement_en_jours_de_fonctionnement",
  "tresorerie_en_jours_de_fonctionnement",
  "charges_decaissables_produits_encaissables",
  "taux_de_remuneration_des_permanents",
  "ressources_propres_produits_encaissables",
  "charges_de_personnel_produits_encaissables",
  "caf_acquisitions_d_immobilisations",
  "solde_budgetaire",
  "acquisitions_d_immobilisations",
  "charges_de_fonctionnement_decaissables",
  "charges_de_personnel",
  "charges_externes",
  "charges_externes_produits_encaissables",
  "excedent_brut_d_exploitation_ebe",
  "produits_de_fonctionnement_encaissables",
  "recettes_propres",
]);

export function hasBudgetData(
  data: any[] | undefined,
  metrics: readonly string[]
): boolean {
  if (!data || data.length === 0) return false;

  const hasSensitiveMetric = metrics.some((metric) =>
    BUDGET_SENSITIVE_METRICS.has(metric)
  );

  if (!hasSensitiveMetric) return false;

  return data.some((item) => item.sanfin_source === "Budget");
}

export function getBudgetYears(data: any[] | undefined): number[] {
  if (!data || data.length === 0) return [];

  const years = data
    .filter((item) => item.sanfin_source === "Budget")
    .map((item) => item.exercice || item.anuniv)
    .filter((year) => year != null);

  return Array.from(new Set(years)).sort((a, b) => a - b);
}
