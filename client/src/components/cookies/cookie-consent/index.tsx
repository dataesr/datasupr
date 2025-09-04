import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCookieConsent, CookieCategories } from "../../../hooks/useCookieConsent";
import { Button, Text, Title, Container, Row, Col, Modal, ModalContent, ModalTitle } from "@dataesr/dsfr-plus";
import "./styles.scss";

// Interfaces pour les props des composants
interface CookieConsentBannerProps {
  onAcceptAll: () => void;
  onRefuseAll: () => void;
}

interface CookieConsentModalContentProps {
  onAcceptAll: () => void;
  onRefuseAll: () => void;
  onSavePreferences: (preferences: CookieCategories) => void;
  consent: CookieCategories;
}

// Traductions
const translations = {
  fr: {
    banner: {
      title: "Nous utilisons des cookies",
      description:
        "Ce site utilise des cookies pour améliorer votre expérience. Vous pouvez accepter tous les cookies ou personnaliser vos préférences.",
      acceptAll: "Accepter tout",
      refuse: "Refuser",
      customize: "Personnaliser",
    },
    modal: {
      title: "Paramètres des cookies",
      description: "Gérez vos préférences de cookies. Vous pouvez activer ou désactiver différentes catégories de cookies selon vos préférences.",
      necessary: {
        title: "Cookies nécessaires",
        description: "Ces cookies sont essentiels au fonctionnement du site.",
      },
      functional: {
        title: "Cookies fonctionnels",
        description: "Ces cookies permettent de mémoriser vos préférences (filtres, langue, etc.).",
      },
      analytics: {
        title: "Cookies d'analyse",
        description: "Ces cookies nous aident à comprendre comment vous utilisez notre site.",
      },
      save: "Enregistrer les préférences",
      acceptAll: "Accepter tout",
      refuse: "Refuser tout",
    },
  },
  en: {
    banner: {
      title: "We use cookies",
      description: "This site uses cookies to improve your experience. You can accept all cookies or customize your preferences.",
      acceptAll: "Accept all",
      refuse: "Refuse",
      customize: "Customize",
    },
    modal: {
      title: "Cookie settings",
      description: "Manage your cookie preferences. You can enable or disable different categories of cookies according to your preferences.",
      necessary: {
        title: "Necessary cookies",
        description: "These cookies are essential for the site to function.",
      },
      functional: {
        title: "Functional cookies",
        description: "These cookies allow us to remember your preferences (filters, language, etc.).",
      },
      analytics: {
        title: "Analytics cookies",
        description: "These cookies help us understand how you use our site.",
      },
      save: "Save preferences",
      acceptAll: "Accept all",
      refuse: "Refuse all",
    },
  },
};

