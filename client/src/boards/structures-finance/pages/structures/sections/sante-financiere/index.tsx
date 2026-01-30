import { Row, Col, Title } from "@dataesr/dsfr-plus";
import { useMetricEvolution } from "../api";
import { MetricChartCard } from "../../../../../../components/metric-chart-card/metric-chart-card";
import { SECTION_COLORS } from "../../../../constants/colors";
import StatusIndicator from "../../../../../../components/status-indicator";
import MetricDefinitionsTable from "../analyses/components/metric-definitions-table";
import { parseMarkdown } from "../../../../../../utils/format";
import "../styles.scss";

type FinanceStatus = "alerte" | "vigilance" | "normal";

const euro = (n?: number) =>
  n != null
    ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €"
    : "—";

const pct = (n?: number) => (n != null ? `${n.toFixed(1)} %` : "—");

const jours = (n?: number) => {
  if (n == null) return "—";
  const val = n.toFixed(1);
  return `${val} jour${Math.abs(n) > 1 ? "s" : ""}`;
};

const SECTION_COLOR = SECTION_COLORS.santeFinanciere;

const ValueWithStatus = ({
  value,
  status,
  indicateur,
}: {
  value: string;
  status?: string;
  indicateur: string;
}) => (
  <>
    {value}{" "}
    {status && (
      <StatusIndicator
        status={status as FinanceStatus}
        indicateur={indicateur}
      />
    )}
  </>
);

interface SanteFinancierSectionProps {
  data: any;
}

