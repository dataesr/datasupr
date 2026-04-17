import { useSearchParams } from "react-router-dom";

export default function EvolutionContent() {
  const [searchParams] = useSearchParams();
  const _countryCode = searchParams.get("country_code") || "FRA";
  const _currentLang = searchParams.get("language") || "fr";

  return <div>{/* TODO: Graphiques d'évolution MSCA */}</div>;
}
