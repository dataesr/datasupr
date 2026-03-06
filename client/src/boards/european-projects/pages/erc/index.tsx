import { useEffect } from "react";
import { Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Breadcrumb from "../../../../components/breadcrumb";
import RangeOfYears from "../../../../components/range-of-years";
import { ErcSynthesisCards, ErcDestinationCards } from "../../components/cards/erc";
import { getCountryAdjectives } from "../../../../components/country-selector/utils";
import { getErcFilters } from "../../api/erc";
import { cleanUrlParams, needsUrlCleaning, rangeOfYearsToApiFormat } from "./url-utils";
import { getI18nLabel } from "../../../../utils";
import PanelFundingChart from "./charts/panel-funding";
import EvolutionCharts from "./charts/evolution";
import navigationConfig from "./navigation-config.json";
import i18n from "./i18n.json";

export default function ERC() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Nettoyer l'URL des paramètres non autorisés
  useEffect(() => {
    if (needsUrlCleaning(searchParams)) {
      setSearchParams(cleanUrlParams(searchParams), { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Récupérer les filtres disponibles (années) depuis la collection
  const { data: filtersData, isLoading: isLoadingFilters } = useQuery({
    queryKey: ["erc-filters"],
    queryFn: () => getErcFilters(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Récupérer les paramètres de filtres depuis l'URL
  const countryCode = searchParams.get("country_code") || "FRA";
  const rangeOfYears = searchParams.get("range_of_years");
  const callYear = rangeOfYearsToApiFormat(rangeOfYears);
  const currentLang = searchParams.get("language") || "fr";

  // Adjectifs de nationalité (masculin et féminin)
  const countryAdj = getCountryAdjectives(countryCode);

  // Années disponibles et par défaut
  const availableYears = filtersData?.years?.sort() || [];
  const defaultYears =
    availableYears.length > 0
      ? availableYears.slice(-3) // Les 3 dernières années par défaut
      : [];

  return (
    <>
      <Container as="main" fluid>
        <div className="ep-navigator-wrapper">
          <Container>
            <Breadcrumb config={navigationConfig} />
            {/* Filtre de sélection des années */}
            {!isLoadingFilters && availableYears.length > 0 && (
              <div className="fr-mt-2w">
                <RangeOfYears availableYears={availableYears} defaultYears={defaultYears} />
              </div>
            )}
          </Container>
        </div>
        <Container>
          <h2 className="fr-mb-3w">{getI18nLabel(i18n, "page.title", currentLang)}</h2>

          {/* Cartes de synthèse principales */}
          <ErcSynthesisCards countryCode={countryCode} callYear={callYear} countryAdj={countryAdj} />

          {/* Cartes par type de financement */}
          <ErcDestinationCards countryCode={countryCode} callYear={callYear} />

          {/* Graphique par panel ERC */}
          <div className="fr-mt-4w">
            <PanelFundingChart countryAdjective={countryAdj.m} currentLang={currentLang} />
          </div>

          {/* Graphiques d'évolution */}
          <div className="fr-mt-4w">
            <EvolutionCharts countryAdjective={countryAdj.f} currentLang={currentLang} />
          </div>
        </Container>
      </Container>
    </>
  );
}
