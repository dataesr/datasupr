import { Logo } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import SwitchTheme from "../switch-theme";
import i18n from "./i18n.json";

import "./styles.scss";

const { VITE_MINISTER_NAME, VITE_VERSION } = import.meta.env;


export default function Footer({ href = "/", title = "Accueil - DataSupR" }: { href?: string, title?: string }) {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <footer className="fr-footer" role="contentinfo" id="footer">
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <a href={href} title={title}>
              <Logo splitCharacter="<br>" text={VITE_MINISTER_NAME} />
            </a>
          </div>
          <div>
            <svg aria-hidden="true" viewBox="0 0 1167.77 752.85" width="100%">
              <use
                className="sies-logo"
                href="/logos/sies_logo_signature.svg#sies-logo-text"
              />
              <use href="/logos/sies_logo_signature.svg#sies-logo-artwork" />
            </svg>
          </div>
          <div className="fr-footer__content">
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener external"
                  title="Legifrance - nouvelle fenêtre"
                  href="https://legifrance.gouv.fr"
                >
                  legifrance.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener external"
                  title="Gouvernement français - nouvelle fenêtre"
                  href="https://gouvernement.fr"
                >
                  gouvernement.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener external"
                  title="Service public - nouvelle fenêtre"
                  href="https://service-public.fr"
                >
                  service-public.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noopener external"
                  title="DataGouv - nouvelle fenêtre"
                  href="https://data.gouv.fr"
                >
                  data.gouv.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="#">
                {getI18nLabel("sitemap")}
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="#">
                {getI18nLabel("accessibility")}
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="#">
                {getI18nLabel("legalNotice")}
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="#">
                {getI18nLabel("personalData")}
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/cookies">
                {getI18nLabel("cookies")}
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="#">
                {getI18nLabel("contact")}
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a
                className="fr-footer__bottom-link"
                href={`https://github.com/dataesr/datasupr/releases/tag/v${VITE_VERSION}`}
                rel="noreferer noopenner"
                target="_blank"
              >
                {`v${VITE_VERSION}`}
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <button
                className="fr-footer__bottom-link fr-fi-theme-fill fr-link--icon-left"
                aria-controls="fr-theme-modal"
                data-fr-opened="false"
              >
                Paramètres d'affichage
              </button>
            </li>
          </ul>
          <div className="fr-footer__bottom-copy">
            <p
              dangerouslySetInnerHTML={{
                __html: getI18nLabel("rightsReserved"),
              }}
            />
          </div>
        </div>
      </div>
      <SwitchTheme />
    </footer>
  );
}
