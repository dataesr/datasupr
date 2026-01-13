import EffectifsChart from "../charts/effectifs";
import { SmallMetricCard } from "../components/metric-cards/small-metric-card";
import { FORMATION_COLORS } from "../../../constants/formation-colors";
import { useFinanceEtablissementEvolution } from "../../../api";
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
  const { data: evolutionData } = useFinanceEtablissementEvolution(
    selectedEtablissement || "",
    !!selectedEtablissement
  );

  const getEvolutionData = (metricKey: string) => {
    if (!evolutionData || evolutionData.length === 0) return undefined;
    const yearNum = selectedYear ? Number(selectedYear) : null;
    return evolutionData
      .sort((a: any, b: any) => a.exercice - b.exercice)
      .filter((item: any) => !yearNum || item.exercice <= yearNum)
      .map((item: any) => item[metricKey])
      .filter((val: any): val is number => val != null && !isNaN(val));
  };

  return (
    <div
      id="section-etudiants"
      role="region"
      aria-labelledby="section-etudiants"
      className="fr-p-3w section-container"
    >
      <div className="fr-mb-3w">
        <h3 className="fr-h6 fr-mb-2w">
          Répartition des effectifs {selectedYear && `(${selectedYear})`}
        </h3>

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
                    label="Licence"
                    value={num(data.effectif_sans_cpge_l)}
                    color={FORMATION_COLORS.licence}
                    sparklineData={getEvolutionData("effectif_sans_cpge_l")}
                  />
                )}
                {data?.has_effectif_m && (
                  <SmallMetricCard
                    label="Master"
                    value={num(data.effectif_sans_cpge_m)}
                    color={FORMATION_COLORS.master}
                    sparklineData={getEvolutionData("effectif_sans_cpge_m")}
                  />
                )}
                {data?.has_effectif_d && (
                  <SmallMetricCard
                    label="Doctorat"
                    value={num(data.effectif_sans_cpge_d)}
                    color={FORMATION_COLORS.doctorat}
                    sparklineData={getEvolutionData("effectif_sans_cpge_d")}
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
                    label="IUT"
                    value={num(data.effectif_sans_cpge_iut)}
                    color={FORMATION_COLORS.iut}
                    sparklineData={getEvolutionData("effectif_sans_cpge_iut")}
                  />
                )}
                {data?.has_effectif_ing && data?.effectif_sans_cpge_ing > 0 && (
                  <SmallMetricCard
                    label="Ingénieur"
                    value={num(data.effectif_sans_cpge_ing)}
                    color={FORMATION_COLORS.ingenieur}
                    sparklineData={getEvolutionData("effectif_sans_cpge_ing")}
                  />
                )}
                {data?.has_effectif_sante &&
                  data?.effectif_sans_cpge_sante > 0 && (
                    <SmallMetricCard
                      label="Santé"
                      value={num(data.effectif_sans_cpge_sante)}
                      color={FORMATION_COLORS.sante}
                      sparklineData={getEvolutionData(
                        "effectif_sans_cpge_sante"
                      )}
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
                  label="Droit, Éco"
                  value={num(data.effectif_sans_cpge_dsa)}
                  color={FORMATION_COLORS.dsa}
                  sparklineData={getEvolutionData("effectif_sans_cpge_dsa")}
                />
              )}
              {data?.has_effectif_llsh && data?.effectif_sans_cpge_llsh > 0 && (
                <SmallMetricCard
                  label="Lettres, SHS"
                  value={num(data.effectif_sans_cpge_llsh)}
                  color={FORMATION_COLORS.llsh}
                  sparklineData={getEvolutionData("effectif_sans_cpge_llsh")}
                />
              )}
              {data?.has_effectif_theo && data?.effectif_sans_cpge_theo > 0 && (
                <SmallMetricCard
                  label="Théologie"
                  value={num(data.effectif_sans_cpge_theo)}
                  color={FORMATION_COLORS.theo}
                  sparklineData={getEvolutionData("effectif_sans_cpge_theo")}
                />
              )}
              {data?.has_effectif_si && data?.effectif_sans_cpge_si > 0 && (
                <SmallMetricCard
                  label="Sciences"
                  value={num(data.effectif_sans_cpge_si)}
                  color={FORMATION_COLORS.si}
                  sparklineData={getEvolutionData("effectif_sans_cpge_si")}
                />
              )}
              {data?.has_effectif_staps &&
                data?.effectif_sans_cpge_staps > 0 && (
                  <SmallMetricCard
                    label="STAPS"
                    value={num(data.effectif_sans_cpge_staps)}
                    color={FORMATION_COLORS.staps}
                    sparklineData={getEvolutionData("effectif_sans_cpge_staps")}
                  />
                )}
              {data?.has_effectif_veto && data?.effectif_sans_cpge_veto > 0 && (
                <SmallMetricCard
                  label="Vétérinaire"
                  value={num(data.effectif_sans_cpge_veto)}
                  color={FORMATION_COLORS.veto}
                  sparklineData={getEvolutionData("effectif_sans_cpge_veto")}
                />
              )}
              {data?.has_effectif_interd &&
                data?.effectif_sans_cpge_interd > 0 && (
                  <SmallMetricCard
                    label="Pluridiscipl."
                    value={num(data.effectif_sans_cpge_interd)}
                    color={FORMATION_COLORS.interd}
                    sparklineData={getEvolutionData(
                      "effectif_sans_cpge_interd"
                    )}
                  />
                )}
            </div>
          </div>
        )}
      </div>

      <EffectifsChart
        data={data}
        selectedYear={selectedYear}
        etablissementName={data.etablissement_lib}
      />
    </div>
  );
}
