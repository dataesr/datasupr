import { useSearchParams } from "react-router-dom";
import { getCountryAdjectives } from "../../../../../../components/country-selector/utils";
import EvolutionCharts from "../../charts/evolution";

export default function EvolutionContent() {
  const [searchParams] = useSearchParams();

  // Récupérer les paramètres de filtres depuis l'URL
  const countryCode = searchParams.get("country_code") || "FRA";
  const currentLang = searchParams.get("language") || "fr";

  // Adjectifs de nationalité (masculin et féminin)
  const countryAdj = getCountryAdjectives(countryCode);

  return (
    <div>
      {/* Graphiques d'évolution */}
      <div className="fr-mt-4w">
        <EvolutionCharts countryAdjective={countryAdj.f} currentLang={currentLang} />
      </div>
    </div>
  );
}
