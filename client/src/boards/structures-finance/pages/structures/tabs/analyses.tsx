import EvolutionChart from "../charts/evolution";
import "./styles.scss";

interface AnalysesTabProps {
  data: any;
  selectedEtablissement?: string;
}

export function AnalysesTab({ data, selectedEtablissement }: AnalysesTabProps) {
  return (
    <div
      id="tabpanel-analyses"
      role="tabpanel"
      aria-labelledby="tab-analyses"
      className="fr-p-3w tab-container"
    >
      <EvolutionChart
        etablissementId={selectedEtablissement || ""}
        etablissementName={data.etablissement_lib}
      />
    </div>
  );
}
