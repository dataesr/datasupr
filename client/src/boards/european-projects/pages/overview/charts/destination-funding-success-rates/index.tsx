import { useQuery } from "@tanstack/react-query";

import { getData } from "./query";
import options from "./options";
import { useGetParams } from "./utils";

import ChartWrapper from "../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";

export default function DestinationFundingSuccessRates() {
  const params = useGetParams();
  const { data, isLoading } = useQuery({
    queryKey: ["DestinationFunding", params],
    queryFn: () => getData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  console.log("DestinationFundingSuccessRates", options(data));

  return (
    <ChartWrapper
      id="destinationFundingSuccessRates"
      options={options(data)}
      legend={null}
      renderData={() => null} // TODO: add data table
    />
  );
}
