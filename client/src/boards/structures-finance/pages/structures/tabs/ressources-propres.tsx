import RessourcesPropresChart from "../charts/ressources-propres";
import RecettesEvolutionChart from "../charts/recettes-evolution";
import "./styles.scss";

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
  return (
    <div
      id="tabpanel-recettes-propres"
      role="tabpanel"
      aria-labelledby="tab-recettes-propres"
      className="fr-p-3w tab-container"
    >
      <div className="fr-mb-4w">
        <RessourcesPropresChart data={data} selectedYear={selectedYear} />
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
