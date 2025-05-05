import { useQuery } from "@tanstack/react-query";

import { getData } from "./query";
import options from "./options";
import { useGetParams } from "./utils";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

export default function TopicsFundingProportion() {
  const params = useGetParams();
  const { data, isLoading } = useQuery({
    queryKey: ["TopicsFundingProportion", params],
    queryFn: () => getData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return (
    <ChartWrapper
      id="topicsFundingProportion"
      options={options(data)}
      legend={null}
      renderData={() => null} // TODO: add data table
    />
  );
}
