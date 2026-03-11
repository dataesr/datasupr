import { useEffect } from "react";
import { Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Breadcrumb from "../../../../components/breadcrumb";
import RangeOfYears from "../../../../components/range-of-years";
import { getErcFilters } from "../../api/erc";
import { cleanUrlParams, needsUrlCleaning } from "./url-utils";
import TabsContent from "./components/TabsContent";
import navigationConfig from "./navigation-config.json";

import "./styles.scss";

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
          <TabsContent />
        </Container>
      </Container>
    </>
  );
}
