import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

import { GetData } from "./query";
import { getDefaultParams } from "./utils";
import { GetLegend } from "../../../../components/legend";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

import i18n from "./i18n.json";
const rootStyles = getComputedStyle(document.documentElement);

const config = {
  id: "top10beneficiaries",
  title: {
    fr: "Top 10 des pays",
    en: "Top 10 countries",
  },
  subtitle: {
    fr: "Financements obtenus par type d'entités (en millions d'euros)",
    en: "Funding obtained by type of entities (in millions of euros)",
  },
  description: {
    fr: "Ad duis occaecat voluptate deserunt tempor enim nulla officia.",
    en: "Ad duis occaecat voluptate deserunt tempor enim nulla officia.",
  },
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-beneficiaries",
};
// top10-countries-by-type-of-beneficiaries
export default function Top10CountriesByTypeOfBeneficiaries() {
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

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <ChartWrapper
      config={config}
      legend={GetLegend(
        [
          [getI18nLabel("REC"), rootStyles.getPropertyValue("--beneficiarie-type-REC-color")],
          [getI18nLabel("PUB"), rootStyles.getPropertyValue("--beneficiarie-type-PUB-color")],
          [getI18nLabel("PRC"), rootStyles.getPropertyValue("--beneficiarie-type-PRC-color")],
          [getI18nLabel("HES"), rootStyles.getPropertyValue("--beneficiarie-type-HES-color")],
          [getI18nLabel("OTH"), rootStyles.getPropertyValue("--beneficiarie-type-OTH-color")],
        ],
        "Top10Beneficiaries",
        currentLang
      )}
      options={options(data, currentLang)}
      renderData={() => null} // TODO: add data table
    />
  );
}
