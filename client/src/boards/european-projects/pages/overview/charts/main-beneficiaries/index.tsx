import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

const config = {
  id: "mainBeneficiaries",
  title: "",
  subtitle:
    "Principaux bénéficiaires qui concentrent 50 % des subventions allouées aux équipes",
  description: "Ad duis occaecat voluptate deserunt tempor enim nulla officia.",
  integrationURL:
    "/european-projects/components/pages/analysis/overview/charts/main-beneficiaries",
};

export default function MainBeneficiaries() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: [config.id, params],
    queryFn: () => GetData(params),
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
