import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { Button, Header, Logo, Service, FastAccess } from "@dataesr/dsfr-plus";

import Footer from "./footer";
import SwitchTheme from "../../../../components/switch-theme";
import i18n from "./i18n.json";

export default function GlobalLayout() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  if (!pathname) return null;

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <>
      <Header className="fr-header--responsive">
        <Logo text="Ministère|de l'Enseignement|supérieur,|de la Recherche|et de l'Espace" />
        <Service name="DataSupR" tagline={getI18nLabel("title")} />
        <FastAccess className="fr-btns-group--sm fr-btns-group--inline-sm">
          <Button
            as="a"
            href="/"
            icon="compass-3-line"
            size="sm"
            variant="text"
            title="Explorer les tableaux de bord"
            className="fr-mb-1w fr-mb-sm-0"
          >
            <span className="fr-hidden fr-unhidden-sm">
              {getI18nLabel("explore")}
            </span>
          </Button>
          <Button
            as="a"
            href="https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-atlas_regional-effectifs-d-etudiants-inscrits/table/?disjunctive.rgp_formations_ou_etablissements&sort=-rentree"
            icon="database-2-line"
            rel="noreferer noopener"
            size="sm"
            target="_blank"
            variant="text"
            title="Accéder aux jeux de données"
            className="fr-mb-1w fr-mb-sm-0"
          >
            <span className="fr-hidden fr-unhidden-sm">
              {getI18nLabel("datasets")}
            </span>
          </Button>
          <Button
            aria-controls="fr-theme-modal"
            className="fr-btn fr-icon-theme-fill fr-mb-1w fr-mb-sm-0"
            data-fr-opened="false"
            size="sm"
            variant="text"
            title="Changer le thème d'affichage"
          >
            <span className="fr-hidden fr-unhidden-sm">
              {getI18nLabel("themes")}
            </span>
          </Button>
        </FastAccess>
      </Header>
      <Outlet />
      <Footer />
      <SwitchTheme />
    </>
  );
}
