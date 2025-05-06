import { useQuery } from "@tanstack/react-query";

import { getData } from "./query";
import options from "./options";
import { useGetParams } from "./utils";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

const config = {
  id: "programsFundingValues",
  idQuery: "programsFunding",
  title: {
    en: "Funding (M€)",
    fr: "Financements (M€)",
  },
  description: {
    fr: "Financements demandés et obtenus (M€)",
    en: "Funding requested and obtained (M€)",
  },
  integrationURL:
    "/european-projects/components/pages/analysis/overview/charts/destination-funding",
};

export default function ProgramsFundingValues() {
  const params = useGetParams();
  const { data, isLoading } = useQuery({
    queryKey: [config.idQuery, params],
    queryFn: () => getData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return (
    <ChartWrapper
      config={config}
      legend={null}
      options={options(data)}
      renderData={() => null} // TODO: add data table
    />
  );
}
