import { useState } from "react";
import { Row, Col, Title } from "@dataesr/dsfr-plus";
import EvolutionChart, { useAnalysesWithData } from "./charts/evolution";
import AnalysisFilter from "./analysis-filter";
import "../styles.scss";
import { AnalysisKey } from "./charts/evolution/config";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

interface AnalysesSectionProps {
  data: any;
  selectedStructure?: string;
}

export function AnalysesSection({
  data,
  selectedStructure,
}: AnalysesSectionProps) {
  const etablissementId = selectedStructure || "";
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisKey | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "Indicateurs financiers"
  );

  const { analysesWithData, isLoading } = useAnalysesWithData(etablissementId);

  if (isLoading) {
    return (
      <section
        id="section-analyses"
        aria-labelledby="section-analyses-title"
        className="section-container"
      >
        <div className="section-header fr-mb-4w">
          <Title
            as="h2"
            look="h5"
            id="section-analyses-title"
            className="section-header__title"
          >
            Analyses et évolutions
          </Title>
        </div>
        <Row gutters>
          <Col md="4" xs="12">
            <DefaultSkeleton height="400px" />
          </Col>
          <Col md="8" xs="12">
            <DefaultSkeleton height="400px" />
          </Col>
        </Row>
      </section>
    );
  }

  if (analysesWithData.size === 0) {
    return (
      <section
        id="section-analyses"
        aria-labelledby="section-analyses-title"
        className="section-container"
      >
        <div className="section-header fr-mb-4w">
          <Title
            as="h2"
            look="h5"
            id="section-analyses-title"
            className="section-header__title"
          >
            Analyses et évolutions
          </Title>
        </div>
        <div className="fr-alert fr-alert--info">
          <p>Aucune donnée d'évolution disponible pour cet établissement</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="section-analyses"
      aria-labelledby="section-analyses-title"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <Title
          as="h2"
          look="h5"
          id="section-analyses-title"
          className="section-header__title"
        >
          Analyses et évolutions
        </Title>
      </div>
      <Row gutters>
        <Col md="4" xs="12">
          <AnalysisFilter
            analysesWithData={analysesWithData}
            selectedAnalysis={selectedAnalysis}
            selectedCategory={selectedCategory}
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
    </section>
  );
}
