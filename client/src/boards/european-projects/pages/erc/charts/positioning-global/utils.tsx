import { useSearchParams } from "react-router-dom";
import { rangeOfYearsToApiFormat } from "../../url-utils";
import type { PositioningData, CountryData } from "./query";

export function useGetParams() {
  const [searchParams] = useSearchParams();

  const params: string[] = [];

  // Récupérer le paramètre country_code s'il existe
  const countryCode = searchParams.get("country_code") || "FRA";
  params.push(`country_code=${countryCode}`);

  // Filtres additionnels
  // Convertir range_of_years (format URL: pipe-separated) en call_year (format API: comma-separated)
  const rangeOfYears = searchParams.get("range_of_years");
  const callYear = rangeOfYearsToApiFormat(rangeOfYears);
  if (callYear) {
    params.push(`call_year=${callYear}`);
  }

  const destinationCode = searchParams.get("destination_code");
  if (destinationCode) {
    params.push(`destination_code=${destinationCode}`);
  }

  const framework = searchParams.get("framework");
  if (framework) {
    params.push(`framework=${framework}`);
  }

  const currentLang = searchParams.get("language") || "fr";

  return { params: params.join("&"), currentLang, countryCode };
}

// Couleurs pour distinguer le pays sélectionné des autres
export const COLORS = {
  selectedCountry: "#000091", // Bleu France
  otherCountries: "#CACAFB", // Bleu clair
};

export interface ProcessedPositioningData {
  countries: {
    code: string;
    name: string;
    value: number;
    isSelected: boolean;
  }[];
  selectedCountry: CountryData | null;
  metric: "projects" | "funding";
}

/**
 * Traite les données pour créer le classement des pays
 */
export function processPositioningData(
  data: PositioningData,
  countryCode: string,
  currentLang: string = "fr",
  metric: "projects" | "funding" = "projects",
): ProcessedPositioningData {
  if (!data || !data.successful || !data.successful.countries) {
    return { countries: [], selectedCountry: null, metric };
  }

  const countries = data.successful.countries;

  // Trouver le pays sélectionné
  const selectedCountry = countries.find((c) => c.country_code === countryCode) || null;

  // Trier par la métrique choisie
  const sortedCountries = [...countries].sort((a, b) => {
    if (metric === "projects") {
      return b.total_pi - a.total_pi;
    }
    return b.total_funding_project - a.total_funding_project;
  });

  // Trouver le rang du pays sélectionné
  const selectedRank = sortedCountries.findIndex((c) => c.country_code === countryCode);

  // Prendre le top 10 ou inclure le pays sélectionné s'il n'est pas dans le top 10
  let displayCountries = sortedCountries.slice(0, 10);

  // Si le pays sélectionné n'est pas dans le top 10, l'ajouter
  if (selectedRank >= 10 && selectedCountry) {
    displayCountries = [...displayCountries.slice(0, 9), selectedCountry];
  }

  // Formater les données pour le graphique
  const formattedCountries = displayCountries.map((c) => ({
    code: c.country_code,
    name: currentLang === "fr" ? c.country_name_fr : c.country_name_en,
    value: metric === "projects" ? c.total_pi : c.total_funding_project,
    isSelected: c.country_code === countryCode,
  }));

  // Re-trier pour l'affichage (du plus grand au plus petit)
  formattedCountries.sort((a, b) => b.value - a.value);

  return {
    countries: formattedCountries,
    selectedCountry,
    metric,
  };
}

/**
 * Génère le tableau de données pour l'accessibilité
 */
export function renderDataTable(processedData: ProcessedPositioningData, currentLang: string = "fr"): JSX.Element {
  const headers =
    currentLang === "fr"
      ? ["Rang", "Pays", processedData.metric === "projects" ? "Nombre de projets" : "Financements (M€)"]
      : ["Rank", "Country", processedData.metric === "projects" ? "Number of projects" : "Funding (M€)"];

  return (
    <table className="fr-table">
      <caption>{currentLang === "fr" ? "Classement des pays par nombre de projets ERC" : "Country ranking by number of ERC projects"}</caption>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {processedData.countries.map((country, index) => (
          <tr key={country.code} style={country.isSelected ? { fontWeight: "bold" } : {}}>
            <td>{index + 1}</td>
            <td>{country.name}</td>
            <td>{processedData.metric === "funding" ? (country.value / 1_000_000).toFixed(1) : country.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
