import EffectifsChart from "../charts/effectifs";
import "./styles.scss";

interface EtudiantsTabProps {
  data: any;
  selectedYear?: string | number;
}

export function EtudiantsTab({ data, selectedYear }: EtudiantsTabProps) {
  return (
    <div
      id="tabpanel-etudiants"
      role="tabpanel"
      aria-labelledby="tab-etudiants"
      className="fr-p-3w tab-container"
    >
      <EffectifsChart
        data={data}
        selectedYear={selectedYear}
        etablissementName={data.etablissement_lib}
      />
    </div>
  );
}
