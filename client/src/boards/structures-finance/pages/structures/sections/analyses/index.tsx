import { useState } from "react";
import { Row, Col } from "@dataesr/dsfr-plus";
import EvolutionChart, {
  useAnalysesWithData,
  type AnalysisKey,
} from "./charts/evolution";
import AnalysisFilter from "../../../../components/analysis-filter";
import "../styles.scss";

interface AnalysesSectionProps {
  data: any;
  selectedEtablissement?: string;
}

export function AnalysesSection({
  data,
  selectedEtablissement,
}: AnalysesSectionProps) {
  const etablissementId = selectedEtablissement || "";
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisKey | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { analysesWithData, periodText, isLoading } =
    useAnalysesWithData(etablissementId);

  if (isLoading) {
    return (
      <div
        id="section-analyses"
        role="region"
        aria-labelledby="section-analyses"
        className="section-container"
      >
        <div className="fr-p-3w" style={{ textAlign: "center" }}>
          <p>Chargement des données d'évolution...</p>
        </div>
      </div>
    );
  }

  if (analysesWithData.size === 0) {
    return (
      <div
        id="section-analyses"
        role="region"
        aria-labelledby="section-analyses"
        className="section-container"
      >
        <div className="fr-alert fr-alert--info">
          <p>Aucune donnée d'évolution disponible pour cet établissement</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="section-analyses"
      role="region"
      aria-labelledby="section-analyses"
      className="section-container"
    >
      <Row gutters>
        <Col md="4" xs="12">
          <AnalysisFilter
            analysesWithData={analysesWithData}
            selectedAnalysis={selectedAnalysis}
            selectedCategory={selectedCategory}
            periodText={periodText}
            onSelectAnalysis={setSelectedAnalysis}
            onSelectCategory={setSelectedCategory}
          />
        </Col>

        <Col md="8" xs="12">
          {!selectedAnalysis && (
            <div className="fr-p-4w fr-background-alt--grey fr-grid-row fr-grid-row--center fr-grid-row--middle fr-py-10w">
              <div className="fr-text--center">
                <span
                  className="fr-icon-bar-chart-box-line fr-icon--lg fr-text-mention--grey fr-mb-2w fr-displayed"
                  aria-hidden="true"
                />
                <p className="fr-text-mention--grey fr-mb-0">
                  Sélectionnez une analyse pour afficher le graphique
                </p>
              </div>
            </div>
          )}

          {selectedAnalysis && (
            <EvolutionChart
              etablissementId={etablissementId}
              etablissementName={data.etablissement_lib}
              selectedAnalysis={selectedAnalysis}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}
