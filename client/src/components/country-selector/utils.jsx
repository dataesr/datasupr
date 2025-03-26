const { VITE_APP_SERVER_URL } = import.meta.env;
import allCountries from "./all-countries.json";

export function getCountryInfo(iso3) {
  const data = allCountries.find((country) => country.cca3 === iso3);
  if (!data) {
    return null;
  }
  return {
    continent: data.continents,
    flag: data.flags[0],
    iso3: data.cca3,
    iso2: data.cca2,
    name_fr: data.translations.fra.common,
    name_en: data.name.common,
  };
}

export async function getCountriesWithData() {
  const url = `${VITE_APP_SERVER_URL}/european-projects/get-countries-with-data`;
  return fetch(url).then((response) => response.json());
}
