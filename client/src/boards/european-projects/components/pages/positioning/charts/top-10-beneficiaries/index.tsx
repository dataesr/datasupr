import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import { getDefaultParams } from "./utils";
import { GetLegend } from "../../../../legend";
import options from "./options";
import ChartWrapper from "../../../../chart-wrapper";
import DefaultSkeleton from "../../../../charts-skeletons/default";

export default function Top10Beneficiaries() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["Top10Beneficiaries", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return (
    <ChartWrapper
      id="top10beneficiaries"
      legend={GetLegend(
        [
          ["Total des subventions en euros €", "#233E41"],
          ["Poids du cumul des subventions (%)", "#D75521"],
        ],
        "Top10Beneficiaries"
      )}
      options={options(data, searchParams.get("country_code") ?? null)}
      renderData={() => null} // TODO: add data table
    />
  );
}
