import { useFinanceEtablissementEvolution } from "../../../api";
import MetricOverview from "../components/metric-overview";
import "./styles.scss";

interface FinancementsTabProps {
  data: any;
}

export function FinancementsTab({ data }: FinancementsTabProps) {
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
      <MetricOverview data={data} evolutionData={evolutionData} />
    </div>
  );
}
