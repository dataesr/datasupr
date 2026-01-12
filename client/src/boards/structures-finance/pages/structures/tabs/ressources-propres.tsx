import { useMemo } from "react";
import { Row, Col } from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "../../../api";
import RessourcesPropresChart from "../charts/ressources-propres";
import RecettesEvolutionChart from "../charts/recettes-evolution";
import { MetricCard } from "../components/metric-cards/metric-card";
import { CHART_COLORS } from "../../../constants/colors";
import "./styles.scss";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";
const pct = (n?: number) => (n != null ? `${n.toFixed(1)} %` : "—");

interface RessourcesPropresTabProps {
  data: any;
  selectedEtablissement?: string;
  selectedYear?: string | number;
}

export function RessourcesPropresTab({
  data,
  selectedEtablissement,
  selectedYear,
}: RessourcesPropresTabProps) {
  const { data: evolutionData } = useFinanceEtablissementEvolution(
    selectedEtablissement || "",
    !!selectedEtablissement
  );

  const totalRessources = data?.recettes_propres || 0;
  const totalProduits = data?.produits_de_fonctionnement_encaissables || 0;
  const percentageOfTotal = totalProduits
    ? (totalRessources / totalProduits) * 100
    : 0;

  const ressourcesPropresEvolution = useMemo(() => {
    if (!evolutionData || !Array.isArray(evolutionData)) return undefined;
    const yearNum = selectedYear ? Number(selectedYear) : null;
    return evolutionData
      .sort((a, b) => a.exercice - b.exercice)
      .filter((item) => !yearNum || item.exercice <= yearNum)
      .map((item) => item.recettes_propres)
      .filter((val): val is number => val != null && !isNaN(val));
  }, [evolutionData, selectedYear]);

  return (
    <div
      id="tabpanel-recettes-propres"
      role="tabpanel"
      aria-labelledby="tab-recettes-propres"
      className="fr-p-3w tab-container"
    >
      <div className="fr-mb-4w">
        <Row gutters>
          <Col xs="12">
            <MetricCard
              title="Total des ressources propres"
              value={`${euro(totalRessources)} €`}
              detail={`${pct(percentageOfTotal)} des ressources totales`}
              color={CHART_COLORS.primary}
              sparklineData={ressourcesPropresEvolution}
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

      <div className="fr-mt-5w">
        <RecettesEvolutionChart
          etablissementId={selectedEtablissement || ""}
          etablissementName={data.etablissement_lib}
        />
      </div>
    </div>
  );
}
