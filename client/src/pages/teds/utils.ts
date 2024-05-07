import config from "./charts-config.json";

export function getConfig(id) {
  const chartConfig = config[id];
  if (!chartConfig) {
    throw new Error(`No config found for chart id ${id}`);
  }
  return chartConfig;
}

export function getFilterLabel(filterId) {
  const filters = {
    country_code: "Pays",
    // "theme": "Thème",
    // "chart_id": "Graphique"
  };

  return filters[filterId] || filterId;
}

export function getIso2Label(iso2) {
  const iso2Labels = {
    FR: "France",
    DE: "Allemagne",
    IT: "Italie",
    ES: "Espagne",
    GB: "Royaume-Uni",
    PL: "Pologne",
    RO: "Roumanie",
    NL: "Pays-Bas",
    BE: "Belgique",
    EL: "Grèce",
    CZ: "République tchèque",
    PT: "Portugal",
    SE: "Suède",
    HU: "Hongrie",
    AT: "Autriche",
    BG: "Bulgarie",
    DK: "Danemark",
    FI: "Finlande",
    SK: "Slovaquie",
    IE: "Irlande",
    HR: "Croatie",
    LT: "Lituanie",
    SI: "Slovénie",
    LV: "Lettonie",
    EE: "Estonie",
    CY: "Chypre",
    LU: "Luxembourg",
    MT: "Malte",
  };

  return iso2Labels[iso2] || iso2;
}
