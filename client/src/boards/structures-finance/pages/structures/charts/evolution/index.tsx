import { useMemo } from "react";
import { Row, Col } from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "./api";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import {
  createEvolutionChartOptions,
  createStackedEvolutionChartOptions,
} from "./options";
import {
  RenderDataSingle,
  RenderDataBase100,
  RenderDataStacked,
} from "./render-data";
import { METRIC_COLORS, CHART_COLORS } from "../../../../constants/colors";

interface EvolutionChartProps {
  etablissementId: string;
  etablissementName: string;
  selectedAnalysis: AnalysisKey;
}

type MetricKey = keyof typeof METRICS_CONFIG;

export type AnalysisKey = keyof typeof PREDEFINED_ANALYSES;

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
  tot_ress_formation: {
    label: "Ressources formation",
    format: "euro" as const,
    color: CHART_COLORS.palette[11],
    category: "Finances",
  },
  tot_ress_recherche: {
    label: "Ressources recherche",
    format: "euro" as const,
    color: CHART_COLORS.palette[11],
    category: "Finances",
  },
  tot_ress_autres_recette: {
    label: "Autres ressources",
    format: "euro" as const,
    color: CHART_COLORS.palette[11],
    category: "Finances",
  },

  fonds_de_roulement_net_global: {
    label: "Fonds de roulement net global",
    format: "euro" as const,
    color: CHART_COLORS.palette[0],
    category: "Santé financière",
  },
  besoin_en_fonds_de_roulement: {
    label: "Besoin en fonds de roulement",
    format: "euro" as const,
    color: CHART_COLORS.palette[1],
    category: "Santé financière",
  },
  tresorerie: {
    label: "Trésorerie",
    format: "euro" as const,
    color: CHART_COLORS.palette[2],
    category: "Santé financière",
  },
  fonds_de_roulement_en_jours_de_fonctionnement: {
    label: "Fonds de roulement en jours",
    format: "decimal" as const,
    color: CHART_COLORS.palette[3],
    category: "Santé financière",
  },
  tresorerie_en_jours_de_fonctionnement: {
    label: "Trésorerie en jours",
    format: "decimal" as const,
    color: CHART_COLORS.palette[4],
    category: "Santé financière",
  },
  charges_decaissables_produits_encaissables: {
    label: "Charges décaissables / Produits encaissables",
    format: "percent" as const,
    color: CHART_COLORS.palette[5],
    category: "Santé financière",
    suffix: "%",
  },
  taux_de_remuneration_des_permanents: {
    label: "Taux de rémunération des permanents",
    format: "percent" as const,
    color: CHART_COLORS.palette[6],
    category: "Santé financière",
    suffix: "%",
  },
  ressources_propres_produits_encaissables: {
    label: "Ressources propres / Produits encaissables",
    format: "percent" as const,
    color: CHART_COLORS.palette[7],
    category: "Santé financière",
    suffix: "%",
  },
  caf_acquisitions_d_immobilisations: {
    label: "CAF / Acquisitions d'immobilisations",
    format: "percent" as const,
    color: CHART_COLORS.palette[8],
    category: "Santé financière",
    suffix: "%",
  },
  solde_budgetaire: {
    label: "Solde budgétaire",
    format: "euro" as const,
    color: CHART_COLORS.palette[9],
    category: "Santé financière",
  },

  effectif_sans_cpge_deg0: {
    label: "BAC ou inférieur",
    format: "number" as const,
    color: CHART_COLORS.palette[0],
    category: "Effectifs",
  },
  effectif_sans_cpge_deg1: {
    label: "BAC + 1",
    format: "number" as const,
    color: CHART_COLORS.palette[1],
    category: "Effectifs",
  },
  effectif_sans_cpge_deg2: {
    label: "BAC + 2",
    format: "number" as const,
    color: CHART_COLORS.palette[2],
    category: "Effectifs",
  },
  effectif_sans_cpge_deg3: {
    label: "BAC + 3",
    format: "number" as const,
    color: CHART_COLORS.palette[3],
    category: "Effectifs",
  },
  effectif_sans_cpge_deg4: {
    label: "BAC + 4",
    format: "number" as const,
    color: CHART_COLORS.palette[4],
    category: "Effectifs",
  },
  effectif_sans_cpge_deg5: {
    label: "BAC + 5",
    format: "number" as const,
    color: CHART_COLORS.palette[5],
    category: "Effectifs",
  },
  effectif_sans_cpge_deg6: {
    label: "BAC + 6 et +",
    format: "number" as const,
    color: CHART_COLORS.palette[6],
    category: "Effectifs",
  },
  effectif_sans_cpge_deg9: {
    label: "Indéterminé",
    format: "number" as const,
    color: CHART_COLORS.palette[7],
    category: "Effectifs",
  },

  effectif_sans_cpge_dsa: {
    label: "Droit, Sciences éco., AES",
    format: "number" as const,
    color: CHART_COLORS.palette[0],
    category: "Effectifs",
  },
  effectif_sans_cpge_llsh: {
    label: "Lettres, Langues, SHS",
    format: "number" as const,
    color: CHART_COLORS.palette[1],
    category: "Effectifs",
  },
  effectif_sans_cpge_theo: {
    label: "Théologie",
    format: "number" as const,
    color: CHART_COLORS.palette[2],
    category: "Effectifs",
  },
  effectif_sans_cpge_si: {
    label: "Sciences et Ingénierie",
    format: "number" as const,
    color: CHART_COLORS.palette[3],
    category: "Effectifs",
  },
  effectif_sans_cpge_staps: {
    label: "STAPS",
    format: "number" as const,
    color: CHART_COLORS.palette[4],
    category: "Effectifs",
  },
  effectif_sans_cpge_sante: {
    label: "Santé",
    format: "number" as const,
    color: CHART_COLORS.palette[5],
    category: "Effectifs",
  },
  effectif_sans_cpge_veto: {
    label: "Vétérinaire",
    format: "number" as const,
    color: CHART_COLORS.palette[6],
    category: "Effectifs",
  },
  effectif_sans_cpge_interd: {
    label: "Pluridisciplinaire",
    format: "number" as const,
    color: CHART_COLORS.palette[7],
    category: "Effectifs",
  },

  effectif_sans_cpge_du: {
    label: "Diplôme universitaire (DU)",
    format: "number" as const,
    color: CHART_COLORS.palette[0],
    category: "Effectifs",
  },
  effectif_sans_cpge_dn: {
    label: "Diplôme national (DN)",
    format: "number" as const,
    color: CHART_COLORS.palette[1],
    category: "Effectifs",
  },

  part_droits_d_inscription: {
    label: "Part droits d'inscription",
    format: "percent" as const,
    color: METRIC_COLORS.droitsInscription,
    category: "Parts",
    suffix: "%",
  },
  part_formation_continue_diplomes_propres_et_vae: {
    label: "Part formation continue",
    format: "percent" as const,
    color: METRIC_COLORS.formationContinue,
    category: "Parts",
    suffix: "%",
  },
  part_taxe_d_apprentissage: {
    label: "Part taxe d'apprentissage",
    format: "percent" as const,
    color: CHART_COLORS.palette[5],
    category: "Parts",
    suffix: "%",
  },
  part_valorisation: {
    label: "Part valorisation",
    format: "percent" as const,
    color: CHART_COLORS.palette[6],
    category: "Parts",
    suffix: "%",
  },
  part_anr_hors_investissements_d_avenir: {
    label: "Part ANR (hors IA)",
    format: "percent" as const,
    color: METRIC_COLORS.anr,
    category: "Parts",
    suffix: "%",
  },
  part_anr_investissements_d_avenir: {
    label: "Part ANR investissements d'avenir",
    format: "percent" as const,
    color: CHART_COLORS.palette[7],
    category: "Parts",
    suffix: "%",
  },
  part_contrats_et_prestations_de_recherche_hors_anr: {
    label: "Part contrats recherche",
    format: "percent" as const,
    color: METRIC_COLORS.contratsRecherche,
    category: "Parts",
    suffix: "%",
  },
  part_subventions_de_la_region: {
    label: "Part subventions régionales",
    format: "percent" as const,
    color: CHART_COLORS.palette[8],
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
  part_autres_ressources_propres: {
    label: "Part autres ressources propres",
    format: "percent" as const,
    color: CHART_COLORS.palette[9],
    category: "Parts",
    suffix: "%",
  },
  part_autres_subventions: {
    label: "Part autres subventions",
    format: "percent" as const,
    color: CHART_COLORS.palette[10],
    category: "Parts",
    suffix: "%",
  },
} as const;

