// Mapping des codes pays vers leurs noms avec articles (pour le français) et genres
export const COUNTRY_MAPPING: Record<string, { name: { fr: string; en: string }; gender: "masculine" | "feminine" }> = {
  FRA: {
    name: { fr: "La France", en: "France" },
    gender: "feminine",
  },
  DEU: {
    name: { fr: "L'Allemagne", en: "Germany" },
    gender: "feminine",
  },
  NLD: {
    name: { fr: "Les Pays-Bas", en: "The Netherlands" },
    gender: "masculine",
  },
  ITA: {
    name: { fr: "L'Italie", en: "Italy" },
    gender: "feminine",
  },
  ESP: {
    name: { fr: "L'Espagne", en: "Spain" },
    gender: "feminine",
  },
  BEL: {
    name: { fr: "La Belgique", en: "Belgium" },
    gender: "feminine",
  },
  AUT: {
    name: { fr: "L'Autriche", en: "Austria" },
    gender: "feminine",
  },
  SWE: {
    name: { fr: "La Suède", en: "Sweden" },
    gender: "feminine",
  },
  CHE: {
    name: { fr: "La Suisse", en: "Switzerland" },
    gender: "feminine",
  },
  NOR: {
    name: { fr: "La Norvège", en: "Norway" },
    gender: "feminine",
  },
  DNK: {
    name: { fr: "Le Danemark", en: "Denmark" },
    gender: "masculine",
  },
  FIN: {
    name: { fr: "La Finlande", en: "Finland" },
    gender: "feminine",
  },
  PRT: {
    name: { fr: "Le Portugal", en: "Portugal" },
    gender: "masculine",
  },
  POL: {
    name: { fr: "La Pologne", en: "Poland" },
    gender: "feminine",
  },
  GRC: {
    name: { fr: "La Grèce", en: "Greece" },
    gender: "feminine",
  },
  CZE: {
    name: { fr: "La République tchèque", en: "Czech Republic" },
    gender: "feminine",
  },
  HUN: {
    name: { fr: "La Hongrie", en: "Hungary" },
    gender: "feminine",
  },
  IRL: {
    name: { fr: "L'Irlande", en: "Ireland" },
    gender: "feminine",
  },
  SVN: {
    name: { fr: "La Slovénie", en: "Slovenia" },
    gender: "feminine",
  },
  SVK: {
    name: { fr: "La Slovaquie", en: "Slovakia" },
    gender: "feminine",
  },
  HRV: {
    name: { fr: "La Croatie", en: "Croatia" },
    gender: "feminine",
  },
  BGR: {
    name: { fr: "La Bulgarie", en: "Bulgaria" },
    gender: "feminine",
  },
  ROU: {
    name: { fr: "La Roumanie", en: "Romania" },
    gender: "feminine",
  },
  EST: {
    name: { fr: "L'Estonie", en: "Estonia" },
    gender: "feminine",
  },
  LVA: {
    name: { fr: "La Lettonie", en: "Latvia" },
    gender: "feminine",
  },
  LTU: {
    name: { fr: "La Lituanie", en: "Lithuania" },
    gender: "feminine",
  },
  LUX: {
    name: { fr: "Le Luxembourg", en: "Luxembourg" },
    gender: "masculine",
  },
  MLT: {
    name: { fr: "Malte", en: "Malta" },
    gender: "feminine",
  },
  CYP: {
    name: { fr: "Chypre", en: "Cyprus" },
    gender: "feminine",
  },
  GBR: {
    name: { fr: "Le Royaume-Uni", en: "United Kingdom" },
    gender: "masculine",
  },
  ISL: {
    name: { fr: "L'Islande", en: "Iceland" },
    gender: "feminine",
  },
  TUR: {
    name: { fr: "La Turquie", en: "Turkey" },
    gender: "feminine",
  },
  ISR: {
    name: { fr: "Israël", en: "Israel" },
    gender: "masculine",
  },
  UKR: {
    name: { fr: "L'Ukraine", en: "Ukraine" },
    gender: "feminine",
  },
};

/**
 * Retourne le nom du pays avec l'article approprié
 * @param countryCode - Code ISO3 du pays (ex: FRA, DEU)
 * @param lang - Langue (fr ou en)
 * @param fallbackName - Nom de secours si le pays n'est pas dans le mapping
 * @returns Le nom du pays avec article (en français) ou sans article (en anglais)
 */
export function getCountryNameWithArticle(countryCode: string, lang: "fr" | "en" = "fr", fallbackName?: string): string {
  const country = COUNTRY_MAPPING[countryCode];
  if (country) {
    return country.name[lang];
  }
  return fallbackName || countryCode;
}

/**
 * Retourne le nom du pays avec préposition "de" + article approprié (français uniquement)
 * Gère les contractions : de + le = du, de + les = des
 * @param countryCode - Code ISO3 du pays (ex: FRA, DEU)
 * @param fallbackName - Nom de secours si le pays n'est pas dans le mapping
 * @returns Le nom du pays avec "de" + article (ex: "de la France", "de l'Allemagne", "du Luxembourg")
 */
export function getCountryNameWithDe(countryCode: string, fallbackName?: string): string {
  const country = COUNTRY_MAPPING[countryCode];
  if (country) {
    const name = country.name.fr;
    // Traiter les cas avec article
    if (name.startsWith("L'") || name.startsWith("l'")) {
      // L'Allemagne → de l'Allemagne
      return name.replace(/^L'/, "de l'");
    } else if (name.startsWith("La ") || name.startsWith("la ")) {
      // La France → de la France
      return name.replace(/^La /, "de la ");
    } else if (name.startsWith("Le ") || name.startsWith("le ")) {
      // Le Luxembourg → du Luxembourg (contraction de "de le")
      return name.replace(/^Le /, "du ");
    } else if (name.startsWith("Les ") || name.startsWith("les ")) {
      // Les Pays-Bas → des Pays-Bas (contraction de "de les")
      return name.replace(/^Les /, "des ");
    }
    // Pas d'article (ex: Malte, Chypre, Israël)
    return `de ${name}`;
  }
  return fallbackName ? `de ${fallbackName}` : countryCode;
}
