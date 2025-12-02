# Graphiques d'évolution PCRI

Ce répertoire contient 6 composants graphiques pour l'analyse de l'évolution des programmes cadres européens (FP6, FP7, Horizon 2020, Horizon Europe).

## Vue d'ensemble des composants

### 1. **funding-stacked-area** - Graphique en aire empilée
**Objectif** : Vision globale de la croissance du financement par framework au fil du temps

**Type de graphique** : Area chart (aires empilées)

**Données visualisées** :
- X : Années (call_year)
- Y : Financement total (en M€)
- Séries : Une couleur par framework (FP6, FP7, H2020, HE)

**Clé de lecture** : Met en évidence la croissance globale du financement et la contribution de chaque framework

**Utilisation** : Premier graphique pour avoir une vue d'ensemble de l'évolution budgétaire

---

### 2. **success-rate-evolution** - Taux de succès temporel
**Objectif** : Comprendre l'évolution de la compétition à travers les frameworks

**Type de graphique** : Line chart (lignes multiples)

**Données visualisées** :
- X : Années
- Y : Taux de succès (% de projets successful / evaluated)
- Séries : Une ligne par framework avec couleurs différenciées

**Clé de lecture** : Permet d'identifier si la compétition s'intensifie ou se détend au fil du temps

**Utilisation** : Analyse de la difficulté à obtenir un financement selon les périodes

---

### 3. **countries-heatmap** - Heatmap pays/frameworks
**Objectif** : Identifier les tendances par pays à travers les frameworks successifs

**Type de graphique** : Heatmap

**Données visualisées** :
- X : Frameworks (FP6, FP7, H2020, HE)
- Y : Top 15 pays (triés par financement total)
- Couleur : Part du financement (share_funding en %)

**Clé de lecture** : Révèle les pays montants/descendants et les changements de dynamique

**Utilisation** : Identification des tendances géographiques et des pays émergents

---

### 4. **countries-ranking** - Bump chart du classement
**Objectif** : Narratif "qui monte, qui descend" - évolution du classement des pays

**Type de graphique** : Line chart (bump chart)

**Données visualisées** :
- X : Frameworks
- Y : Position au classement (1 à 10)
- Lignes : Un pays = une ligne qui monte/descend

**Clé de lecture** : Met en évidence les progressions et régressions relatives des pays

**Utilisation** : Storytelling sur les dynamiques de compétition entre pays

---

### 5. **efficiency-scatter** - Scatter performance
**Objectif** : Analyse stratégique qualité vs quantité

**Type de graphique** : Bubble chart (scatter avec bulles)

**Données visualisées** :
- X : Taux de succès (%)
- Y : Part du financement total (%)
- Taille bulle : Nombre de projets réussis
- Top 20 pays par financement

**Clé de lecture** : Identifie les pays "performants" (haut taux + forte part) vs "actifs mais inefficaces"

**Utilisation** : Analyse comparative de l'efficacité des pays

---

### 6. **funding-by-country** - Financement par pays (original)
**Objectif** : Évolution du financement pour un pays spécifique

**Type de graphique** : Column chart

**Données visualisées** :
- X : Années
- Y : Financement (en M€)
- Couleur : Par framework

**Clé de lecture** : Évolution détaillée année par année pour un pays

**Utilisation** : Vue détaillée avec paramètre `country_code` dans l'URL

---

## Structure des fichiers

Chaque composant suit la même structure :

```
component-name/
├── index.tsx          # Composant React principal avec ChartWrapper
├── options.tsx        # Configuration Highcharts
├── query.tsx          # Appel API
├── utils.tsx          # Fonctions utilitaires + readingKey
├── types.ts           # Types TypeScript
└── i18n.json          # Traductions FR/EN
```

## API utilisée

Tous les composants utilisent la même route API :
```
GET /boards/european-projects/evolution-pcri/get-evolution-by-country
```

**Paramètres** :
- `stages` : evaluated, successful ou les deux séparés par **pipe `|`** (ex: `stages=evaluated|successful`)
- `country_code` : Code pays ISO (optionnel, par défaut retourne tous les pays)
- `frameworks` : Filtrer par frameworks séparés par pipe (optionnel)
- `call_years` : Filtrer par années séparées par pipe (optionnel)

**⚠️ Important** : 
- Le backend utilise le séparateur **`|`** (pipe) pour les listes, pas la virgule `,`
- Le paramètre `country_code` est **optionnel**. Si omis, retourne tous les pays.
- Utiliser `country_code=ALL` pour obtenir explicitement les totaux globaux

**Exemples d'appels** :
```
# Tous les pays, projets successful uniquement
?stages=successful

# Tous les pays, evaluated ET successful
?stages=evaluated|successful

# France uniquement, projets successful
?stages=successful&country_code=FRA

# Totaux globaux explicites
?stages=successful&country_code=ALL
```

## Optimisation des performances

### Problème de volume de données
Sans filtre `country_code`, la requête retourne **~1030 lignes** (tous les pays × tous les frameworks × toutes les années), ce qui ralentit considérablement le chargement.

### Solutions implémentées par graphique

#### Graphiques utilisant les totaux globaux
Ces graphiques utilisent `country_code=ALL` pour ne récupérer que **24 lignes** :
- **funding-stacked-area** : Évolution globale du financement
- **success-rate-evolution** : Taux de succès global

#### Graphiques comparant les pays
Ces graphiques chargent tous les pays (~1030 lignes) puis filtrent côté frontend :
- **countries-heatmap** : Filtre aux top 15 pays
- **countries-ranking** : Filtre aux top 10 pays
- **efficiency-scatter** : Filtre aux top 20 pays

### Exemple de volumes
```bash
# Sans filtre : ~1030 lignes
GET ?stages=successful

# Avec country_code=ALL : 24 lignes
GET ?stages=successful&country_code=ALL

# Avec country_code=FRA : ~20 lignes
GET ?stages=successful&country_code=FRA
```

---



Les couleurs sont centralisées dans `/client/src/boards/styles.scss` :

```scss
--framework-fp6-color: #28a745;           // Vert
--framework-fp7-color: #5cb85c;           // Vert clair
--framework-horizon2020-color: #dc3545;   // Rouge
--framework-horizoneurope-color: #ffc107; // Orange/jaune
```

## Ordre d'affichage dans l'index

1. **FundingStackedArea** - Vue d'ensemble globale
2. **SuccessRateEvolution** - Compétition
3. **CountriesHeatmap** - Tendances géographiques
4. **CountriesRanking** - Classement dynamique
5. **EfficiencyScatter** - Performance comparative
6. **FundingByCountry** - Détail par pays (avec paramètre)

## Internationalisation

Tous les composants supportent le français et l'anglais via le paramètre URL `?language=fr` ou `?language=en`.

## Notes techniques

### Dépendances Highcharts
- `countries-heatmap` nécessite le module `highcharts/modules/heatmap`
- `efficiency-scatter` utilise le type `bubble`

### Calculs spécifiques
- **Taux de succès** : `(successful / evaluated) * 100`
- **Part de financement** : Utilise directement `share_funding` de l'API
- **Classement** : Tri décroissant par `funding` pour chaque framework

### Performance
- Les heatmaps limitent aux top 15 pays
- Les scatter plots limitent aux top 20 pays
- Les bump charts limitent aux top 10 pays
