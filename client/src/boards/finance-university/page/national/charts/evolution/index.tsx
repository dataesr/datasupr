import { useMemo, useState } from "react";
import { Row, Col } from "@dataesr/dsfr-plus";
import Highcharts from "highcharts";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import {
  useFinanceEvolutionNational,
  useFinanceComparisonFilters,
} from "../../../../api";
import { createEvolutionNationaleChartOptions } from "./options";

interface EvolutionNationaleChartProps {
  selectedYear: string;
}

const EvolutionNationaleChart: React.FC<EvolutionNationaleChartProps> = ({
  selectedYear,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<
    "finances" | "effectifs" | "taux"
  >("finances");
  const [selectedType, setSelectedType] = useState<string>("tous");
  const [selectedTypologie, setSelectedTypologie] = useState<string>("toutes");
  const [selectedRegion, setSelectedRegion] = useState<string>("toutes");

  const { data: filtersData } = useFinanceComparisonFilters(selectedYear);
  const { data: evolutionData, isLoading } = useFinanceEvolutionNational({
    type: selectedType !== "tous" ? selectedType : undefined,
    typologie: selectedTypologie !== "toutes" ? selectedTypologie : undefined,
    region: selectedRegion !== "toutes" ? selectedRegion : undefined,
  });

  const buttons = useMemo(
    () => [
      { label: "Recettes & SCSP", key: "finances" as const },
      { label: "Effectifs & Emplois", key: "effectifs" as const },
      { label: "Taux d'encadrement", key: "taux" as const },
    ],
    []
  );

  const types = useMemo(() => filtersData?.types || [], [filtersData]);
  const typologies = useMemo(
    () => filtersData?.typologies || [],
    [filtersData]
  );
  const regions = useMemo(() => filtersData?.regions || [], [filtersData]);

  const chartOptions = useMemo(() => {
    if (!evolutionData || evolutionData.length === 0)
      return {} as Highcharts.Options;
    return createEvolutionNationaleChartOptions(evolutionData, selectedMetric);
  }, [evolutionData, selectedMetric]);

  if (isLoading || !evolutionData) {
    return (
      <div className="fr-py-12v" style={{ textAlign: "center" }}>
        Chargement des données...
      </div>
    );
  }

  if (evolutionData.length === 0) {
    return (
      <div className="fr-py-12v" style={{ textAlign: "center" }}>
        Aucune donnée disponible
      </div>
    );
  }

  const metricLabel =
    selectedMetric === "finances"
      ? "des recettes et du SCSP"
      : selectedMetric === "effectifs"
      ? "des effectifs et des emplois"
      : "du taux d'encadrement";

  return (
    <Row gutters>
      <Col xs={12}>
        <Row gutters className="fr-mb-3v">
          <Col xs={12} md={4}>
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="filter-type">
                Type d'établissement
              </label>
              <select
                className="fr-select"
                id="filter-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="tous">Tous les types</option>
                {types.map((type: string) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="filter-typologie">
                Typologie
              </label>
              <select
                className="fr-select"
                id="filter-typologie"
                value={selectedTypologie}
                onChange={(e) => setSelectedTypologie(e.target.value)}
              >
                <option value="toutes">Toutes les typologies</option>
                {typologies.map((typo: string) => (
                  <option key={typo} value={typo}>
                    {typo}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="filter-region">
                Région
              </label>
              <select
                className="fr-select"
                id="filter-region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="toutes">Toutes les régions</option>
                {regions.map((reg: string) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </Col>
        </Row>

        <div className="fr-mb-3v">
          <div className="fr-btns-group fr-btns-group--inline-sm">
            {buttons.map((btn) => (
              <button
                key={btn.key}
                className={`fr-btn ${
                  selectedMetric === btn.key ? "" : "fr-btn--secondary"
                } fr-btn--sm`}
                type="button"
                onClick={() => setSelectedMetric(btn.key)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <ChartWrapper
          config={{
            id: "finance-evolution-nationale",
            idQuery: "finance-evolution-nationale",
            title: {
              look: "h5",
              size: "h3",
              fr: <>Évolution temporelle nationale</>,
            },
            comment: {
              fr: (
                <>
                  Évolution {metricLabel} de l'enseignement supérieur français
                  sur plusieurs années. Données agrégées pour l'ensemble des
                  établissements.
                </>
              ),
            },
            readingKey: {
              fr: (
                <>
                  Cette vue présente l'évolution sur {evolutionData.length}{" "}
                  années disponibles dans la base de données.
                </>
              ),
            },
            updateDate: new Date(),
            integrationURL: "/integration-url",
          }}
          options={chartOptions}
          legend={null}
        />
      </Col>
    </Row>
  );
};

export default EvolutionNationaleChart;
