import { useQuery } from "@tanstack/react-query";

import { getData } from "./query";
import options from "./options";
import { useGetParams, renderDataTable } from "./utils";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

const config = {
  id: "programsFundingSuccessRates",
  idQuery: "programsFunding",
  title: {
    fr: "Taux de succès",
    en: "Success rate",
  },
  integrationURL: "/european-projects/components/pages/analysis/overview/charts/destination-funding-success-rates",
};

export default function ProgramsFundingSuccessRates() {
  const { params, currentLang } = useGetParams();
  const { data, isLoading } = useQuery({
    queryKey: [config.idQuery, params],
    queryFn: () => getData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return <ChartWrapper config={config} legend={null} options={options(data)} renderData={() => renderDataTable(data, currentLang)} />;
}
