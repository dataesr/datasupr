import EvolutionChart from "../charts/evolution";
import "./styles.scss";

interface AnalysesSectionProps {
  data: any;
  selectedEtablissement?: string;
}

export function AnalysesSection({
  data,
  selectedEtablissement,
}: AnalysesSectionProps) {
  return (
    <div
      id="section-analyses"
      role="region"
      aria-labelledby="section-analyses"
      className="section-container"
    >
      <EvolutionChart
        etablissementId={selectedEtablissement || ""}
        etablissementName={data.etablissement_lib}
      />
    </div>
  );
}