// Composant Banner de consentement
export function CookieConsentBanner({ onAcceptAll, onRefuseAll }: CookieConsentBannerProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentLang = searchParams.get("language") || "fr";
  const t = translations[currentLang as keyof typeof translations] || translations.fr;

  const handleCustomize = () => {
    onAcceptAll(); // Ferme la bannière
    navigate("/cookies");
  };

  return (
    <div className="cookie-consent-banner">
      <Container>
        <Row>
          <Col xs={12}>
            <Title as="h3" look="h6">
              {t.banner.title}
            </Title>
            <Text>{t.banner.description}</Text>
            <div className="cookie-consent-banner__actions">
              <Button onClick={onAcceptAll}>{t.banner.acceptAll}</Button>
              <Button onClick={onRefuseAll} variant="secondary">
                {t.banner.refuse}
              </Button>
              <Button onClick={handleCustomize} variant="tertiary">
                {t.banner.customize}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// Composant contenu de la modale de consentement (sans la modale elle-même)
export function CookieConsentModalContent({ onAcceptAll, onRefuseAll, onSavePreferences, consent }: CookieConsentModalContentProps) {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const t = translations[currentLang as keyof typeof translations] || translations.fr;

  const [localConsent, setLocalConsent] = useState(consent);

  // Synchroniser localConsent avec consent quand il change
  useEffect(() => {
    setLocalConsent(consent);
  }, [consent]);

  const handleSave = () => {
    onSavePreferences(localConsent);
  };

  const handleAcceptAll = () => {
    onAcceptAll();
  };

  const handleRefuseAll = () => {
    onRefuseAll();
  };

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <Text>{t.modal.description}</Text>

          <div className="cookie-categories">
            <div className="cookie-category">
              <div className="cookie-category__header">
                <h4 className="cookie-category__header__title">{t.modal.necessary.title}</h4>
                <input type="checkbox" checked={true} disabled={true} className="cookie-category__header__toggle" />
              </div>
              <Text size="sm" as="span" className="cookie-category__description">
                {t.modal.necessary.description}
              </Text>
            </div>

            <div className="cookie-category">
              <div className="cookie-category__header">
                <h4 className="cookie-category__header__title">{t.modal.functional.title}</h4>
                <input
                  type="checkbox"
                  checked={localConsent.functional}
                  onChange={(e) => setLocalConsent({ ...localConsent, functional: e.target.checked })}
                  className="cookie-category__header__toggle"
                />
              </div>
              <Text size="sm" as="span" className="cookie-category__description">
                {t.modal.functional.description}
              </Text>
            </div>

            <div className="cookie-category">
              <div className="cookie-category__header">
                <h4 className="cookie-category__header__title">{t.modal.analytics.title}</h4>
                <input
                  type="checkbox"
                  checked={localConsent.analytics}
                  onChange={(e) => setLocalConsent({ ...localConsent, analytics: e.target.checked })}
                  className="cookie-category__header__toggle"
                />
              </div>
              <Text size="sm" as="span" className="cookie-category__description">
                {t.modal.analytics.description}
              </Text>
            </div>
          </div>

          <div className="cookie-modal-actions">
            <Button onClick={handleSave} size="sm">
              {t.modal.save}
            </Button>
            <Button onClick={handleAcceptAll} size="sm" variant="secondary">
              {t.modal.acceptAll}
            </Button>
            <Button onClick={handleRefuseAll} size="sm" variant="secondary">
              {t.modal.refuse}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

// Composant principal
export default function CookieConsent() {
  const { showBanner, consent, acceptAll, refuseAll, savePreferences, resetConsent } = useCookieConsent();
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const t = translations[currentLang as keyof typeof translations] || translations.fr;

  // Mode debug - forcer l'affichage pour les tests (à supprimer en production)
  const isDebugMode = window.location.search.includes("debug-cookies");
  const shouldShowBanner = showBanner || isDebugMode;

  // Gestionnaire pour fermer la modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Gestionnaire pour accepter tous les cookies (depuis la modal)
  const handleAcceptAllFromModal = () => {
    acceptAll();
    setShowModal(false);
  };

  // Gestionnaire pour refuser tous les cookies (depuis la modal)
  const handleRefuseAllFromModal = () => {
    refuseAll();
    setShowModal(false);
  };

  // Gestionnaire pour sauvegarder les préférences
  const handleSavePreferences = (preferences: CookieCategories) => {
    savePreferences(preferences);
    setShowModal(false);
  };

  if (!shouldShowBanner) {
    return null;
  }

  return (
    <>
      {/* Bouton de debug pour réinitialiser les cookies */}
      {isDebugMode && (
        <button
          onClick={resetConsent}
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: 99999,
            background: "red",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          Reset Cookies
        </button>
      )}

      <CookieConsentBanner onAcceptAll={acceptAll} onRefuseAll={refuseAll} />

      <Modal isOpen={showModal} hide={handleCloseModal} size="lg">
        <ModalTitle>{t.modal.title}</ModalTitle>
        <ModalContent>
          <CookieConsentModalContent
            onAcceptAll={handleAcceptAllFromModal}
            onRefuseAll={handleRefuseAllFromModal}
            onSavePreferences={handleSavePreferences}
            consent={consent}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
