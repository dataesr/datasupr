# OverviewV2 - Architecture des règles d'affichage

Cette refactorisation améliore la lisibilité et la maintenabilité des règles d'affichage qui sont **identiques** entre les 3 tabs, tout en permettant à chaque tab d'avoir son **contenu spécifique**.

## Principe architectural

- **Règles d'affichage communes** : Les mêmes conditions déterminent quoi afficher
- **Contenu différent par tab** : Chaque tab (Synthèse, Positionnement, Collaborations) affiche des données différentes selon ces règles

## Structure des fichiers

```
overviewV2/
├── index.tsx                           # Composant principal ultra-simplifié
├── components/
│   ├── TabsContent.tsx                 # Structure des tabs
│   ├── SmartTabContent.tsx            # Orchestrateur des règles + contenu
│   ├── examples/
│   │   └── SpecializedComponents.tsx  # Exemples de composants spécialisés
│   └── tabs/
│       ├── SyntheseContent.tsx        # Contenu spécifique tab Synthèse
│       ├── PositionnementContent.tsx  # Contenu spécifique tab Positionnement
│       └── CollaborationsContent.tsx  # Contenu spécifique tab Collaborations
├── utils/
│   └── displayRules.ts                # Logique centralisée des règles d'affichage
└── hooks/
    └── useOverviewParams.ts           # Hook personnalisé pour les paramètres d'URL
```

## Avantages de cette architecture

### 1. **Règles d'affichage centralisées**
- **Une seule source de vérité** pour déterminer quoi afficher
- Les mêmes conditions s'appliquent aux 3 tabs automatiquement
- Modification d'une règle impacte tous les tabs simultanément

### 2. **Contenu spécialisé par tab**
- Chaque tab a son propre composant de contenu
- `SyntheseContent` : graphiques, métriques de synthèse
- `PositionnementContent` : analyses concurrentielles, benchmarks
- `CollaborationsContent` : réseaux, partenariats

### 3. **Séparation des responsabilités**
- `SmartTabContent` : orchestration des règles + dispatch vers le bon contenu
- `displayRules.ts` : logique pure des conditions d'affichage
- `TabsContent` : structure HTML/CSS des onglets
- Composants de contenu : rendu spécialisé par domaine

### 4. **Lisibilité et maintenabilité**
- Composant principal de 15 lignes seulement
- Logique métier isolée et testable
- Ajout facile de nouveaux cas d'affichage
- Type Safety complet avec TypeScript

### 5. **Exemples et composants spécialisés**
- **Dossier `examples/`** : Modèles de composants réutilisables par domaine
- Composants spécialisés par tab et par cas d'usage
- Documentation d'utilisation intégrée dans les exemples

## Utilisation

### Composant principal ultra-simplifié
```tsx
// Avant (complexe, 80+ lignes)
{view === "pillar" && !pillarId && (
  <>
    <Title as="h2">Financements demandés & obtenus</Title>
    <PillarsFunding />
  </>
)}
// ... répété dans chaque tab avec des variations

// Après (simple, 15 lignes)
export default function OverviewV2() {
  const overviewParams = useOverviewParams();
  return (
    <>
      <Container as="main" className="fr-mt-4w fr-mb-3w">
        <EpNavigator />
      </Container>
      <Container as="section" fluid style={{ backgroundColor: "#f9f9f9" }} className="fr-py-1w">
        <Container as="main">
          <TabsContent overviewParams={overviewParams} />
        </Container>
      </Container>
    </>
  );
}
```

### Contenu spécialisé par tab
```tsx
// Dans SyntheseContent.tsx
case 'pillar-comparison':
  return (
    <div>
      <p>Synthèse - Graphiques de comparaison des piliers</p>
      <p>Tableaux de synthèse des financements</p>
    </div>
  );

// Dans PositionnementContent.tsx  
case 'pillar-comparison':
  return (
    <div>
      <p>Positionnement - Cartographie des piliers</p>
      <p>Analyse concurrentielle</p>
    </div>
  );
```

### Règles d'affichage centralisées
```tsx
// Dans displayRules.ts
export const displayRules = {
  isPillarComparison: (conditions: ViewConditions): boolean => 
    conditions.view === "pillar" && !conditions.pillarId,
  
  isPillarDetail: (conditions: ViewConditions): boolean => 
    conditions.view === "program" && !conditions.programId,
  // ...
};
```

### Hook personnalisé pour les paramètres
```tsx
// Dans useOverviewParams.ts
export function useOverviewParams(): ViewConditions {
  const [searchParams] = useSearchParams();
  return {
    view: searchParams.get("view") || "pillar",
    pillarId: searchParams.get("pillarId"),
    // ...
  };
}
```

### Composants spécialisés d'exemple
```tsx
// Dans examples/SpecializedComponents.tsx
export const SynthesePillarComparison = () => (
  <div>
    <h3>Graphique en barres - Financements par pilier</h3>
    <div>Tableau de bord KPI</div>
    <div>Évolution temporelle</div>
  </div>
);

// Utilisation dans SyntheseContent.tsx
import { SynthesePillarComparison } from '../examples/SpecializedComponents';

case 'pillar-comparison':
  return <SynthesePillarComparison />;
```

## Migration

Pour migrer d'autres composants similaires :

1. **Identifier les règles d'affichage répétitives**
2. **Extraire dans `displayRules.ts`**
3. **Créer un composant réutilisable**
4. **Remplacer la logique complexe par le nouveau composant**

## Extensibilité

### Ajouter de nouveaux cas d'affichage

1. **Ajouter une nouvelle condition dans `displayRules.ts`**
2. **Ajouter le type correspondant dans `ContentType`**
3. **Implémenter le rendu dans `SmartTabContent.tsx`**

La logique sera automatiquement disponible dans tous les tabs.

### Utiliser les composants d'exemple

1. **Importer depuis `examples/SpecializedComponents.tsx`**
2. **Adapter les props selon vos besoins**
3. **Intégrer dans vos composants de contenu**

```tsx
// Exemple d'intégration
import { SynthesePillarComparison } from '../examples/SpecializedComponents';

case 'pillar-comparison':
  return <SynthesePillarComparison />;
```

### Créer de nouveaux composants spécialisés

1. **Créer dans le dossier `examples/`** ou dans un dossier dédié
2. **Respecter la convention de nommage** : `[Tab][Cas]Content`
3. **Documenter l'utilisation** dans les commentaires
4. **Tester individuellement** chaque composant
