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
    fr: "Classement des bénéficiaires",
    en: "Beneficiaries ranking",
  },
  subtitle: "",
  description: {
    fr: "Ad duis occaecat voluptate deserunt tempor enim nulla officia.",
    en: "Ad duis occaecat voluptate deserunt tempor enim nulla officia.",
  },
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-beneficiaries",
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

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  const prepareData = (data) => {
    // Add selected country if it is not in the top 10
    const dataToReturn = data.top10.slice(0, 10);
    const selectedCountry = searchParams.get("country_code");
    if (selectedCountry) {
      const pos = data.top10.findIndex((item) => item.id === selectedCountry);
      if (pos >= 10 && pos !== -1) {
        dataToReturn.pop();
        const countryData = data.top10[pos];
        dataToReturn.push(countryData);
      }
    }
    return dataToReturn;
  };

  return (
    <ChartWrapper
      config={config}
      legend={GetLegend(
        [
          [getI18nLabel("total-of-subsidies"), rootStyles.getPropertyValue("--successful-project-color")],
          [getI18nLabel("weight-of-subsidies"), rootStyles.getPropertyValue("--cumulativeSuccessRate-color")],
        ],
        "Top10Beneficiaries",
        currentLang
      )}
      options={options(prepareData(data), searchParams.get("country_code") ?? null, currentLang)}
      renderData={() => null} // TODO: add data table
    />
  );
}
