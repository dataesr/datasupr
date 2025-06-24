import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

const config = {
  id: "beneficiariesByRole",
  title: {
    fr: "Top 10 des bénéficiaires par rôle en fonction des financements alloués",
    en: "Top 10 beneficiaries by role based on allocated funding",
  },
  subtitle: "",
  description: {
    fr: "Ad duis occaecat voluptate deserunt tempor enim nulla officia.",
    en: "Ad duis occaecat voluptate deserunt tempor enim nulla officia.",
  },
  integrationURL: "/european-projects/components/pages/analysis/overview/charts/main-beneficiaries",
};

export default function BeneficiariesByRole() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);
  const currentLang = searchParams.get("language") || "fr";

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
      legend={null}
      options={options(data, currentLang)}
      renderData={() => null} // TODO: add data table
    />
  );
}
