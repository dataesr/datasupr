import { useSearchParams } from "react-router-dom";
import PositioningGlobalChart from "../../charts/positioning-global";
import PositioningFundingTypeChart from "../../charts/positioning-funding-type";
import PositioningScientificDomainChart from "../../charts/positioning-scientific-domain";
import PositioningScientificDomainTreemap from "../../charts/positioning-scientific-domain-treemap";

export default function PositionnementContent() {
  const [searchParams] = useSearchParams();

  // Récupérer les paramètres de filtres depuis l'URL
  const countryCode = searchParams.get("country_code") || "FRA";
  const currentLang = searchParams.get("language") || "fr";

  return (
    <div>
      {/* Graphique global de positionnement par rapport au top 10 des pays */}
      <div className="fr-my-4w">
        <PositioningGlobalChart countryCode={countryCode} currentLang={currentLang} />
      </div>

      {/* Graphique par type de financement */}
      <div className="fr-my-4w">
        <PositioningFundingTypeChart countryCode={countryCode} currentLang={currentLang} />
      </div>

      {/* Graphique par domaine scientifique */}
      <div className="fr-my-4w">
        <PositioningScientificDomainChart countryCode={countryCode} currentLang={currentLang} />
      </div>

      {/* Treemap par domaine scientifique */}
      <div className="fr-my-4w">
        <PositioningScientificDomainTreemap countryCode={countryCode} currentLang={currentLang} />
      </div>

      {/* TODO: Graphique par panel */}
      <div className="fr-my-4w fr-p-3w" style={{ backgroundColor: "#f6f6f6", borderRadius: "8px" }}>
        <p className="fr-text--sm fr-mb-0">{currentLang === "fr" ? "🚧 Graphique par panel (à venir)" : "🚧 Chart by panel (coming soon)"}</p>
      </div>
    </div>
  );
}
