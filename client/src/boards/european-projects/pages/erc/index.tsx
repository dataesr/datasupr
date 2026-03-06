import { Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../../../../components/breadcrumb";
import { ErcSynthesisCards, ErcDestinationCards } from "../../components/cards/erc";
import { getCountryAdjectives } from "../../../../components/country-selector/utils";
import navigationConfig from "./navigation-config.json";

export default function ERC() {
  const [searchParams] = useSearchParams();

  // Récupérer les paramètres de filtres depuis l'URL
  const countryCode = searchParams.get("country_code") || "FRA";
  const callYear = searchParams.get("call_year") || undefined;
  const framework = searchParams.get("framework") || undefined;

  // Adjectifs de nationalité (masculin et féminin)
  const countryAdj = getCountryAdjectives(countryCode);

  return (
    <>
      <Container as="main" fluid>
        <div className="ep-navigator-wrapper">
          <Container>
            <Breadcrumb config={navigationConfig} />
            {/* TODO: Ajouter les filtres ERC (années, framework) */}
          </Container>
        </div>
        <Container>
          <h2 className="fr-mb-3w">Synthèse ERC</h2>

          {/* Cartes de synthèse principales */}
          <ErcSynthesisCards countryCode={countryCode} callYear={callYear} framework={framework} countryAdj={countryAdj} />

          {/* Cartes par type de financement */}
          <ErcDestinationCards countryCode={countryCode} callYear={callYear} framework={framework} />

          {/* TODO: Sections à implémenter */}
          <div className="fr-mt-4w">
            <h3>Par panel</h3>
            <p className="fr-text--sm fr-text--muted">
              Graphique des financements obtenus par porteurs de projets ventilé par panel et type de financement (ordonnées : financements en M€,
              abscisses : Nombre de porteurs de projets PI). Légende: Panel ERC en couleur, type de financement en forme.
            </p>
          </div>

          <div className="fr-mt-4w">
            <h3>Évolution temporelle</h3>
            <p className="fr-text--sm fr-text--muted">
              Graphiques d'évolution de la participation {countryAdj.f} dans les ERC au fil du temps (poids de projets lauréats et taux de succès par
              type de financement).
            </p>
          </div>
        </Container>
      </Container>
    </>
  );
}
