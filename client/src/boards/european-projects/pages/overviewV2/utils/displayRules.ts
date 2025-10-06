// Types pour les conditions d'affichage
export interface ViewConditions {
  view: string;
  pillarId: string | null;
  programId: string | null;
  thematicIds: string | null;
  destinationIds: string | null;
}

// Fonctions pour vérifier les conditions d'affichage
export const displayRules = {
  // Comparatif des piliers
  isPillarComparison: (conditions: ViewConditions): boolean => 
    conditions.view === "pillar" && !conditions.pillarId,

  // Détail d'un pilier
  isPillarDetail: (conditions: ViewConditions): boolean => 
    conditions.view === "program" && !conditions.programId,

  // Détail d'un programme
  isProgramDetail: (conditions: ViewConditions): boolean => 
    conditions.view === "thematic" && !conditions.thematicIds,

  // Détail des thématiques sélectionnées
  isThematicDetail: (conditions: ViewConditions): boolean => 
    conditions.view === "destination" && !!conditions.thematicIds && !conditions.destinationIds,

  // Détail des destinations sélectionnées
  isDestinationDetail: (conditions: ViewConditions): boolean => 
    conditions.view === "destination" && !!conditions.destinationIds,
};

// Types pour les différents contenus possibles
export type ContentType = 
  | 'pillar-comparison'
  | 'pillar-detail'
  | 'program-detail'
  | 'thematic-detail'
  | 'destination-detail'
  | null;

// Fonction pour déterminer le type de contenu à afficher
export function getContentType(conditions: ViewConditions): ContentType {
  if (displayRules.isPillarComparison(conditions)) return 'pillar-comparison';
  if (displayRules.isPillarDetail(conditions)) return 'pillar-detail';
  if (displayRules.isProgramDetail(conditions)) return 'program-detail';
  if (displayRules.isThematicDetail(conditions)) return 'thematic-detail';
  if (displayRules.isDestinationDetail(conditions)) return 'destination-detail';
  return null;
}