const EUROPEAN_UNION_COUNTRIES_ISO3 = [
  "AUT",
  "BEL",
  "BGR",
  "HRV",
  "CYP",
  "CZE",
  "DNK",
  "EST",
  "FIN",
  "FRA",
  "DEU",
  "GRC",
  "HUN",
  "IRL",
  "ITA",
  "LVA",
  "LTU",
  "LUX",
  "MLT",
  "NLD",
  "POL",
  "PRT",
  "ROU",
  "SVK",
  "SVN",
  "ESP",
  "SWE",
];

function getEuropeanUnionCountriesIso3() {
  return EUROPEAN_UNION_COUNTRIES_ISO3;
}

function isAnEuropeanUnionCountry(country_code) {
  return EUROPEAN_UNION_COUNTRIES_ISO3.includes(country_code);
}

export { getEuropeanUnionCountriesIso3, isAnEuropeanUnionCountry };
