import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  Button,
  Link,
  Modal,
  ModalTitle,
  ModalContent,
} from "@dataesr/dsfr-plus";

import i18n from "./i18n.json";
import { getFlagEmoji } from "../../utils";
import { getCountriesWithData } from "./utils";
import allCountries from "./all-countries.json";

function getIso2(iso3) {
  return allCountries.find((country) => country.cca3 === iso3)?.cca2;
}

export default function CountrySelector() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const selectedCountry = searchParams.get("country_code") || "FRA";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: countries } = useQuery({
    queryKey: ["atlas/get-filters-values"],
    queryFn: () => getCountriesWithData(),
  });

  useEffect(() => {
    if (!countries) return;
    countries.sort((a, b) => a[`label_${currentLang}`].localeCompare(b[`label_${currentLang}`]));
  }, [currentLang, countries]);

  // Filtrer les pays en fonction de la recherche
  const filteredCountries = countries?.filter((country) => {
    if (!searchQuery) return true;
    const countryLabel = country[`label_${currentLang}`].toLowerCase();
    return countryLabel.includes(searchQuery.toLowerCase());
  });

  const baseUrl =
    pathname +
    "?" +
    Array.from(searchParams.entries())
      .filter(([key]) => key !== "country_code")
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <>
      <Button
        className="fr-m-1w"
        icon="global-line"
        onClick={() => {
          setIsModalOpen(true);
        }}
        size="sm"
        variant="tertiary"
      >
        {getI18nLabel("selectedCountry")} {getFlagEmoji(getIso2(selectedCountry))}
      </Button>

      <Modal isOpen={isModalOpen} hide={() => setIsModalOpen(false)}>
        <ModalTitle>{getI18nLabel("selectACountry")}</ModalTitle>
        <ModalContent>
          <div className="fr-mb-2w">
            <div className="fr-search-bar" role="search">
              <input
                className="fr-input"
                placeholder={getI18nLabel("searchCountry")}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button className="fr-mt-1w" size="sm" variant="secondary" onClick={() => setSearchQuery("")} icon="close-line">
                  {getI18nLabel("clearSearch")}
                </Button>
              )}
            </div>
          </div>

          <ul>
            {filteredCountries?.map((country) => (
              <li key={country.id}>
                <Link href={`${baseUrl}&country_code=${country.id}`}>
                  {getFlagEmoji(getIso2(country.id))} {country[`label_${currentLang}`]}
                </Link>
              </li>
            ))}
          </ul>
        </ModalContent>
      </Modal>
    </>
  );
}
