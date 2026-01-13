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
      className="fr-p-3w section-container"
    >
      <EvolutionChart
        etablissementId={selectedEtablissement || ""}
        etablissementName={data.etablissement_lib}
      />
    </div>
  );
}
