import { useSearchParams } from "react-router-dom";

export default function EvolutionContent() {
  const [searchParams] = useSearchParams();
  const countryCode = searchParams.get("country_code") || "FRA";
  const currentLang = searchParams.get("language") || "fr";

  console.log(countryCode, currentLang);

  return <div>{/* TODO: Graphiques d'évolution MSCA */}</div>;
}
