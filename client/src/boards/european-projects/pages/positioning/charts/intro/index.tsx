import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "../top-10-beneficiaries/query";
import { getDefaultParams } from "../top-10-beneficiaries/utils";
import Callout from "../../../../../../components/callout";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

import i18n from "./i18n.json";

export default function Intro() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);
  const currentLang = searchParams.get("language") || "fr";

  const { data, isLoading } = useQuery({
    queryKey: ["Top10Beneficiaries", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton height="200px" />;

  const top10 = data.top10.sort((a, b) => b.total_fund_eur - a.total_fund_eur).slice(0, 10);

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <>
      <Callout className="callout-style">
        <strong>{`${top10[top10.length - 1].influence.toFixed(1)}`}</strong>
        {getI18nLabel("intro")}
        <i>{top10.map((item) => item.name_fr).join(", ")}</i>
      </Callout>
    </>
  );
}
