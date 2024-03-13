import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";

export default function MainBeneficiaries() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["MainBeneficiaries", params],
    queryFn: () => GetData(params)
  })

  if (isLoading || !data) return <Template />
  return (
    <ChartWrapper
      id="mainBeneficiaries"
      options={options(data)}
      legend={null}
    />
  );
}