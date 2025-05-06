import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

import { GetData } from "./query";
import { getDefaultParams } from "./utils";
import { GetLegend } from "../../../../components/legend";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

const config = {
  id: "top10beneficiaries",
  title: "",
  subtitle: "Principaux pays bénéficiaires",
  description: "Ad duis occaecat voluptate deserunt tempor enim nulla officia.",
  integrationURL:
    "/european-projects/components/pages/analysis/positioning/charts/top-10-beneficiaries",
};

export default function Top10Beneficiaries() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: [
      config.id,
      params,
      Cookies.get("selectedPillars"),
      Cookies.get("selectedPrograms"),
      Cookies.get("selectedThematics"),
      Cookies.get("selectedDestinations"),
    ],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return (
    <ChartWrapper
      config={config}
      legend={GetLegend(
        [
          ["Total des subventions en euros €", "#233E41"],
          ["Poids du cumul des subventions (%)", "#D75521"],
        ],
        "Top10Beneficiaries",
        currentLang
      )}
      options={options(data, searchParams.get("country_code") ?? null)}
      renderData={() => null} // TODO: add data table
    />
  );
}
