import { useQuery } from "@tanstack/react-query";

import { getData } from "./query";
import options from "./options";
import { useGetParams } from "./utils";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

export default function ProgramsFundingValues() {
  const params = useGetParams();
  const { data, isLoading } = useQuery({
    queryKey: ["ProgramsFunding", params],
    queryFn: () => getData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return (
    <ChartWrapper
      id="programsFundingValues"
      options={options(data)}
      legend={null}
      renderData={() => null} // TODO: add data table
    />
  );
}
