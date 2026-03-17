import { useSearchParams } from "react-router-dom";
import { rangeOfYearsToApiFormat } from "../../url-utils";
import type { PositioningByDomainData, CountryData } from "./query";

// Domaines scientifiques ERC
export const SCIENTIFIC_DOMAINS = [
  {
    code: "LS",
    label: {
      fr: "Sciences de la vie (LS)",
      en: "Life Sciences (LS)",
    },
  },
  {
    code: "PE",
    label: {
      fr: "Sciences physiques et ingénierie (PE)",
      en: "Physical Sciences & Engineering (PE)",
    },
  },
  {
    code: "SH",
    label: {
      fr: "Sciences sociales et humaines (SH)",
      en: "Social Sciences & Humanities (SH)",
    },
  },
] as const;

export type ScientificDomainCode = (typeof SCIENTIFIC_DOMAINS)[number]["code"];

const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

export function getChartColors(domainCode: ScientificDomainCode) {
  return {
    selectedCountry: css("--selected-country-color"),
    otherCountries: css(`--erc-domain-${domainCode.toLowerCase()}-color`),
    avgTop10: css("--erc-avg-top10-color"),
    avgAll: css("--erc-avg-all-color"),
  };
}

export interface ProcessedPositioningByDomainData {
  countries: {
    code: string;
    name: string;
    value: number;
    isSelected: boolean;
  }[];
  selectedCountry: CountryData | null;
  metric: "projects" | "funding";
  domainCode: ScientificDomainCode;
  avgTop10: number;
  avgAll: number;
}

export function useGetParams() {
  const [searchParams] = useSearchParams();

  const params: string[] = [];

  const countryCode = searchParams.get("country_code") || "FRA";
  params.push(`country_code=${countryCode}`);

  const rangeOfYears = searchParams.get("range_of_years");
  const callYear = rangeOfYearsToApiFormat(rangeOfYears);
  if (callYear) {
    params.push(`call_year=${callYear}`);
  }

  const framework = searchParams.get("framework");
  if (framework) {
    params.push(`framework=${framework}`);
  }

  const currentLang = searchParams.get("language") || "fr";

  return { params: params.join("&"), currentLang, countryCode };
}

export function processData(
  data: PositioningByDomainData,
  countryCode: string,
  currentLang: string = "fr",
  metric: "projects" | "funding" = "projects",
  domainCode: ScientificDomainCode = "LS",
): ProcessedPositioningByDomainData {
  if (!data || !data.successful || !data.successful.countries) {
    return { countries: [], selectedCountry: null, metric, domainCode, avgTop10: 0, avgAll: 0 };
  }

  const countries = data.successful.countries;
  const selectedCountry = countries.find((c) => c.country_code === countryCode) || null;

  const getValue = (c: CountryData) => (metric === "projects" ? c.total_pi : c.total_funding_project);

  const sortedCountries = [...countries].sort((a, b) => getValue(b) - getValue(a));

  const top10Countries = sortedCountries.slice(0, 10);
  const avgTop10 = top10Countries.length > 0 ? top10Countries.reduce((sum, c) => sum + getValue(c), 0) / top10Countries.length : 0;
  const avgAll = countries.length > 0 ? countries.reduce((sum, c) => sum + getValue(c), 0) / countries.length : 0;

  const selectedRank = sortedCountries.findIndex((c) => c.country_code === countryCode);

  let displayCountries = sortedCountries.slice(0, 10);
  if (selectedRank >= 10 && selectedCountry) {
    displayCountries = [...displayCountries.slice(0, 9), selectedCountry];
  }

  const formattedCountries = displayCountries.map((c) => ({
    code: c.country_code,
    name: currentLang === "fr" ? c.country_name_fr : c.country_name_en,
    value: getValue(c),
    isSelected: c.country_code === countryCode,
  }));

  formattedCountries.sort((a, b) => b.value - a.value);

  return { countries: formattedCountries, selectedCountry, metric, domainCode, avgTop10, avgAll };
}

export function renderDataTable(processedData: ProcessedPositioningByDomainData, currentLang: string = "fr"): JSX.Element {
  const headers =
    currentLang === "fr"
      ? ["Rang", "Pays", processedData.metric === "projects" ? "Nombre de projets" : "Financements (M€)"]
      : ["Rank", "Country", processedData.metric === "projects" ? "Number of projects" : "Funding (M€)"];

  const rows = processedData.countries.map((c, i) => [
    String(i + 1),
    c.name,
    processedData.metric === "funding" ? `${(c.value / 1_000_000).toFixed(1)} M€` : String(c.value),
  ]);

  return (
    <table className="fr-table">
      <caption>{currentLang === "fr" ? "Classement des pays par domaine scientifique ERC" : "Country ranking by ERC scientific domain"}</caption>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={processedData.countries[i]?.isSelected ? { fontWeight: "bold" } : {}}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
