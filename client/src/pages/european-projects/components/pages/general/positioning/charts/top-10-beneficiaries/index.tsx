import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import { getDefaultParams } from "./utils";
import { GetLegend } from "../../../../../legend";
import options from "./options";
import ChartWrapper from "../../../../../chart-wrapper";
import Template from "./template";

export default function Top10Beneficiaries() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["Top10Beneficiaries", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <Template />;
  return (
    <ChartWrapper
      id="top10beneficiaries"
      options={options(data, searchParams.get("country_code") ?? null)}
      legend={GetLegend([
        ["Total des subventions en euros €", "#233E41"],
        ["Poids du cumul des subventions (%)", "#D75521"],
      ])}
    />
  );
}
