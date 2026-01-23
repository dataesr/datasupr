import { Row, Col } from "@dataesr/dsfr-plus";
import { useMetricEvolution } from "../api";
import { MetricChartCard } from "../../../../../../components/metric-chart-card/metric-chart-card";
import { SECTION_COLORS } from "../../../../constants/colors";
import RessourcesPropresChart from "./charts/ressources-propres";
// import RessourcesPropresEvolutionChart from "./charts/ressources-propres-evolution";
import "../styles.scss";
import RessourcesPropresEvolutionChart from "./charts/ressources-propres-evolution";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";

const SECTION_COLOR = SECTION_COLORS.ressources;

interface FinancementsSectionProps {
  data: any;
  selectedYear?: string | number;
}

export function FinancementsSection({
  data,
  selectedYear,
}: FinancementsSectionProps) {
  return (
    <div
      id="section-financements"
      role="region"
      aria-labelledby="section-financements"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <h3 className="fr-h5 section-header__title">
          Les ressources de l'établissement
          <label
            className="fr-label"
            htmlFor="select-year-financements"
          ></label>
        </h3>
      </div>

      <div className="fr-mb-4w">
        <Row gutters>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Total"
              value={`${euro(data.produits_de_fonctionnement_encaissables)} €`}
              detail="Hors opérations en capital"
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution(
                "produits_de_fonctionnement_encaissables"
              )}
              unit="€"
            />
          </Col>

          <Col xs="12" md="4">
            <MetricChartCard
              title="Ressources propres"
              value={`${euro(data.recettes_propres)} €`}
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("recettes_propres")}
              unit="€"
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Autonomie financière"
              value={
                data.ressources_propres_produits_encaissables != null
                  ? `${data.ressources_propres_produits_encaissables.toFixed(
                      1
                    )} %`
                  : "—"
              }
              detail="Part des ressources propres sur le total"
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution(
                "ressources_propres_produits_encaissables"
              )}
              unit="%"
            />
          </Col>
        </Row>
      </div>

      <div className="fr-mb-4w">
        <h3 className="fr-h5 fr-mb-3w">
          Subvention pour charges de service public (SCSP)
        </h3>
        <Row gutters>
          <Col xs="12" md="3">
            <MetricChartCard
              title="SCSP"
              value={`${euro(data.scsp)} €`}
              detail={
                data.is_rce === false
                  ? "Dotation de l'État (inclut la masse salariale prise en charge par l'État)"
                  : "Dotation de l'État"
              }
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("scsp")}
              unit="€"
            />
          </Col>

          <Col xs="12" md="3">
            <MetricChartCard
              title={`SCSP par étudiant financé`}
              value={`${euro(data.scsp_par_etudiants)} €`}
              detail={
                data.scsp_etudiants
                  ? `${
                      data.is_rce === false
                        ? " (inclut la masse salariale prise en charge par l'État)"
                        : ""
                    }`
                  : data.is_rce === false
                    ? "Ratio SCSP / étudiants financés (inclut la masse salariale prise en charge par l'État)"
                    : "Ratio SCSP / étudiants financés"
              }
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("scsp_par_etudiants")}
              unit="€"
            />
          </Col>
          <Col xs="12" md="3">
            <MetricChartCard
              title={`Nombre d'étudiants financés par la SCSP`}
              value={
                data.scsp_etudiants != null
                  ? `${data.scsp_etudiants.toLocaleString("fr-FR")} étudiant${
                      data.scsp_etudiants > 1 ? "s" : ""
                    } en ${data.anuniv}`
                  : "—"
              }
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("scsp_etudiants")}
              unit="étudiants"
            />
          </Col>
          <Col xs="12" md="3">
            <MetricChartCard
              title="Part des étudiants financés"
              value={
                data.part_scsp_etudiants_effectif_sans_cpge != null
                  ? `${data.part_scsp_etudiants_effectif_sans_cpge.toFixed(
                      1
                    )} %`
                  : "—"
              }
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution(
                "part_scsp_etudiants_effectif_sans_cpge"
              )}
              unit="%"
            />
          </Col>
        </Row>
      </div>

      <div className="fr-mb-4w">
        <h3 className="fr-h5 fr-mb-3w">Détail des ressources propres</h3>
        <Row gutters>
          <Col xs="12" sm="6" md="4">
            <MetricChartCard
              title="Ressources propres liées aux activités de formation"
              value={
                data.tot_ress_formation != null
                  ? `${data.tot_ress_formation.toLocaleString("fr-FR", {
                      maximumFractionDigits: 0,
                    })} €`
                  : "—"
              }
              detail={
                data.part_ress_formation != null
                  ? `${data.part_ress_formation.toFixed(
                      1
                    )} % des ressources propres`
                  : "Part des ressources propres"
              }
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("tot_ress_formation")}
              unit="€"
            />
          </Col>
          <Col xs="12" sm="6" md="4">
            <MetricChartCard
              title="Ressources propres liées aux activités de recherche"
              value={
                data.tot_ress_recherche != null
                  ? `${data.tot_ress_recherche.toLocaleString("fr-FR", {
                      maximumFractionDigits: 0,
                    })} €`
                  : "—"
              }
              detail={
                data.part_ress_recherche != null
                  ? `${data.part_ress_recherche.toFixed(
                      1
                    )} % des ressources propres`
                  : "Part des ressources propres"
              }
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("tot_ress_recherche")}
              unit="€"
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Autres ressources propres"
              value={
                data.tot_ress_autres_recette != null
                  ? `${data.tot_ress_autres_recette.toLocaleString("fr-FR", {
                      maximumFractionDigits: 0,
                    })} €`
                  : "—"
              }
              detail={
                data.part_ress_autres_recette != null
                  ? `${data.part_ress_autres_recette.toFixed(
                      1
                    )} % des ressources propres`
                  : "Part des ressources propres"
              }
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("tot_ress_autres_recette")}
              unit="€"
            />
          </Col>
        </Row>
      </div>

      <div className="fr-mb-4w">
        <RessourcesPropresChart
          data={data}
          selectedYear={selectedYear}
          etablissementName={data?.etablissement_lib}
        />
      </div>

      <div className="fr-mb-4w">
        <RessourcesPropresEvolutionChart
          etablissementName={data?.etablissement_lib}
        />
      </div>
    </div>
  );
}
