import { useFinanceEtablissementEvolution } from "../../../api";
import MetricOverview from "../components/metric-cards/metric-card";
import "./styles.scss";

interface FinancementsTabProps {
  data: any;
  selectedYear?: string | number;
}

export function FinancementsTab({ data, selectedYear }: FinancementsTabProps) {
  const { data: evolutionData } = useFinanceEtablissementEvolution(
    data?.etablissement_id_paysage
  );

  return (
    <div
      id="tabpanel-financements"
      role="tabpanel"
      aria-labelledby="tab-financements"
      className="fr-p-3w tab-container"
    >
      <MetricOverview
        data={data}
        evolutionData={evolutionData}
        selectedYear={selectedYear}
      />
    </div>
  );
}
