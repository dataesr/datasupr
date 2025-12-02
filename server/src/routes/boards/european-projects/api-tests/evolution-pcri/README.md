# Routes Evolution PCRI

Ce fichier contient les routes pour récupérer les données d'évolution des PCRI (Programmes-Cadres de Recherche et d'Innovation) depuis la collection MongoDB `european-projects_evolution_staging`.

## Structure des données

Les données contiennent les informations suivantes :
- `call_year` : Année de l'appel
- `framework` : Programme-cadre (FP6, FP7, Horizon 2020, Horizon Europe)
- `country_name_fr` : Nom du pays en français
- `country_code` : Code du pays (ISO)
- `stage` : Stade (successful, evaluated)
- `number_involved` : Nombre d'entités impliquées
- `coordination_number` : Nombre de coordinations
- `funding` : Financement en euros
- `project_number` : Nombre de projets
- `share_number_involved` : Part du nombre d'entités impliquées
- `share_coordination_number` : Part du nombre de coordinations
- `share_funding` : Part du financement
- `share_project_number` : Part du nombre de projets

## Routes disponibles

### 1. GET /api/european-projects/evolution-pcri/get-evolution-by-country

Récupère l'évolution des PCRI pour un pays donné.

**Paramètres requis :**
- `country_code` : Code du pays (ex: FRA, DEU, ESP)

**Paramètres optionnels :**
- `frameworks` : Liste des frameworks séparés par `|` (ex: `Horizon 2020|Horizon Europe`)
- `stages` : Liste des stages séparés par `|` (ex: `successful|evaluated`)
- `call_years` : Liste des années séparées par `|` (ex: `2020|2021|2022`)

**Exemple :**
```
GET /api/european-projects/evolution-pcri/get-evolution-by-country?country_code=FRA&frameworks=Horizon%202020&stages=successful
```

### 2. GET /api/european-projects/evolution-pcri/get-evolution-global

Récupère l'évolution globale (tous pays confondus).

**Paramètres optionnels :**
- `frameworks` : Liste des frameworks séparés par `|`
- `stages` : Liste des stages séparés par `|`
- `call_years` : Liste des années séparées par `|`

**Exemple :**
```
GET /api/european-projects/evolution-pcri/get-evolution-global?frameworks=Horizon%202020|Horizon%20Europe&stages=successful
```

### 3. GET /api/european-projects/evolution-pcri/get-evolution-by-framework

Récupère l'évolution agrégée par framework.

**Paramètres optionnels :**
- `country_code` : Code du pays pour filtrer
- `stages` : Liste des stages séparés par `|`

**Retour :**
Les données sont agrégées par framework, call_year et stage avec les totaux suivants :
- `total_funding` : Total du financement
- `total_projects` : Total des projets
- `total_involved` : Total des entités impliquées
- `total_coordination` : Total des coordinations

**Exemple :**
```
GET /api/european-projects/evolution-pcri/get-evolution-by-framework?country_code=FRA&stages=successful
```

### 4. GET /api/european-projects/evolution-pcri/get-evolution-by-country_indexes

Crée ou recrée l'index pour optimiser les performances de la requête `get-evolution-by-country`.

**Index créé :**
- Nom : `idx_evolution_by_country`
- Champs : `country_code`, `framework`, `stage`, `call_year`

**Exemple :**
```
GET /api/european-projects/evolution-pcri/get-evolution-by-country_indexes
```

## Tests

Les tests API se trouvent dans le répertoire `/api-tests/evolution-pcri/` :
- `get-evolution-by-country.http` : Tests pour la route get-evolution-by-country
- `get-evolution-global.http` : Tests pour la route get-evolution-global
- `get-evolution-by-framework.http` : Tests pour la route get-evolution-by-framework
- `get-evolution-indexes.http` : Tests pour la création d'index
- `all-tests.http` : Tous les tests regroupés

## Utilisation

Pour utiliser ces routes, assurez-vous que :
1. Le serveur Node.js est démarré
2. La collection MongoDB `european-projects_evolution_staging` contient des données
3. Les routes sont correctement importées dans le fichier `index.js` du module european-projects

## Optimisation

Pour de meilleures performances, exécutez d'abord la route de création d'index :
```
GET /api/european-projects/evolution-pcri/get-evolution-by-country_indexes
```

Cela créera un index composite sur les champs fréquemment utilisés dans les filtres.
