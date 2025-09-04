# Migration du composant CookieConsentModal

## Changements effectués

### Avant
Le composant `CookieConsentModal` gérait à la fois :
- La structure de la modale (ouverture/fermeture)
- Le contenu et la logique des préférences de cookies

### Après
**Nouveau composant : `CookieConsentModalContent`**
- Gère uniquement le contenu et la logique des préférences de cookies
- Ne gère plus l'état de la modale (ouverture/fermeture)

**Responsabilité des composants parents :**
- Gèrent maintenant la modale DSFR directement
- Utilisent `CookieConsentModalContent` à l'intérieur de `ModalContent`

## Pattern d'utilisation

### Ancien pattern
```tsx
import { CookieConsentModal } from "../cookie-consent/index";

// Dans le composant
<CookieConsentModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onAcceptAll={acceptAll}
  onRefuseAll={refuseAll}
  onSavePreferences={savePreferences}
  consent={consent}
/>
```

### Nouveau pattern
```tsx
import { CookieConsentModalContent } from "../cookie-consent/index";
import { Modal, ModalContent, ModalTitle } from "@dataesr/dsfr-plus";

// Gestionnaires d'événements avec fermeture de modale
const handleAcceptAllFromModal = () => {
  acceptAll();
  setIsModalOpen(false);
};

const handleRefuseAllFromModal = () => {
  refuseAll();
  setIsModalOpen(false);
};

const handleSavePreferences = (preferences) => {
  savePreferences(preferences);
  setIsModalOpen(false);
};

// Dans le rendu
<Modal isOpen={isModalOpen} hide={() => setIsModalOpen(false)} size="lg">
  <ModalTitle>Paramètres des cookies</ModalTitle>
  <ModalContent>
    <CookieConsentModalContent
      onAcceptAll={handleAcceptAllFromModal}
      onRefuseAll={handleRefuseAllFromModal}
      onSavePreferences={handleSavePreferences}
      consent={consent}
    />
  </ModalContent>
</Modal>
```

## Avantages de cette approche

1. **Séparation des responsabilités** : La gestion de la modale est séparée du contenu
2. **Réutilisabilité** : Le contenu peut être utilisé dans différents types de modales
3. **Flexibilité** : Les composants parents ont plus de contrôle sur le comportement de la modale
4. **Conformité DSFR** : Utilisation directe des composants modaux DSFR
5. **Résolution des conflits** : Évite les conflits d'ouverture/fermeture entre composants

## Fichiers modifiés

- `/components/cookies/cookie-consent/index.tsx` : Transformation de `CookieConsentModal` en `CookieConsentModalContent`
- `/components/cookies/cookie-policy-page/index.tsx` : Mise à jour pour utiliser le nouveau pattern

## Interface du nouveau composant

```tsx
interface CookieConsentModalContentProps {
  onAcceptAll: () => void;
  onRefuseAll: () => void;
  onSavePreferences: (preferences: CookieCategories) => void;
  consent: CookieCategories;
}
```

Note : Les props `isOpen` et `onClose` ont été supprimées car elles sont maintenant gérées par le composant parent via la modale DSFR.
