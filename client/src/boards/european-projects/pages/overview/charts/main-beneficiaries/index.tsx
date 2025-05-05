import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

export default function MainBeneficiaries() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["MainBeneficiaries", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return (
    <ChartWrapper
      id="mainBeneficiaries"
      options={options(data)}
      legend={null}
      renderData={() => null} // TODO: add data table
    />
  );
}
