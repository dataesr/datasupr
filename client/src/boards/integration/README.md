# Système d'intégration de graphiques

## 📋 Vue d'ensemble

Ce système permet de partager et d'intégrer facilement des graphiques Highcharts dans d'autres applications ou sites web via des iframes ou des URLs directes.

## 🚀 Utilisation

### URL de base
```
http://localhost:5173/integration?chart_id=<ID_DU_GRAPHIQUE>
```

### Exemple d'intégration
```html
<iframe 
  src="http://localhost:5173/integration?chart_id=ep-countries-collaborations-bubble&theme=light" 
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>
```

## 🔧 Paramètres disponibles

| Paramètre | Type | Description | Valeurs | Défaut |
|-----------|------|-------------|---------|--------|
| `chart_id` | requis | Identifiant du graphique à afficher | Voir registre | - |
| `theme` | optionnel | Thème de l'interface | `light`, `dark` | `light` |
| `language` | optionnel | Langue (si supportée par le graphique) | `fr`, `en` | `fr` |

## 📦 Ajouter un nouveau graphique

### 1. Ouvrir le registre
Éditez le fichier `client/src/boards/integration/charts-registry.tsx`

### 2. Ajouter votre graphique
```typescript
export const chartsRegistry = {
  // Graphiques existants
  "ep-countries-collaborations-bubble": lazy(
    () => import("../european-projects/pages/collaborations/charts/countries-collaborations-bubble")
  ),
  
  // Ajoutez votre nouveau graphique ici
  "mon-nouveau-graph": lazy(
    () => import("../chemin/vers/mon-graphique")
  ),
};
```

### 3. Conventions de nommage
- Utilisez des IDs courts et descriptifs
- Format recommandé : `<module>-<description>` (ex: `ep-countries-bubble`, `atlas-world-map`)
- Utilisez des tirets `-` pour séparer les mots
- Évitez les caractères spéciaux

### 4. Exemples d'IDs
```
ep-countries-collaborations-bubble   ✅ Bon
atlas-france-regions                 ✅ Bon
teds-evolution-timeline              ✅ Bon

european-projects/pages/...          ❌ Trop long
countries_bubble                     ❌ Underscore
pays-collaborations                  ❌ Pas en anglais
```

## 🏗️ Architecture

### Structure des fichiers
```
client/src/boards/integration/
├── index.tsx              # Point d'entrée, gère le routing et l'affichage
├── template.tsx           # Page d'accueil avec la liste des graphiques
├── charts-registry.tsx    # Registre central des graphiques disponibles
└── README.md             # Cette documentation
```

### Flux de fonctionnement

1. **Requête** : L'utilisateur accède à `/integration?chart_id=mon-graph`
2. **Validation** : Le système vérifie si `mon-graph` existe dans le registre
3. **Chargement** : Le composant est chargé dynamiquement (lazy loading)
4. **Affichage** : Le graphique est affiché avec ses propres paramètres

## 🎨 Thèmes

Le paramètre `theme` modifie l'attribut `data-fr-theme` du document HTML, ce qui permet d'appliquer automatiquement le thème DSFR approprié.

```javascript
// Thème clair (défaut)
?theme=light

// Thème sombre
?theme=dark
```

## 🔍 Exemple complet

### Graphique avec tous les paramètres
```
http://localhost:5173/integration?chart_id=ep-countries-collaborations-bubble&theme=dark&language=en
```

### Intégration dans une page HTML
```html
<!DOCTYPE html>
<html>
<head>
  <title>Ma page avec graphique intégré</title>
</head>
<body>
  <h1>Statistiques de collaborations</h1>
  
  <iframe 
    src="http://localhost:5173/integration?chart_id=ep-countries-collaborations-bubble" 
    width="100%" 
    height="600" 
    frameborder="0"
    title="Collaborations entre pays">
  </iframe>
</body>
</html>
```

## 🐛 Dépannage

### Le graphique ne s'affiche pas
1. Vérifiez que l'ID est correct dans le registre
2. Vérifiez que le chemin d'import est valide
3. Ouvrez la console du navigateur pour voir les erreurs

### Erreur "Graphique non trouvé"
- L'ID fourni n'existe pas dans `charts-registry.tsx`
- Vérifiez l'orthographe exacte de l'ID

### Le composant ne se charge pas
- Vérifiez que le chemin d'import dans le registre est correct
- Assurez-vous que le composant exporté est bien un `default export`

## 📝 Notes importantes

- **Lazy loading** : Les graphiques sont chargés à la demande pour optimiser les performances
- **Type-safe** : Le système utilise TypeScript pour garantir la validité des IDs
- **Évolutif** : Ajoutez autant de graphiques que nécessaire dans le registre
- **Isolation** : Chaque graphique garde ses propres dépendances et état

## 🚦 Checklist avant de partager un graphique

- [ ] Le graphique est ajouté au registre
- [ ] L'ID est court et descriptif
- [ ] Le chemin d'import est correct
- [ ] Le composant s'affiche correctement en local
- [ ] Les paramètres URL sont documentés
- [ ] Le graphique fonctionne en thème clair ET sombre
