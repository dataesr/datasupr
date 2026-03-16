import { useSearchParams } from "react-router-dom";
import PositioningGlobalChart from "../../charts/positioning-global";
import PositioningFundingTypeChart from "../../charts/positioning-funding-type";

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

      {/* TODO: Graphique par domaine scientifique */}
      <div className="fr-my-4w fr-p-3w" style={{ backgroundColor: "#f6f6f6", borderRadius: "8px" }}>
        <p className="fr-text--sm fr-mb-0">
          {currentLang === "fr" ? "🚧 Graphique par domaine scientifique (à venir)" : "🚧 Chart by scientific domain (coming soon)"}
        </p>
      </div>

      {/* TODO: Graphique par panel */}
      <div className="fr-my-4w fr-p-3w" style={{ backgroundColor: "#f6f6f6", borderRadius: "8px" }}>
        <p className="fr-text--sm fr-mb-0">{currentLang === "fr" ? "🚧 Graphique par panel (à venir)" : "🚧 Chart by panel (coming soon)"}</p>
      </div>
    </div>
  );
}
