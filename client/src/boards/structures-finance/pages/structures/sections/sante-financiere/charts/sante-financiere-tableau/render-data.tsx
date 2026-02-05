import "./styles.scss";

const pct = (n?: number) => (n != null ? `${n.toFixed(1)}` : "—");
const jours = (n?: number) => (n != null ? n.toFixed(1) : "—");

interface SanteFinanciereData {
  exercice: string | number;
  sanfin_source?: string;
  resultat_net_comptable?: number;
  resultat_net_comptable_etat?: string;
  resultat_net_comptable_hors_sie?: number;
  resultat_net_comptable_hors_sie_etat?: string;
  capacite_d_autofinancement?: number;
  capacite_d_autofinancement_etat?: string;
  caf_produits_encaissables?: number;
  caf_produits_encaissables_etat?: string;
  fonds_de_roulement_net_global?: number;
  fonds_de_roulement_net_global_etat?: string;
  besoin_en_fonds_de_roulement?: number;
  besoin_en_fonds_de_roulement_etat?: string;
  tresorerie?: number;
  tresorerie_etat?: string;
  fonds_de_roulement_en_jours_de_fonctionnement?: number;
  fonds_de_roulement_en_jours_de_fonctionnement_etat?: string;
  tresorerie_en_jours_de_fonctionnement?: number;
  tresorerie_en_jours_de_fonctionnement_etat?: string;
  charges_decaissables_produits_encaissables?: number;
  charges_decaissables_produits_encaissables_etat?: string;
  taux_de_remuneration_des_permanents?: number;
  taux_de_remuneration_des_permanents_etat?: string;
}

interface RenderDataProps {
  yearsData: SanteFinanciereData[];
  showResultatHorsSie?: boolean;
}

export function RenderData({
  yearsData,
  showResultatHorsSie,
}: RenderDataProps) {
  if (!yearsData || yearsData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const years = yearsData.map((d) => d.exercice);

  const getYearLabel = (yearData: SanteFinanciereData) => {
    const isBudget = yearData.sanfin_source === "Budget";
    return isBudget
      ? `${yearData.exercice} (budget)`
      : String(yearData.exercice);
  };

  const sections = [
    {
      title: "Equilibre financier",
      className: "section equilibre",
      items: [
        {
          label: "Résultat net comptable (en M€)",
          valueKey: "resultat_net_comptable",
          statusKey: "resultat_net_comptable_etat",
          formatter: (v?: number) =>
            v != null ? (v / 1000000).toFixed(1) : "—",
        },
        ...(showResultatHorsSie
          ? [
              {
                label: "Résultat net comptable hors SIE (en M€)",
                valueKey: "resultat_net_comptable_hors_sie",
                statusKey: "resultat_net_comptable_hors_sie_etat",
                formatter: (v?: number) =>
                  v != null ? (v / 1000000).toFixed(1) : "—",
              },
            ]
          : []),
        {
          label: "Capacité d'autofinancement (CAF) (en M€)",
          valueKey: "capacite_d_autofinancement",
          statusKey: "capacite_d_autofinancement_etat",
          formatter: (v?: number) =>
            v != null ? (v / 1000000).toFixed(1) : "—",
        },
        {
          label: "CAF / Produits encaissables (en %)",
          valueKey: "caf_produits_encaissables",
          statusKey: "caf_produits_encaissables_etat",
          formatter: pct,
        },
      ],
    },
    {
      title: "Cycle d'exploitation",
      className: "section cycle",
      items: [
        {
          label: "Fonds de roulement net global (en M€)",
          valueKey: "fonds_de_roulement_net_global",
          statusKey: "fonds_de_roulement_net_global_etat",
          formatter: (v?: number) =>
            v != null ? (v / 1000000).toFixed(1) : "—",
        },
        {
          label: "Besoin en fonds de roulement (en M€)",
          valueKey: "besoin_en_fonds_de_roulement",
          statusKey: "besoin_en_fonds_de_roulement_etat",
          formatter: (v?: number) =>
            v != null ? (v / 1000000).toFixed(1) : "—",
        },
        {
          label: "Trésorerie (en M€)",
          valueKey: "tresorerie",
          statusKey: "tresorerie_etat",
          formatter: (v?: number) =>
            v != null ? (v / 1000000).toFixed(1) : "—",
        },
        {
          label: "Fonds de roulement en jours de fonctionnement (en jours)",
          valueKey: "fonds_de_roulement_en_jours_de_fonctionnement",
          statusKey: "fonds_de_roulement_en_jours_de_fonctionnement_etat",
          formatter: jours,
        },
        {
          label: "Trésorerie en jours de fonctionnement (en jours)",
          valueKey: "tresorerie_en_jours_de_fonctionnement",
          statusKey: "tresorerie_en_jours_de_fonctionnement_etat",
          formatter: jours,
        },
      ],
    },
    {
      title: "Financement de l'activité",
      className: "section cycle",
      items: [
        {
          label: "Charges décaissables / Produits encaissables (en %)",
          valueKey: "charges_decaissables_produits_encaissables",
          statusKey: "charges_decaissables_produits_encaissables_etat",
          formatter: pct,
        },
        {
          label: "Taux de rémunération des permanents (en %)",
          valueKey: "taux_de_remuneration_des_permanents",
          statusKey: "taux_de_remuneration_des_permanents_etat",
          formatter: pct,
        },
      ],
    },
  ];

  const getCellClassName = (status?: string) => {
    if (status === "alerte") return "alerte";
    if (status === "vigilance") return "vigilance";
    return "normal";
  };

  return (
    <div className="sf-table">
      <table>
        <thead>
          <tr>
            <th>
              <strong>Comptes financiers</strong>
            </th>
            {yearsData.map((yearData, idx) => (
              <th key={idx}>{getYearLabel(yearData)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section, sectionIdx) => (
            <>
              <tr key={`section-${sectionIdx}`} className={section.className}>
                <td colSpan={years.length + 1}>{section.title}</td>
              </tr>
              {section.items.map((item, itemIdx) => (
                <tr key={`${sectionIdx}-${itemIdx}`}>
                  <td>{item.label}</td>
                  {yearsData.map((yearData, yearIdx) => {
                    const value = (yearData as any)[item.valueKey];
                    const status = (yearData as any)[item.statusKey];
                    return (
                      <td key={yearIdx} className={getCellClassName(status)}>
                        {item.formatter(value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
      <div className="legend fr-mt-2w">
        <div>
          <span className="vigilance"></span>
          <span>Vigilance</span>
        </div>
        <div>
          <span className="alerte"></span>
          <span>Alerte</span>
        </div>
      </div>
    </div>
  );
}
