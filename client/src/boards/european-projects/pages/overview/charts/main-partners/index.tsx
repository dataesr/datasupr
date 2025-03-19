import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import { RenderData } from "./render-data";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";

export default function MainPartners() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["MainBeneficiaries", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return <>MainPartners chart</>; //TODO: Implement MainPartners chart
  return (
    <ChartWrapper
      id="mainPartners"
      options={options(data)}
      legend={null}
      renderData={RenderData}
    />
  );
}
