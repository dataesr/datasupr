# Gestion des consentements des cookies - TABLEAUX

Ce système de gestion des cookies respecte le RGPD et la loi Informatique et Libertés en permettant aux utilisateurs de contrôler précisément quels types de cookies ils autorisent.

## 🍪 Types de cookies

### Cookies nécessaires (toujours activés)

- Cookies de session
- Cookies de sécurité CSRF
- Cookies de préférences linguistiques
- Cookie de consentement lui-même

### Cookies fonctionnels (optionnels)

- **Filtres des projets européens** : `selectedPillars`, `selectedPrograms`, `selectedThematics`, `selectedDestinations`
- Sauvegardent les préférences de l'utilisateur pour une meilleure expérience

### Cookies analytiques (optionnels, non encore implémentés)

- Futurs cookies pour l'analyse d'audience anonymisée
- Google Analytics, Matomo, etc.

## 🔧 Utilisation pour les développeurs

### Hook de consentement principal

```tsx
import { useCookieConsent } from "./hooks/useCookieConsent";

function MyComponent() {
  const { consent, acceptAll, refuseAll, showBanner } = useCookieConsent();

  // consent.functional indique si les cookies fonctionnels sont autorisés
  // showBanner indique s'il faut afficher la bannière
}
```

### Hook pour les filtres avec consentement

```tsx
import { useConsentedFilter } from "./hooks/useConsentedFilter";

function FiltersComponent() {
  const { value, setValue, canPersist } = useConsentedFilter(
    "selectedPillars",
    []
  );

  // value : valeur actuelle du filtre
  // setValue : fonction pour mettre à jour le filtre
  // canPersist : indique si le filtre peut être sauvegardé (consentement donné)
}
```

### Utilitaires pour les cookies

```tsx
import {
  hasConsentFor,
  setConsentedCookie,
  getConsentedCookie,
} from "./utils/cookieUtils";

// Vérifier si l'utilisateur a consenti à une catégorie
if (hasConsentFor("functional")) {
  // Utiliser les cookies fonctionnels
}

// Définir un cookie avec vérification du consentement
setConsentedCookie("myFilter", "value", { expires: 30 }, "functional");

// Récupérer un cookie avec vérification du consentement
const value = getConsentedCookie("myFilter", "functional");
```

### Composant d'information sur le statut des cookies

```tsx
import CookieStatusInfo from "./components/cookie-status-info";

function FilterPage() {
  return (
    <div>
      <CookieStatusInfo />
      {/* Vos filtres ici */}
    </div>
  );
}
```

## 🎨 Interface utilisateur

### Bannière de consentement

- Apparaît automatiquement lors de la première visite
- Proposer trois actions : "Tout accepter", "Tout refuser", "Personnaliser"
- Se positionne en bas de l'écran

### Modal de configuration

- Accessible via le bouton "Personnaliser" ou depuis la page cookies
- Permet de configurer chaque catégorie individuellement
- Les cookies nécessaires ne peuvent pas être désactivés

### Page dédiée

- Accessible via `/cookies`
- Documentation complète sur l'utilisation des cookies
- Bouton pour modifier les préférences à tout moment

## 🔄 Migration des cookies existants

Les cookies de filtres existants dans les projets européens sont automatiquement nettoyés si l'utilisateur refuse les cookies fonctionnels.

### Avant (sans consentement)

```tsx
import Cookies from "js-cookie";

// Direct, sans vérification
Cookies.set("selectedPillars", JSON.stringify(pillars));
const pillars = Cookies.get("selectedPillars");
```

### Après (avec consentement)

```tsx
import { setConsentedCookie, getConsentedCookie } from "./utils/cookieUtils";

// Avec vérification automatique du consentement
setConsentedCookie(
  "selectedPillars",
  JSON.stringify(pillars),
  { expires: 30 },
  "functional"
);
const pillars = getConsentedCookie("selectedPillars", "functional");
```

## 📱 Responsivité

Le système est entièrement responsive :

- Bannière adaptée aux petits écrans
- Modal optimisée pour mobile
- Boutons et textes adaptés

## ⚖️ Conformité légale

- **RGPD** : Consentement explicite et granulaire
- **Loi Informatique et Libertés** : Information claire et contrôle utilisateur
- **ePrivacy** : Consentement préalable pour les cookies non nécessaires

## 🔧 Configuration

Le système peut être configuré via les constantes dans `useCookieConsent.tsx` :

- `COOKIE_CONSENT_NAME` : Nom du cookie de consentement
- `COOKIE_CONSENT_VERSION` : Version (permet de redemander le consentement)
- Durée de conservation : 1 an par défaut

## 🌍 Internationalisation

Tous les textes sont traduits en français et anglais via les fichiers i18n.json.
