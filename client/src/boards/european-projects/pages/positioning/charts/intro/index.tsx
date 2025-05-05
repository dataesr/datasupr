import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "../top-10-beneficiaries/query";
import { getDefaultParams } from "../top-10-beneficiaries/utils";
import Callout from "../../../../../../components/callout";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

export default function Intro() {
  const [searchParams] = useSearchParams();

  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["Top10Beneficiaries", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton height="200px" />;

  return (
    <>
      <Callout colorFamily="blue-cumulus">
        <strong>{`${data.top10[data.top10.length - 1]?.influence.toFixed(
          1
        )}%`}</strong>{" "}
        des subventions allouées par Horizon Europe sont perçues par 10
        pays:&nbsp;
        <i>{data.top10.map((item) => item.name_fr).join(", ")}</i>
      </Callout>
    </>
  );
}
