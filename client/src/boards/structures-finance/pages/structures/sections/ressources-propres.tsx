import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Row, Col } from "@dataesr/dsfr-plus";
import {
  useFinanceEtablissementEvolution,
  useFinanceYears,
} from "../../../api";
import RessourcesPropresChart from "../charts/ressources-propres";
import RecettesEvolutionChart from "../charts/recettes-evolution";
import { MetricChartCard } from "../../../../../components/metric-chart-card/metric-chart-card";
import { CHART_COLORS } from "../../../constants/colors";
import "./styles.scss";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";
const pct = (n?: number) => (n != null ? `${n.toFixed(1)} %` : "—");

interface RessourcesPropresSectionProps {
  data: any;
  selectedEtablissement?: string;
  selectedYear?: string | number;
}

export function RessourcesPropresSection({
  data,
  selectedEtablissement,
  selectedYear,
}: RessourcesPropresSectionProps) {
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
      .map((item) => ({
        exercice: item.exercice,
        value: item.recettes_propres,
      }))
      .filter((item) => item.value != null && !isNaN(item.value));
  }, [evolutionData, selectedYear]);

  return (
    <div
      id="section-recettes-propres"
      role="region"
      aria-labelledby="section-recettes-propres"
      className="fr-p-3w section-container"
    >
      <div className="section-header fr-mb-4w">
        <h3 className="fr-h5 section-header__title">Ressources propres</h3>
        <label
          className="fr-label"
          htmlFor="select-year-ressources-propres"
        ></label>
        <div className="fr-select-group section-header__year-selector">
          <select
            className="fr-select"
            id="select-year-ressources-propres"
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
          <Col xs="12">
            <MetricChartCard
              title="Total des ressources propres"
              value={`${euro(totalRessources)} €`}
              detail={`${pct(percentageOfTotal)} des ressources totales`}
              color={CHART_COLORS.primary}
              evolutionData={ressourcesPropresEvolution}
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

      <div className="fr-mt-5w">
        <RecettesEvolutionChart
          etablissementId={selectedEtablissement || ""}
          etablissementName={data.etablissement_lib}
        />
      </div>
    </div>
  );
}
