import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import { GetData } from "./query";
import { getDefaultParams } from "./utils";
import { GetLegend } from "../../../../components/legend";
import { RenderData } from "./render-data";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import YearSelector from "../../../../components/YearSelector";
import FiltersWrapper from "../../../../components/filters-wrapper";

import { Text } from "@dataesr/dsfr-plus";

const config = {
  id: "typeBeneficiariesEvolution",
  title: {
    fr: (
      <>
        Évolution des types de bénéficiaires
        <Text className="fr-text--light">
          <i>Évolution des financements par pays (en millions d'euros)</i>
        </Text>
      </>
    ),
    en: (
      <>
        Type of beneficiaries evolution
        <Text className="fr-text--light">
          <i>Evolution of funding by country (in millions of euros)</i>
        </Text>
      </>
    ),
  },
  description: {
    fr: "Évolution des financements obtenus par type d'entités selon les pays du top 10.",
    en: "Temporal evolution of funding obtained by entity types across top 10 countries.",
  },
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/type-beneficiaries-evolution",
};

export default function TypeOfBeneficiariesEvolution() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [selectedEntityType, setSelectedEntityType] = useState("REC");
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const params = getDefaultParams(searchParams);

  const entityTypes = [
    { value: "REC", label: currentLang === "fr" ? "Recherche" : "Research" },
    { value: "PUB", label: currentLang === "fr" ? "Organisme public" : "Public institution" },
    { value: "PRC", label: currentLang === "fr" ? "Organisme privé" : "Private institution" },
    { value: "HES", label: currentLang === "fr" ? "Établissement d'enseignement supérieur" : "Higher education institution" },
    { value: "OTH", label: currentLang === "fr" ? "Autre" : "Other" },
  ];

  const handleEntityTypeChange = (event) => {
    setSelectedEntityType(event.target.value);
  };

  // Query pour récupérer les données initiales (sans filtre d'années)
  const { data: initialData, isLoading: isInitialLoading } = useQuery({
    queryKey: [
      config.id + "_initial",
      params,
      selectedEntityType,
      Cookies.get("selectedPillars"),
      Cookies.get("selectedPrograms"),
      Cookies.get("selectedThematics"),
      Cookies.get("selectedDestinations"),
    ],
    queryFn: () => GetData(params, selectedEntityType),
    enabled: !!params,
  });

  // Query pour récupérer les données filtrées par années (si nécessaire)
  const { data: filteredData, isLoading: isFilteredLoading } = useQuery({
    queryKey: [
      config.id + "_filtered",
      params,
      selectedEntityType,
      selectedYears,
      Cookies.get("selectedPillars"),
      Cookies.get("selectedPrograms"),
      Cookies.get("selectedThematics"),
      Cookies.get("selectedDestinations"),
    ],
    queryFn: () => GetData(params, selectedEntityType, selectedYears, initialData?.years),
    enabled: !!params && !!initialData?.years && selectedYears.length > 0 && selectedYears.length < initialData.years.length,
  });

  // Utiliser les données filtrées si disponibles, sinon les données initiales
  const data = filteredData || initialData;
  const isLoading = isInitialLoading || isFilteredLoading;

  // Initialiser toutes les années comme sélectionnées par défaut
  useEffect(() => {
    if (initialData?.years && selectedYears.length === 0) {
      const allYears = initialData.years.map((year) => year.toString());
      setSelectedYears(allYears);
    }
  }, [initialData, selectedYears.length]);

  if (isLoading || !data) return <DefaultSkeleton />;

  // Générer une légende dynamique basée sur les pays présents dans les données
  const legendData =
    data.countries?.map((country, index) => {
      const countryColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
      return [country[`country_name_${currentLang}`] || country.country_code, countryColors[index % countryColors.length]];
    }) || [];

  return (
    <>
      <ChartWrapper.Title config={config}>
        <FiltersWrapper>
          <YearSelector availableYears={initialData?.years || []} selectedYears={selectedYears} onYearsChange={setSelectedYears} />
        </FiltersWrapper>
        <div className="fr-my-3w">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="entity-type-select-evolution">
              {currentLang === "fr" ? "Type d'entité pour l'évolution temporelle" : "Entity type for temporal evolution"}
            </label>
            <select
              className="fr-select"
              id="entity-type-select-evolution"
              name="entity-type-select-evolution"
              value={selectedEntityType}
              onChange={handleEntityTypeChange}
            >
              {entityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ChartWrapper.Title>

      <ChartWrapper
        config={config}
        hideTitle={true}
        legend={GetLegend(legendData, "TypeBeneficiariesEvolution", currentLang, 3)}
        options={options(data, currentLang)}
        renderData={() => RenderData(data, currentLang)}
      />
    </>
  );
}
