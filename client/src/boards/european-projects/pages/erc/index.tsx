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
import navigationConfig from "./navigation-config.json";

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
          <h2 className="fr-mb-3w">Synthèse ERC</h2>

          {/* Cartes de synthèse principales */}
          <ErcSynthesisCards countryCode={countryCode} callYear={callYear} countryAdj={countryAdj} />

          {/* Cartes par type de financement */}
          <ErcDestinationCards countryCode={countryCode} callYear={callYear} />

          {/* TODO: Sections à implémenter */}
          <div className="fr-mt-4w">
            <h3>Par panel</h3>
            <p className="fr-text--sm fr-text--muted">
              Graphique des financements obtenus par porteurs de projets ventilé par panel et type de financement (ordonnées : financements en M€,
              abscisses : Nombre de porteurs de projets PI). Légende: Panel ERC en couleur, type de financement en forme.
            </p>
          </div>

          <div className="fr-mt-4w">
            <h3>Évolution temporelle</h3>
            <p className="fr-text--sm fr-text--muted">
              Graphiques d'évolution de la participation {countryAdj.f} dans les ERC au fil du temps (poids de projets lauréats et taux de succès par
              type de financement).
            </p>
          </div>
        </Container>
      </Container>
    </>
  );
}
