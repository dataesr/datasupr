import { useQuery } from "@tanstack/react-query";

import { getData } from "./query";
import options from "./options";
import { useGetParams, renderDataTable } from "./utils";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

const config = {
  id: "pillarsFundingValues",
  idQuery: "pillarsFunding",
  title: {
    en: "Funding (M€)",
    fr: "Subventions (M€)",
  },
  integrationURL: "/european-projects/components/pages/analysis/overview/charts/destination-funding",
};

export default function PillarsFundingValues() {
  const params = useGetParams();
  
  const { data, isLoading } = useQuery({
    queryKey: [config.idQuery, params],
    queryFn: () => getData(params),
  });
  
  if (isLoading || !data) return <DefaultSkeleton />;

  return <ChartWrapper config={config} options={options(data)} renderData={() => renderDataTable(data, "fr")} />;
}