const METRIC_TO_PART: Partial<Record<MetricKey, MetricKey>> = {
  droits_d_inscription: "part_droits_d_inscription",
  formation_continue_diplomes_propres_et_vae:
    "part_formation_continue_diplomes_propres_et_vae",
  taxe_d_apprentissage: "part_taxe_d_apprentissage",
  valorisation: "part_valorisation",
  anr_hors_investissements_d_avenir: "part_anr_hors_investissements_d_avenir",
  anr_investissements_d_avenir: "part_anr_investissements_d_avenir",
  contrats_et_prestations_de_recherche_hors_anr:
    "part_contrats_et_prestations_de_recherche_hors_anr",
  subventions_de_la_region: "part_subventions_de_la_region",
  subventions_union_europeenne: "part_subventions_union_europeenne",
  autres_ressources_propres: "part_autres_ressources_propres",
  autres_subventions: "part_autres_subventions",
};

export const PREDEFINED_ANALYSES = {
  "ressources-total": {
    label: "Total des ressources",
    metrics: ["produits_de_fonctionnement_encaissables"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-scsp": {
    label: "SCSP",
    metrics: ["scsp"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-propres": {
    label: "Ressources propres",
    metrics: ["ressources_propres"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-vs-effectifs": {
    label: "Ressources vs effectifs",
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
    label: "Subventions UE",
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
  "ressources-formation": {
    label: "Ressources propres formation",
    metrics: ["tot_ress_formation"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-recherche": {
    label: "Ressources propres recherche",
    metrics: ["tot_ress_recherche"],
    category: "Ressources",
    showBase100: false,
  },
  "ressources-autres-recettes": {
    label: "Autres ressources propres (hors formation/recherche)",
    metrics: ["tot_ress_autres_recette"],
    category: "Ressources",
    showBase100: false,
  },

  "sante-fonds-roulement": {
    label: "Fonds de roulement net global",
    metrics: ["fonds_de_roulement_net_global"],
    category: "Santé financière",
    showBase100: false,
  },
  "sante-bfr": {
    label: "Besoin en fonds de roulement",
    metrics: ["besoin_en_fonds_de_roulement"],
    category: "Santé financière",
    showBase100: false,
  },
  "sante-tresorerie": {
    label: "Trésorerie",
    metrics: ["tresorerie"],
    category: "Santé financière",
    showBase100: false,
  },
  "sante-fonds-roulement-jours": {
    label: "Fonds de roulement en jours de fonctionnement",
    metrics: ["fonds_de_roulement_en_jours_de_fonctionnement"],
    category: "Santé financière",
    showBase100: false,
  },
  "sante-tresorerie-jours": {
    label: "Trésorerie en jours de fonctionnement",
    metrics: ["tresorerie_en_jours_de_fonctionnement"],
    category: "Santé financière",
    showBase100: false,
  },
  "sante-charges-produits": {
    label: "Charges décaissables / Produits encaissables",
    metrics: ["charges_decaissables_produits_encaissables"],
    category: "Santé financière",
    showBase100: false,
  },
  "sante-taux-remuneration": {
    label: "Taux de rémunération des permanents",
    metrics: ["taux_de_remuneration_des_permanents"],
    category: "Santé financière",
    showBase100: false,
  },
  "sante-ressources-propres": {
    label: "Ressources propres / Produits encaissables",
    metrics: ["ressources_propres_produits_encaissables"],
    category: "Santé financière",
    showBase100: false,
  },
  "sante-caf-immobilisations": {
    label: "CAF / Acquisitions d'immobilisations",
    metrics: ["caf_acquisitions_d_immobilisations"],
    category: "Santé financière",
    showBase100: false,
  },
  "sante-solde-budgetaire": {
    label: "Solde budgétaire",
    metrics: ["solde_budgetaire"],
    category: "Santé financière",
    showBase100: false,
  },
  "sante-equilibre-exploitation": {
    label: "FR, BFR et Trésorerie",
    metrics: ["fonds_de_roulement_net_global", "besoin_en_fonds_de_roulement"],
    category: "Santé financière",
    showBase100: true,
  },

  "scsp-par-etudiant": {
    label: "SCSP par étudiant",
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
    label: "Dépenses de masse salariale",
    metrics: ["charges_de_personnel"],
    category: "Masse salariale",
    showBase100: false,
  },
  "masse-salariale-poids": {
    label: "Poids sur produits encaissables",
    metrics: ["charges_de_personnel_produits_encaissables"],
    category: "Masse salariale",
    showBase100: false,
  },
  "masse-salariale-comparaison": {
    label: "Charges et poids sur produits",
    metrics: [
      "charges_de_personnel_produits_encaissables",
      "charges_de_personnel",
    ],
    category: "Masse salariale",
    showBase100: true,
  },

  "enseignants-emplois": {
    label: "Emplois enseignants (ETPT)",
    metrics: ["emploi_etpt"],
    category: "Personnel",
    showBase100: false,
  },
  "enseignants-taux": {
    label: "Taux d'encadrement",
    metrics: ["taux_encadrement"],
    category: "Personnel",
    showBase100: false,
  },
  "enseignants-comparaison": {
    label: "Taux et emplois ETPT",
    metrics: ["taux_encadrement", "emploi_etpt"],
    category: "Personnel",
    showBase100: true,
  },

  "formations-cycles": {
    label: "Effectifs par cycle (L/M/D)",
    metrics: [
      "effectif_sans_cpge_l",
      "effectif_sans_cpge_m",
      "effectif_sans_cpge_d",
    ],
    category: "Formations",
    showBase100: false,
    chartType: "stacked",
  },
  "formations-degres": {
    label: "Effectifs par degré",
    metrics: [
      "effectif_sans_cpge_deg0",
      "effectif_sans_cpge_deg1",
      "effectif_sans_cpge_deg2",
      "effectif_sans_cpge_deg3",
      "effectif_sans_cpge_deg4",
      "effectif_sans_cpge_deg5",
      "effectif_sans_cpge_deg6",
      "effectif_sans_cpge_deg9",
    ],
    category: "Formations",
    showBase100: false,
    chartType: "stacked",
  },
  "formations-disciplines": {
    label: "Effectifs par discipline",
    metrics: [
      "effectif_sans_cpge_dsa",
      "effectif_sans_cpge_llsh",
      "effectif_sans_cpge_theo",
      "effectif_sans_cpge_si",
      "effectif_sans_cpge_staps",
      "effectif_sans_cpge_sante",
      "effectif_sans_cpge_veto",
      "effectif_sans_cpge_interd",
    ],
    category: "Formations",
    showBase100: false,
    chartType: "stacked",
  },
  "formations-diplomes": {
    label: "Effectifs par type de diplôme",
    metrics: ["effectif_sans_cpge_du", "effectif_sans_cpge_dn"],
    category: "Formations",
    showBase100: false,
    chartType: "stacked",
  },
} as const;

export function useAnalysesWithData(etablissementId: string) {
  const { data, isLoading } = useFinanceEtablissementEvolution(etablissementId);

  const analysesWithData = useMemo(() => {
    if (!data || data.length === 0) return new Set<AnalysisKey>();

    const available = new Set<AnalysisKey>();
    const analysisKeys = Object.keys(PREDEFINED_ANALYSES) as AnalysisKey[];

    analysisKeys.forEach((key) => {
      const analysis = PREDEFINED_ANALYSES[key];
      const isStacked = (analysis as any).chartType === "stacked";

      const hasData = isStacked
        ? analysis.metrics.some((metric) => {
            return data.some((item: any) => {
              const value = item[metric];
              return value != null && value !== 0;
            });
          })
        : analysis.metrics.every((metric) => {
            return data.some((item: any) => {
              const value = item[metric];
              return value != null && value !== 0;
            });
          });

      if (hasData) {
        available.add(key);
      }
    });

    return available;
  }, [data]);

  const years = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((d) => d.exercice))]
      .filter((y): y is number => typeof y === "number")
      .sort((a, b) => a - b);
  }, [data]);

  const periodText = useMemo(() => {
    if (years.length === 0) return "Aucune donnée";
    return `${years[0]} - ${years[years.length - 1]}`;
  }, [years]);

  return { analysesWithData, periodText, isLoading, data };
}

export default function EvolutionChart({
  etablissementId,
  etablissementName,
  selectedAnalysis,
}: EvolutionChartProps) {
  const { data } = useFinanceEtablissementEvolution(etablissementId);

  const analysisConfig = PREDEFINED_ANALYSES[selectedAnalysis];

  const selectedMetrics = useMemo(() => {
    return [...analysisConfig.metrics] as MetricKey[];
  }, [analysisConfig]);

  const showBase100 = useMemo(() => {
    return analysisConfig.showBase100 || false;
  }, [analysisConfig]);

  const isStacked = useMemo(() => {
    return (analysisConfig as any).chartType === "stacked";
  }, [analysisConfig]);

  const chartOptions = useMemo(() => {
    if (!data || data.length === 0 || !selectedAnalysis) return null;

    if (isStacked) {
      return createStackedEvolutionChartOptions(
        data,
        selectedMetrics,
        METRICS_CONFIG
      );
    }

    return createEvolutionChartOptions(
      data,
      selectedMetrics,
      METRICS_CONFIG,
      false
    );
  }, [data, selectedMetrics, selectedAnalysis, isStacked]);

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
    return `${years[0]} - ${years[years.length - 1]}`;
  }, [years]);

  const partMetricKey = useMemo(() => {
    if (selectedMetrics.length !== 1) return null;
    const partKey = METRIC_TO_PART[selectedMetrics[0]];
    if (!partKey) return null;
    const hasPartData = data?.some(
      (item: any) => item[partKey] != null && item[partKey] !== 0
    );
    return hasPartData ? partKey : null;
  }, [selectedMetrics, data]);

  const partChartOptions = useMemo(() => {
    if (!data || data.length === 0 || !partMetricKey) return null;

    return createEvolutionChartOptions(
      data,
      [partMetricKey] as MetricKey[],
      METRICS_CONFIG,
      false
    );
  }, [data, partMetricKey]);

  if (!data || data.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  if (isStacked && chartOptions) {
    return (
      <ChartWrapper
        config={{
          id: "evolution-chart-stacked",
          idQuery: "evolution-stacked",
          title: {
            className: "fr-mt-0w",
            look: "h5",
            size: "h3",
            fr: (
              <>
                {analysisConfig.label} — {etablissementName}
              </>
            ),
          },
          comment: {
            fr: (
              <>
                Évolution des effectifs par{" "}
                {analysisConfig.label
                  .toLowerCase()
                  .replace("effectifs par ", "")}{" "}
                sur la période {periodText}.
              </>
            ),
          },
          integrationURL: "/integration-url",
        }}
        options={chartOptions}
        renderData={() => (
          <RenderDataStacked
            data={data}
            metrics={selectedMetrics}
            metricsConfig={METRICS_CONFIG}
          />
        )}
      />
    );
  }

  if (selectedMetrics.length === 1 && chartOptions) {
    return (
      <>
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
                  Évolution de{" "}
                  {METRICS_CONFIG[selectedMetrics[0]].label.toLowerCase()} sur
                  la période {periodText}.
                </>
              ),
            },
            integrationURL: "/integration-url",
          }}
          options={chartOptions}
          renderData={() => (
            <RenderDataSingle
              data={data}
              metricKey={selectedMetrics[0]}
              metricConfig={METRICS_CONFIG[selectedMetrics[0]]}
            />
          )}
        />

        {partMetricKey && partChartOptions && (
          <div className="fr-mt-3w">
            <ChartWrapper
              config={{
                id: "evolution-chart-part",
                idQuery: "evolution-part",
                title: {
                  className: "fr-mt-0w",
                  look: "h6",
                  size: "h4",
                  fr: (
                    <>
                      {METRICS_CONFIG[partMetricKey].label} —{" "}
                      {etablissementName}
                    </>
                  ),
                },
                comment: {
                  fr: (
                    <>
                      Évolution de la {METRICS_CONFIG[partMetricKey].label} sur
                      ressources propres sur la période {periodText}.
                    </>
                  ),
                },
                integrationURL: "/integration-url",
              }}
              options={partChartOptions}
              renderData={() => (
                <RenderDataSingle
                  data={data}
                  metricKey={partMetricKey}
                  metricConfig={METRICS_CONFIG[partMetricKey]}
                />
              )}
            />
          </div>
        )}
      </>
    );
  }

  if (selectedMetrics.length === 2) {
    return (
      <>
        {chartOptionsBase100 && (
          <ChartWrapper
            config={{
              id: "evolution-chart-comparison",
              idQuery: "evolution-comparison",
              title: {
                className: "fr-mt-0w",
                look: "h5",
                size: "h3",
                fr: (
                  <>
                    {PREDEFINED_ANALYSES[selectedAnalysis].label} (base 100) —{" "}
                    {etablissementName}
                  </>
                ),
              },
              comment: {
                fr: (
                  <>
                    Comparaison de{" "}
                    {METRICS_CONFIG[selectedMetrics[0]].label.toLowerCase()} et{" "}
                    {METRICS_CONFIG[selectedMetrics[1]].label.toLowerCase()} en
                    base 100.
                  </>
                ),
              },
              integrationURL: "/integration-url",
            }}
            options={chartOptionsBase100}
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

        <div className="fr-mt-3w">
          <Row gutters>
            <Col md="6" xs="12">
              <ChartWrapper
                config={{
                  id: "evolution-chart-metric1",
                  idQuery: "evolution-metric1",
                  title: {
                    className: "fr-mt-0w",
                    look: "h6",
                    size: "h4",
                    fr: <>{METRICS_CONFIG[selectedMetrics[0]].label}</>,
                  },
                  integrationURL: "/integration-url",
                }}
                options={createEvolutionChartOptions(
                  data,
                  [selectedMetrics[0]] as MetricKey[],
                  METRICS_CONFIG,
                  false
                )}
                renderData={() => (
                  <RenderDataSingle
                    data={data}
                    metricKey={selectedMetrics[0]}
                    metricConfig={METRICS_CONFIG[selectedMetrics[0]]}
                  />
                )}
              />
            </Col>

            <Col md="6" xs="12">
              <ChartWrapper
                config={{
                  id: "evolution-chart-metric2",
                  idQuery: "evolution-metric2",
                  title: {
                    className: "fr-mt-0w",
                    look: "h6",
                    size: "h4",
                    fr: <>{METRICS_CONFIG[selectedMetrics[1]].label}</>,
                  },
                  integrationURL: "/integration-url",
                }}
                options={createEvolutionChartOptions(
                  data,
                  [selectedMetrics[1]] as MetricKey[],
                  METRICS_CONFIG,
                  false
                )}
                renderData={() => (
                  <RenderDataSingle
                    data={data}
                    metricKey={selectedMetrics[1]}
                    metricConfig={METRICS_CONFIG[selectedMetrics[1]]}
                  />
                )}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }

  return null;
}