export function SanteFinancierSection({ data }: SanteFinancierSectionProps) {
  const showResultatHorsSie =
    data?.resultat_net_comptable != null &&
    data?.resultat_net_comptable_hors_sie != null &&
    data.resultat_net_comptable !== data.resultat_net_comptable_hors_sie;

  const Metric = ({
    id,
    title,
    format = euro,
    detail,
    unit,
  }: {
    id: string;
    title: string;
    format?: (n?: number) => string;
    detail?: string;
    unit: string;
    colSize?: string;
  }) => (
    <Col xs="12" sm="6" md="4">
      <MetricChartCard
        title={title}
        value={
          data[`${id}_etat`] ? (
            <ValueWithStatus
              value={format(data[id])}
              status={data[`${id}_etat`]}
              indicateur={id}
            />
          ) : (
            format(data[id])
          )
        }
        detail={detail}
        color={SECTION_COLOR}
        evolutionData={useMetricEvolution(id)}
        unit={unit}
      />
    </Col>
  );

  return (
    <section
      id="section-sante-financier"
      aria-labelledby="section-sante-financier-title"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <Title
          as="h2"
          look="h5"
          id="section-sante-financier-title"
          className="section-header__title"
        >
          Equilibre financier
        </Title>
      </div>

      {data?.is_rce && (
        <div className="fr-callout fr-mb-4w">
          <h3 className="fr-callout__title">Point d'attention</h3>
          <p className="fr-callout__text fr-text--sm">
            Pour les établissements qui bénéficient des responsabilités et
            compétences élargies (RCE), un ou deux niveaux d'alerte ont été
            définis pour chaque indicateur :
          </p>
          <ul className="fr-callout__text fr-text--sm fr-ml-2w">
            <li>
              <strong style={{ color: "var(--text-default-warning)" }}>
                Orange
              </strong>{" "}
              : seuil à partir duquel une vigilance particulière doit être
              accordée sur la santé financière de l'établissement, situation à
              surveiller.
            </li>
            <li>
              <strong style={{ color: "var(--text-default-error)" }}>
                Rouge
              </strong>{" "}
              : seuil qui révèle un risque quant à la santé financière de
              l'établissement. Alerte.
            </li>
          </ul>
          <p className="fr-callout__text fr-text--sm fr-mb-0">
            Ces seuils d'alerte doivent être interprétés au regard de l'activité
            de l'établissement, du groupe disciplinaire auquel il appartient et
            des évènements significatifs intervenus au cours de l'exercice.
            L'appréciation du niveau de risque résulte également de
            l'interprétation d'un ensemble d'indicateurs mis en relation les uns
            avec les autres. Ces alertes doivent toujours être contextualisées.
          </p>
        </div>
      )}

      {data?.analyse_financiere && (
        <section className="fr-accordion fr-mb-4w">
          <Title as="h3" className="fr-accordion__title">
            <button
              className="fr-accordion__btn"
              aria-expanded="false"
              aria-controls="accordion-synthese"
            >
              Synthèse de l'analyse financière
            </button>
          </Title>
          <div className="fr-collapse" id="accordion-synthese">
            <div
              className="fr-mb-2w"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(data.analyse_financiere),
              }}
            />
            <p
              className="fr-text--sm fr-mb-0"
              style={{
                fontStyle: "italic",
                color: "var(--text-mention-grey)",
              }}
            >
              Cette analyse a été générée à l'aide d'un algorithme d'analyse
              financière automatisée, développé pour traiter et interpréter des
              données structurées. L'algorithme utilise les indicateurs
              financiers clés, les états (alerte/vigilance), ainsi que les
              évolutions interannuelles pour produire une synthèse
              contextualisée. Les interprétations sont basées sur des règles
              prédéfinies, et sont adaptées aux spécificités de chaque
              établissement et exercice. Cette approche permet une analyse
              objective, reproductible et exhaustive des données financières.
            </p>
          </div>
        </section>
      )}

      <div className="fr-mb-4w">
        <Row gutters>
          <Metric
            id="resultat_net_comptable"
            title="Résultat net comptable"
            detail="Le résultat net comptable mesure les ressources nettes restant à l'établissement à l'issue de l'exercice. Indique la performance financière globale de l'établissement."
            unit="€"
            colSize={showResultatHorsSie ? "6" : "4"}
          />
          {showResultatHorsSie && (
            <Metric
              id="resultat_net_comptable_hors_sie"
              title="Résultat net comptable hors SIE"
              detail="Le résultat net comptable hors services inter-établissements mesure les ressources nettes restant à l'établissement à l'issue de l'exercice sans prendre en compte les services communs à plusieurs établissements (service de documentation par exemple). Indique la performance financière globale de l'établissement."
              unit="€"
              colSize="6"
            />
          )}
          <Metric
            id="capacite_d_autofinancement"
            title="Capacité d'autofinancement"
            detail="Épargne dégagée pendant l'exercice qui permettra d'assurer tout ou partie de l'investissement de l'année et d'augmenter le fonds de roulement."
            unit="€"
            colSize={showResultatHorsSie ? "6" : "4"}
          />
          <Metric
            id="caf_produits_encaissables"
            title="CAF / Produits encaissables"
            format={pct}
            unit="%"
            colSize={showResultatHorsSie ? "6" : "4"}
          />
        </Row>
      </div>

      <div className="fr-mb-4w">
        <h3 className="fr-h5 fr-mb-3w">Cycle d'exploitation</h3>
        <Row gutters>
          <Metric
            id="fonds_de_roulement_net_global"
            title="Fonds de roulement net global"
            detail="Ressource durable ou structurelle mise à disposition de l'établissement pour financer des emplois (investissements) liés au cycle d'exploitation. Il constitue une marge de sécurité financière destinée à financer une partie de l'actif circulant."
            unit="€"
          />
          <Metric
            id="besoin_en_fonds_de_roulement"
            title="Besoin en fonds de roulement"
            detail="Le besoin en fonds de roulement mesure le décalage entre les encaissements et les décaissements du cycle d'activité."
            unit="€"
          />
          <Metric
            id="tresorerie"
            title="Trésorerie"
            detail="Liquidités immédiatement disponibles (caisse, banque, VMP)."
            unit="€"
          />
          <Metric
            id="fonds_de_roulement_en_jours_de_fonctionnement"
            title="Fonds de roulement en jours de fonctionnement"
            format={jours}
            detail={`Expression du fonds de roulement en nombre de jours de fonctionnement. Un fonds de roulement net global de ${Math.ceil(data.fonds_de_roulement_en_jours_de_fonctionnement)} jours signifie que l'établissement peut couvrir ${Math.ceil(data.fonds_de_roulement_en_jours_de_fonctionnement)} jours de dépenses courantes.`}
            unit="jours"
          />
          <Metric
            id="tresorerie_en_jours_de_fonctionnement"
            title="Trésorerie en jours de fonctionnement"
            format={jours}
            detail="Expression de la trésorerie en nombre de jours de fonctionnement. Indique la durée pendant laquelle l'établissement peut fonctionner sans nouvel encaissement."
            unit="jours"
          />
        </Row>
      </div>

      <div className="fr-mb-4w">
        <h3 className="fr-h5 fr-mb-3w">Financement de l'activité</h3>
        <Row gutters>
          <Metric
            id="charges_decaissables_produits_encaissables"
            title="Charges décaissables / Produits encaissables"
            format={pct}
            detail="Ratio mesurant l'équilibre entre les dépenses réelles (décaissables) et les recettes réelles (encaissables)."
            unit="%"
            colSize="3"
          />
          <Metric
            id="taux_de_remuneration_des_permanents"
            title="Taux de rémunération des permanents"
            format={pct}
            detail="Indique la part des recettes consacrée à la rémunération du personnel titulaire."
            unit="%"
            colSize="3"
          />
          <Metric
            id="ressources_propres_produits_encaissables"
            title="Ressources propres / Produits encaissables"
            format={pct}
            detail="Part des ressources propres (hors subventions pour charges de service public) dans les produits totaux. Mesure l'autonomie financière."
            unit="%"
            colSize="3"
          />
          <Metric
            id="charges_de_personnel_produits_encaissables"
            title="Charges de personnel / Produits encaissables"
            format={pct}
            detail="Ratio entre la masse salariale et les produits. Évalue le poids des coûts salariaux."
            unit="%"
            colSize="3"
          />
        </Row>
      </div>

      <div className="fr-mb-4w">
        <Row gutters>
          <Metric
            id="caf_acquisitions_d_immobilisations"
            title="CAF / Acquisitions d'immobilisations"
            format={pct}
            detail="Ratio entre la CAF et les investissements en immobilisations. Indique si l'activité génère suffisamment de ressources pour financer les investissements."
            unit="%"
            colSize="6"
          />
          <Metric
            id="solde_budgetaire"
            title="Solde budgétaire"
            detail="Le solde budgétaire est un solde intermédiaire de trésorerie, reflétant le flux de trésorerie généré par l'activité de l'organisme au cours d'un exercice."
            unit="€"
            colSize="6"
          />
        </Row>
      </div>

      <MetricDefinitionsTable
        metricKeys={[
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
        ]}
      />
    </section>
  );
}
