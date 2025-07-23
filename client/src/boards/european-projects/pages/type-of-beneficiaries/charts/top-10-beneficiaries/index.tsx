import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

import { GetData } from "./query";
import { getDefaultParams } from "./utils";
import { GetLegend } from "../../../../components/legend";
import { RenderData } from "./render-data";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import YearSelector from "../../../../components/YearSelector";
import FiltersWrapper from "../../../../components/filters-wrapper";

import i18n from "./i18n.json";
import { Text } from "@dataesr/dsfr-plus";
const rootStyles = getComputedStyle(document.documentElement);

const config = {
  id: "top10beneficiaries",
  title: {
    fr: (
      <>
        Top 10 des pays
        <Text className="fr-text--light">
          <i>Financements obtenus par type d'entités (en millions d'euros)</i>
        </Text>
      </>
    ),
    en: (
      <>
        Top 10 countries
        <Text className="fr-text--light">
          <i>Funding obtained by type of entities (in millions of euros)</i>
        </Text>
      </>
    ),
  },
  description: {
    fr: "Ad duis occaecat voluptate deserunt tempor enim nulla officia.",
    en: "Ad duis occaecat voluptate deserunt tempor enim nulla officia.",
  },
  integrationURL: null,
};
// top10-countries-by-type-of-beneficiaries
export default function Top10CountriesByTypeOfBeneficiaries() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = getDefaultParams(searchParams);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  // Query pour récupérer les données initiales (sans filtre d'années)
  const { data: initialData, isLoading: isInitialLoading } = useQuery({
    queryKey: [
      config.id + "_initial",
      params,
      Cookies.get("selectedPillars"),
      Cookies.get("selectedPrograms"),
      Cookies.get("selectedThematics"),
      Cookies.get("selectedDestinations"),
    ],
    queryFn: () => GetData(params),
    enabled: !!params,
  });

  // Query pour récupérer les données filtrées par années (si nécessaire)
  const { data: filteredData, isLoading: isFilteredLoading } = useQuery({
    queryKey: [
      config.id + "_filtered",
      params,
      selectedYears,
      Cookies.get("selectedPillars"),
      Cookies.get("selectedPrograms"),
      Cookies.get("selectedThematics"),
      Cookies.get("selectedDestinations"),
    ],
    queryFn: () => GetData(params, selectedYears, initialData?.rangeOfYears),
    enabled: !!params && !!initialData && selectedYears.length > 0 && selectedYears.length < (initialData?.rangeOfYears?.length || 0),
  });

  // Utiliser les données filtrées si disponibles, sinon les données initiales
  const data = filteredData || initialData;
  const isLoading = isInitialLoading || isFilteredLoading;

  // Initialiser toutes les années comme sélectionnées par défaut
  useEffect(() => {
    if (initialData?.rangeOfYears && selectedYears.length === 0) {
      const allYears = initialData.rangeOfYears.map((year) => year.toString());
      setSelectedYears(allYears);
    }
  }, [initialData, selectedYears.length]);

  if (isLoading || !data) return <DefaultSkeleton />;

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <>
      <ChartWrapper.Title config={config}>
        <FiltersWrapper>
          <YearSelector availableYears={data.rangeOfYears || []} selectedYears={selectedYears} onYearsChange={setSelectedYears} />
        </FiltersWrapper>
      </ChartWrapper.Title>
      <ChartWrapper
        config={config}
        hideTitle={true}
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
        renderData={() => RenderData(data, currentLang)}
      />
    </>
  );
}
