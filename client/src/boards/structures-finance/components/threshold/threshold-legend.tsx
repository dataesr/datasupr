export const FINANCIAL_HEALTH_INDICATORS = [
  "resultat_net_comptable",
  "resultat_net_comptable_hors_sie",
  "capacite_d_autofinancement",
  "caf_produits_encaissables",
  "fonds_de_roulement_net_global",
  "tresorerie",
  "fonds_de_roulement_en_jours_de_fonctionnement",
  "tresorerie_en_jours_de_fonctionnement",
  "charges_decaissables_produits_encaissables",
  "taux_de_remuneration_des_permanents",
  "ressources_propres_produits_encaissables",
  "charges_de_personnel_produits_encaissables",
  "caf_acquisitions_d_immobilisations",
  "solde_budgetaire",
];

export interface ThresholdConfig {
  ale_sens?: "sup" | "inf" | "infegal" | null;
  ale_val?: number | null;
  ale_lib?: string | null;
  vig_min?: number | null;
  vig_max?: number | null;
  vig_lib?: string | null;
}

export function ThresholdLegend({
  threshold,
}: {
  threshold: ThresholdConfig | null;
}) {
  if (!threshold) return null;

  const hasVigilance = threshold.vig_lib != null;
  const hasAlert = threshold.ale_lib != null;

  if (!hasVigilance && !hasAlert) return null;

  return (
    <div
      className="threshold-legend fr-text--sm"
      style={{ fontSize: "0.875rem" }}
    >
      {hasVigilance && (
        <div className="threshold-legend__item">
          <span className="threshold-legend__marker threshold-legend__marker--warning" />
          <span>Zone de vigilance : {threshold.vig_lib}</span>
        </div>
      )}
      {hasAlert && (
        <div className="threshold-legend__item">
          <span className="threshold-legend__marker threshold-legend__marker--error" />
          <span>Zone d'alerte : {threshold.ale_lib}</span>
        </div>
      )}
    </div>
  );
}
