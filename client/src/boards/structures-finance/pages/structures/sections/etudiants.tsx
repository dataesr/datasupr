import { useSearchParams } from "react-router-dom";
import { Row, Col } from "@dataesr/dsfr-plus";
import EffectifsChart from "../charts/effectifs";
import { SmallMetricCard } from "../components/metric-cards/small-metric-card";
import { MetricChartCard } from "../../../../../components/metric-chart-card/metric-chart-card";
import { FORMATION_COLORS } from "../../../constants/formation-colors";
import { CHART_COLORS } from "../../../constants/colors";
import {
  useFinanceEtablissementEvolution,
  useFinanceYears,
} from "../../../api";
import "./styles.scss";

interface EtudiantsSectionProps {
  data: any;
  selectedYear?: string | number;
  selectedEtablissement?: string;
}

const num = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";

export function EtudiantsSection({
  data,
  selectedYear,
  selectedEtablissement,
}: EtudiantsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = yearsData?.years || [];

  const { data: evolutionData } = useFinanceEtablissementEvolution(
    selectedEtablissement || "",
    !!selectedEtablissement
  );

  const handleYearChange = (year: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("year", year);
    setSearchParams(next);
  };

  const getEvolutionData = (metricKey: string) => {
    if (!evolutionData || evolutionData.length === 0) return undefined;
    const yearNum = selectedYear ? Number(selectedYear) : null;
    return evolutionData
      .sort((a: any, b: any) => a.exercice - b.exercice)
      .filter((item: any) => !yearNum || item.exercice <= yearNum)
      .map((item: any) => ({ exercice: item.exercice, value: item[metricKey] }))
      .filter((item: any) => item.value != null && !isNaN(item.value));
  };

  return (
    <div
      id="section-etudiants"
      role="region"
      aria-labelledby="section-etudiants"
      className="fr-p-3w section-container"
    >
      <div className="section-header fr-mb-3w">
        <h3 className="fr-h6 section-header__title">
          Répartition des effectifs {`(${data.anuniv})`}
        </h3>
        <label className="fr-label" htmlFor="select-year-etudiants"></label>
        <div className="fr-select-group section-header__year-selector">
          <select
            className="fr-select"
            id="select-year-etudiants"
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="fr-mb-4w">
        <Row gutters>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Nombre d'étudiants inscrits"
              value={num(data.effectif_sans_cpge)}
              detail="Total des inscriptions"
              color={CHART_COLORS.primary}
              evolutionData={getEvolutionData("effectif_sans_cpge")}
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Diplômes nationaux"
              value={num(data.effectif_sans_cpge_dn)}
              detail="Étudiants inscrits en diplômes nationaux"
              color={CHART_COLORS.secondary}
              evolutionData={getEvolutionData("effectif_sans_cpge_dn")}
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Diplômes d'établissement"
              value={num(data.effectif_sans_cpge_du)}
              detail="Étudiants inscrits en diplômes d'établissement"
              color={CHART_COLORS.tertiary}
              evolutionData={getEvolutionData("effectif_sans_cpge_du")}
            />
          </Col>
        </Row>
      </div>

      <EffectifsChart
        data={data}
        selectedYear={selectedYear}
        etablissementName={data.etablissement_lib}
      />
      <div className="fr-mb-3w">
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {(data?.has_effectif_l ||
            data?.has_effectif_m ||
            data?.has_effectif_d) && (
            <div className="fr-mb-2w">
              <div
                className="fr-text--xs fr-mb-1w"
                style={{ fontWeight: 600, color: "var(--text-mention-grey)" }}
              >
                Niveau de cursus
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {data?.has_effectif_l && (
                  <SmallMetricCard
                    label="1er cycle (cursus L)"
                    value={num(data.effectif_sans_cpge_l)}
                    color={FORMATION_COLORS.licence}
                    sparklineData={getEvolutionData(
                      "effectif_sans_cpge_l"
                    )?.map((d) => d.value)}
                  />
                )}
                {data?.has_effectif_m && (
                  <SmallMetricCard
                    label="2ème cycle (cursus M)"
                    value={num(data.effectif_sans_cpge_m)}
                    color={FORMATION_COLORS.master}
                    sparklineData={getEvolutionData(
                      "effectif_sans_cpge_m"
                    )?.map((d) => d.value)}
                  />
                )}
                {data?.has_effectif_d && (
                  <SmallMetricCard
                    label="3ème cycle (cursus D)"
                    value={num(data.effectif_sans_cpge_d)}
                    color={FORMATION_COLORS.doctorat}
                    sparklineData={getEvolutionData(
                      "effectif_sans_cpge_d"
                    )?.map((d) => d.value)}
                  />
                )}
              </div>
            </div>
          )}

          {((data?.has_effectif_iut && data?.effectif_sans_cpge_iut > 0) ||
            (data?.has_effectif_ing && data?.effectif_sans_cpge_ing > 0) ||
            (data?.has_effectif_sante &&
              data?.effectif_sans_cpge_sante > 0)) && (
            <div className="fr-mb-2w">
              <div
                className="fr-text--xs fr-mb-1w"
                style={{ fontWeight: 600, color: "var(--text-mention-grey)" }}
              >
                Filières spécifiques
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {data?.has_effectif_iut && data?.effectif_sans_cpge_iut > 0 && (
                  <SmallMetricCard
                    label="formations d'IUT"
                    value={num(data.effectif_sans_cpge_iut)}
                    color={FORMATION_COLORS.iut}
                    sparklineData={getEvolutionData(
                      "effectif_sans_cpge_iut"
                    )?.map((d) => d.value)}
                  />
                )}
                {data?.has_effectif_ing && data?.effectif_sans_cpge_ing > 0 && (
                  <SmallMetricCard
                    label="formations d'ingénieurs"
                    value={num(data.effectif_sans_cpge_ing)}
                    color={FORMATION_COLORS.ingenieur}
                    sparklineData={getEvolutionData(
                      "effectif_sans_cpge_ing"
                    )?.map((d) => d.value)}
                  />
                )}
                {data?.has_effectif_sante &&
                  data?.effectif_sans_cpge_sante > 0 && (
                    <SmallMetricCard
                      label="formation de santé"
                      value={num(data.effectif_sans_cpge_sante)}
                      color={FORMATION_COLORS.sante}
                      sparklineData={getEvolutionData(
                        "effectif_sans_cpge_sante"
                      )?.map((d) => d.value)}
                    />
                  )}
              </div>
            </div>
          )}
        </div>

        {((data?.has_effectif_dsa && data?.effectif_sans_cpge_dsa > 0) ||
          (data?.has_effectif_llsh && data?.effectif_sans_cpge_llsh > 0) ||
          (data?.has_effectif_theo && data?.effectif_sans_cpge_theo > 0) ||
          (data?.has_effectif_si && data?.effectif_sans_cpge_si > 0) ||
          (data?.has_effectif_staps && data?.effectif_sans_cpge_staps > 0) ||
          (data?.has_effectif_veto && data?.effectif_sans_cpge_veto > 0) ||
          (data?.has_effectif_interd &&
            data?.effectif_sans_cpge_interd > 0)) && (
          <div className="fr-mb-2w">
            <div
              className="fr-text--xs fr-mb-1w"
              style={{ fontWeight: 600, color: "var(--text-mention-grey)" }}
            >
              Disciplines
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data?.has_effectif_dsa && data?.effectif_sans_cpge_dsa > 0 && (
                <SmallMetricCard
                  label="Droit, sciences économiques, AES"
                  value={num(data.effectif_sans_cpge_dsa)}
                  color={FORMATION_COLORS.dsa}
                  sparklineData={getEvolutionData(
                    "effectif_sans_cpge_dsa"
                  )?.map((d) => d.value)}
                />
              )}
              {data?.has_effectif_llsh && data?.effectif_sans_cpge_llsh > 0 && (
                <SmallMetricCard
                  label="Lettres, langues et sciences humaines"
                  value={num(data.effectif_sans_cpge_llsh)}
                  color={FORMATION_COLORS.llsh}
                  sparklineData={getEvolutionData(
                    "effectif_sans_cpge_llsh"
                  )?.map((d) => d.value)}
                />
              )}
              {data?.has_effectif_theo && data?.effectif_sans_cpge_theo > 0 && (
                <SmallMetricCard
                  label="Théologie"
                  value={num(data.effectif_sans_cpge_theo)}
                  color={FORMATION_COLORS.theo}
                  sparklineData={getEvolutionData(
                    "effectif_sans_cpge_theo"
                  )?.map((d) => d.value)}
                />
              )}
              {data?.has_effectif_sante &&
                data?.effectif_sans_cpge_sante > 0 && (
                  <SmallMetricCard
                    label="Formation de santé"
                    value={num(data.effectif_sans_cpge_sante)}
                    color={FORMATION_COLORS.sante}
                    sparklineData={getEvolutionData(
                      "effectif_sans_cpge_sante"
                    )?.map((d) => d.value)}
                  />
                )}
              {data?.has_effectif_si && data?.effectif_sans_cpge_si > 0 && (
                <SmallMetricCard
                  label="Sciences et sciences de l'ingénieur"
                  value={num(data.effectif_sans_cpge_si)}
                  color={FORMATION_COLORS.si}
                  sparklineData={getEvolutionData("effectif_sans_cpge_si")?.map(
                    (d) => d.value
                  )}
                />
              )}
              {data?.has_effectif_staps &&
                data?.effectif_sans_cpge_staps > 0 && (
                  <SmallMetricCard
                    label="STAPS"
                    value={num(data.effectif_sans_cpge_staps)}
                    color={FORMATION_COLORS.staps}
                    sparklineData={getEvolutionData(
                      "effectif_sans_cpge_staps"
                    )?.map((d) => d.value)}
                  />
                )}
              {data?.has_effectif_veto && data?.effectif_sans_cpge_veto > 0 && (
                <SmallMetricCard
                  label="Vétérinaires"
                  value={num(data.effectif_sans_cpge_veto)}
                  color={FORMATION_COLORS.veto}
                  sparklineData={getEvolutionData(
                    "effectif_sans_cpge_veto"
                  )?.map((d) => d.value)}
                />
              )}
              {data?.has_effectif_interd &&
                data?.effectif_sans_cpge_interd > 0 && (
                  <SmallMetricCard
                    label="Interdisciplinaire"
                    value={num(data.effectif_sans_cpge_interd)}
                    color={FORMATION_COLORS.interd}
                    sparklineData={getEvolutionData(
                      "effectif_sans_cpge_interd"
                    )?.map((d) => d.value)}
                  />
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
