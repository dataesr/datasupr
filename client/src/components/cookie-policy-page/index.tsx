import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CookieConsentModal } from "../cookie-consent/index";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import i18n from "../cookie-consent/i18n.json";

export default function CookiePolicyPage() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resetConsent, consent, acceptAll, refuseAll, savePreferences } = useCookieConsent();

  function getI18nLabel(key: string) {
    const keys = key.split(".");
    let value: Record<string, unknown> = i18n;
    for (const k of keys) {
      value = value[k] as Record<string, unknown>;
    }
    return (value as Record<string, string>)[currentLang.toLowerCase()];
  }

  const handleOpenPreferences = () => {
    setIsModalOpen(true);
  };

  const handleResetConsent = () => {
    if (confirm(getI18nLabel("page.resetConsent.confirm"))) {
      resetConsent();
    }
  };

  return (
    <div className="fr-container cookie-policy-page">
      <div className="fr-grid-row fr-grid-row--center">
        <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
          <nav role="navigation" className="fr-breadcrumb" aria-label="vous êtes ici :">
            <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">
              Voir le fil d'Ariane
            </button>
            <div className="fr-collapse" id="breadcrumb-1">
              <ol className="fr-breadcrumb__list">
                <li>
                  <a className="fr-breadcrumb__link" href="/">
                    Accueil
                  </a>
                </li>
                <li>
                  <a className="fr-breadcrumb__link" aria-current="page">
                    {getI18nLabel("page.title")}
                  </a>
                </li>
              </ol>
            </div>
          </nav>

          <h1 className="fr-h1">{getI18nLabel("page.title")}</h1>

          <p className="fr-text--lead">{getI18nLabel("page.introduction")}</p>

          <div className="cookie-policy-section">
            <h2 className="fr-h3">{getI18nLabel("page.whatAreCookies.title")}</h2>
            <p>{getI18nLabel("page.whatAreCookies.content")}</p>
          </div>

          <div className="cookie-policy-section">
            <h2 className="fr-h3">{getI18nLabel("page.cookieTypes.title")}</h2>

            <div className="fr-accordion">
              <h3 className="fr-accordion__title">
                <button className="fr-accordion__btn" aria-expanded="false" aria-controls="accordion-necessary">
                  {getI18nLabel("categories.necessary.title")}
                </button>
              </h3>
              <div className="fr-collapse" id="accordion-necessary">
                <div className="fr-accordion__body">
                  <p>{getI18nLabel("categories.necessary.description")}</p>
                  <p>
                    <strong>Exemples :</strong>
                  </p>
                  <ul>
                    <li>Cookies de session pour maintenir votre connexion</li>
                    <li>Cookies de sécurité pour prévenir les attaques</li>
                    <li>Cookies de préférences linguistiques</li>
                  </ul>
                  <p>
                    <strong>Durée de conservation :</strong> Session ou selon la fonctionnalité
                  </p>
                </div>
              </div>
            </div>

            <div className="fr-accordion">
              <h3 className="fr-accordion__title">
                <button className="fr-accordion__btn" aria-expanded="false" aria-controls="accordion-functional">
                  {getI18nLabel("categories.functional.title")}
                </button>
              </h3>
              <div className="fr-collapse" id="accordion-functional">
                <div className="fr-accordion__body">
                  <p>{getI18nLabel("categories.functional.description")}</p>
                  <p>
                    <strong>Exemples :</strong>
                  </p>
                  <ul>
                    <li>
                      <code>selectedPillars</code> : Sauvegarde vos filtres de piliers dans les projets européens
                    </li>
                    <li>
                      <code>selectedPrograms</code> : Sauvegarde vos filtres de programmes
                    </li>
                    <li>
                      <code>selectedThematics</code> : Sauvegarde vos filtres de thématiques
                    </li>
                    <li>
                      <code>selectedDestinations</code> : Sauvegarde vos filtres de destinations
                    </li>
                  </ul>
                  <p>
                    <strong>Durée de conservation :</strong> 30 jours
                  </p>
                </div>
              </div>
            </div>

            <div className="fr-accordion">
              <h3 className="fr-accordion__title">
                <button className="fr-accordion__btn" aria-expanded="false" aria-controls="accordion-analytics">
                  {getI18nLabel("categories.analytics.title")}
                </button>
              </h3>
              <div className="fr-collapse" id="accordion-analytics">
                <div className="fr-accordion__body">
                  <p>{getI18nLabel("categories.analytics.description")}</p>
                  <p>
                    <strong>Note :</strong> Les cookies analytiques ne sont pas encore implémentés sur ce site, mais cette catégorie est prévue pour
                    de futurs outils d'analyse d'audience anonymisés.
                  </p>
                  <p>
                    <strong>Durée de conservation prévue :</strong> 13 mois maximum
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cookie-preferences-section">
            <h3 className="fr-h4">{getI18nLabel("page.managePreferences.title")}</h3>
            <p>{getI18nLabel("page.managePreferences.content")}</p>
            <div className="fr-btns-group">
              <button className="fr-btn" onClick={handleOpenPreferences}>
                {getI18nLabel("page.managePreferences.button")}
              </button>
              <button className="fr-btn fr-btn--secondary" onClick={handleResetConsent}>
                {getI18nLabel("page.resetConsent.button")}
              </button>
            </div>
          </div>

          <div className="cookie-policy-section">
            <h2 className="fr-h3">Vos droits</h2>
            <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
            <ul>
              <li>
                <strong>Droit d'accès :</strong> Vous pouvez demander quelles données personnelles nous détenons sur vous
              </li>
              <li>
                <strong>Droit de rectification :</strong> Vous pouvez demander la correction de données inexactes
              </li>
              <li>
                <strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données
              </li>
              <li>
                <strong>Droit d'opposition :</strong> Vous pouvez vous opposer à l'utilisation de certains cookies
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré
              </li>
            </ul>
          </div>

          <div className="cookie-policy-section">
            <h2 className="fr-h3">{getI18nLabel("page.contact.title")}</h2>
            <p>{getI18nLabel("page.contact.content")}</p>
            <div className="fr-highlight">
              <p>
                <strong>Contact :</strong>
              </p>
              <p>
                Ministère de l'Enseignement supérieur et de la Recherche
                <br />
                Direction des systèmes d'information
                <br />
                Email : <a href="mailto:contact@datasupr.fr">contact@datasupr.fr</a>
              </p>
            </div>
          </div>

          <div className="cookie-policy-section">
            <p className="fr-text--sm">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>

      <CookieConsentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAcceptAll={acceptAll}
        onRefuseAll={refuseAll}
        onSavePreferences={savePreferences}
        consent={consent}
      />
    </div>
  );
}
