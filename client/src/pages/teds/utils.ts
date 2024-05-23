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
    theme: "Thème",
    chart_id: "Graphique",
  };

  return filters[filterId] || filterId;
}

export function getIso2Label(iso2) {
  const iso2Labels = {
    AT: "Autriche",
    BE: "Belgique",
    BG: "Bulgarie",
    CY: "Chypre",
    CZ: "République tchèque",
    DE: "Allemagne",
    DK: "Danemark",
    EE: "Estonie",
    EL: "Grèce",
    ES: "Espagne",
    FI: "Finlande",
    FR: "France",
    GB: "Royaume-Uni",
    HR: "Croatie",
    HU: "Hongrie",
    IE: "Irlande",
    IT: "Italie",
    LT: "Lituanie",
    LU: "Luxembourg",
    LV: "Lettonie",
    MT: "Malte",
    NL: "Pays-Bas",
    PL: "Pologne",
    PT: "Portugal",
    RO: "Roumanie",
    SE: "Suède",
    SI: "Slovénie",
    SK: "Slovaquie",
  };

  return iso2Labels[iso2] || iso2;
}
