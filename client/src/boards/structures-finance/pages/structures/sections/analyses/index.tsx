import { useState } from "react";
import { Row, Col } from "@dataesr/dsfr-plus";
import EvolutionChart from "./charts";
import { useAnalysesWithData } from "../../../../hooks/useAnalysesWithData";
import AnalysisFilter from "./analysis-filter";
import {
  AnalysesSectionWrapper,
  EmptyState,
} from "../../components/analyses/section-wrapper";
import "../styles.scss";
import { AnalysisKey } from "../../../../config/config";
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

  const { analysesWithData, periodText, isLoading } =
    useAnalysesWithData(etablissementId);

  if (isLoading) {
    return (
      <AnalysesSectionWrapper>
        <Row gutters>
          <Col md="4" xs="12">
            <DefaultSkeleton height="400px" />
          </Col>
          <Col md="8" xs="12">
            <DefaultSkeleton height="400px" />
          </Col>
        </Row>
      </AnalysesSectionWrapper>
    );
  }

  if (analysesWithData.size === 0) {
    return (
      <AnalysesSectionWrapper>
        <div className="fr-alert fr-alert--info">
          <p>Aucune donnée d'évolution disponible pour cet établissement</p>
        </div>
      </AnalysesSectionWrapper>
    );
  }

  return (
    <AnalysesSectionWrapper>
      <Row gutters>
        <Col md="4" xs="12">
          <AnalysisFilter
            analysesWithData={analysesWithData}
            selectedAnalysis={selectedAnalysis}
            onSelectAnalysis={setSelectedAnalysis}
          />
        </Col>

        <Col md="8" xs="12">
          {!selectedAnalysis && (
            <EmptyState message="Sélectionnez une analyse pour afficher le graphique" />
          )}

          {selectedAnalysis && (
            <EvolutionChart
              etablissementId={etablissementId}
              etablissementName={data.etablissement_lib}
              selectedAnalysis={selectedAnalysis}
              periodText={periodText}
            />
          )}
        </Col>
      </Row>
    </AnalysesSectionWrapper>
  );
}
