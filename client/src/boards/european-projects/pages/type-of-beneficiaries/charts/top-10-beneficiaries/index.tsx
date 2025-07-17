import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

import { GetData } from "./query";
import { getDefaultParams } from "./utils";
import { GetLegend } from "../../../../components/legend";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import YearSelector from "../../../../components/YearSelector";

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
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-beneficiaries",
};
// top10-countries-by-type-of-beneficiaries
export default function Top10CountriesByTypeOfBeneficiaries() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = getDefaultParams(searchParams);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

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

  function Filters() {
    return (
      <div className="filters">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: filtersExpanded ? "16px" : "0" }}>
          <button
            className="fr-btn fr-btn--sm fr-btn--tertiary"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <span
              style={{
                transition: "transform 0.2s ease-in-out",
                transform: filtersExpanded ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              ▶
            </span>
            {getI18nLabel("filters")}
          </button>
        </div>

        {filtersExpanded && (
          <div
            style={{
              animation: "filtersSlideIn 0.3s ease-out",
              overflow: "visible",
              position: "relative",
              zIndex: 1000,
            }}
          >
            <style>
              {`
                @keyframes filtersSlideIn {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                    max-height: 0;
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 200px;
                  }
                }
              `}
            </style>
            <YearSelector availableYears={data.rangeOfYears || []} selectedYears={selectedYears} onYearsChange={setSelectedYears} />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <ChartWrapper.Title config={config}>
        <Filters />
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
        renderData={() => null} // TODO: add data table
      />
    </>
  );
}
