import { useState } from "react";
import { Row, Col, Title } from "@dataesr/dsfr-plus";
import NationalChart from "./chart";
import AnalysisFilter from "./analysis-filter";
import { type AnalysisKey } from "../../../structures/sections/analyses/charts/evolution/config";
import "../../../structures/sections/styles.scss";

interface AnalyseSectionProps {
  data: any[];
  selectedYear?: string;
  selectedType?: string;
  selectedTypologie?: string;
  selectedRegion?: string;
}

export function AnalyseSection({
  data,
  selectedYear,
  selectedType,
  selectedTypologie,
  selectedRegion,
}: AnalyseSectionProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisKey | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "Indicateurs financiers"
  );

  return (
    <section
      id="section-comparison"
      role="region"
      className="fr-mb-3w section-container"
    >
      <div className="section-header fr-mb-4w">
        <Title
          as="h2"
          look="h5"
          id="section-comparison-title"
          className="section-header__title"
        >
          Analyses comparatives
        </Title>
      </div>

      <Row gutters>
        <Col md="4" xs="12">
          <AnalysisFilter
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
                  Sélectionnez une analyse pour afficher le graphique comparatif
                </p>
              </div>
            </div>
          )}

          {selectedAnalysis && (
            <NationalChart
              data={data}
              selectedAnalysis={selectedAnalysis}
              selectedYear={selectedYear}
              selectedType={selectedType}
              selectedTypologie={selectedTypologie}
              selectedRegion={selectedRegion}
            />
          )}
        </Col>
      </Row>
    </section>
  );
}
