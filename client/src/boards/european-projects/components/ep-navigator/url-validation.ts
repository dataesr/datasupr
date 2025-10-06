/**
 * Utilitaires pour la validation et la reconstruction des paramètres d'URL
 * selon les règles de navigation hiérarchique du navigateur de projets européens
 */

export interface UrlParams {
  view?: string | null;
  pillarId?: string | null;
  programId?: string | null;
  thematicIds?: string | null;
  destinationIds?: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  correctedParams: UrlParams;
  errors: string[];
}

/**
 * Valide et corrige les paramètres d'URL selon les règles hiérarchiques
 */
export function validateAndCorrectUrlParams(params: UrlParams): ValidationResult {
  const errors: string[] = [];
  let correctedParams = { ...params };

  // Règles de validation selon la vue
  switch (params.view) {
    case 'pillar':
      // Si view=pillar : soit pas de pillarId, soit que pillarId et pas programId, thematicIds, destinationIds
      if (params.pillarId) {
        if (params.programId || params.thematicIds || params.destinationIds) {
          errors.push('En vue pillar avec pillarId, programId, thematicIds et destinationIds doivent être vides');
          correctedParams = {
            ...correctedParams,
            programId: null,
            thematicIds: null,
            destinationIds: null
          };
        }
      } else {
        // Pas de pillarId : tous les autres paramètres doivent être vides
        if (params.programId || params.thematicIds || params.destinationIds) {
          errors.push('En vue pillar sans pillarId, tous les autres paramètres doivent être vides');
          correctedParams = {
            ...correctedParams,
            programId: null,
            thematicIds: null,
            destinationIds: null
          };
        }
      }
      break;

    case 'program':
      // Si view=program : doit obligatoirement avoir pillarId et soit pas de programId, 
      // soit programId et pas thematicIds et pas destinationIds
      if (!params.pillarId) {
        errors.push('En vue program, pillarId est obligatoire');
        // On ne peut pas corriger automatiquement un pillarId manquant
        return {
          isValid: false,
          correctedParams: params,
          errors
        };
      }
      
      if (params.programId) {
        if (params.thematicIds || params.destinationIds) {
          errors.push('En vue program avec programId, thematicIds et destinationIds doivent être vides');
          correctedParams = {
            ...correctedParams,
            thematicIds: null,
            destinationIds: null
          };
        }
      } else {
        // Pas de programId : thematicIds et destinationIds doivent être vides
        if (params.thematicIds || params.destinationIds) {
          errors.push('En vue program sans programId, thematicIds et destinationIds doivent être vides');
          correctedParams = {
            ...correctedParams,
            thematicIds: null,
            destinationIds: null
          };
        }
      }
      break;

    case 'thematic':
      // Si view=thematic : doit avoir pillarId et programId, et soit pas de thematicIds,
      // soit thematicIds et pas destinationIds
      if (!params.pillarId) {
        errors.push('En vue thematic, pillarId est obligatoire');
        return {
          isValid: false,
          correctedParams: params,
          errors
        };
      }
      
      if (!params.programId) {
        errors.push('En vue thematic, programId est obligatoire');
        return {
          isValid: false,
          correctedParams: params,
          errors
        };
      }

      if (params.thematicIds) {
        if (params.destinationIds) {
          errors.push('En vue thematic avec thematicIds, destinationIds doit être vide');
          correctedParams = {
            ...correctedParams,
            destinationIds: null
          };
        }
      } else {
        // Pas de thematicIds : destinationIds doit être vide
        if (params.destinationIds) {
          errors.push('En vue thematic sans thematicIds, destinationIds doit être vide');
          correctedParams = {
            ...correctedParams,
            destinationIds: null
          };
        }
      }
      break;

    case 'destination':
      // Si view=destination : doit avoir pillarId, programId et thematicIds
      if (!params.pillarId) {
        errors.push('En vue destination, pillarId est obligatoire');
        return {
          isValid: false,
          correctedParams: params,
          errors
        };
      }
      
      if (!params.programId) {
        errors.push('En vue destination, programId est obligatoire');
        return {
          isValid: false,
          correctedParams: params,
          errors
        };
      }

      if (!params.thematicIds) {
        errors.push('En vue destination, thematicIds est obligatoire');
        return {
          isValid: false,
          correctedParams: params,
          errors
        };
      }
      // destinationIds peut être présent ou non
      break;

    default:
      // Vue non reconnue ou absente : retourner à l'état par défaut (pillar)
      if (params.view !== 'pillar') {
        errors.push(`Vue "${params.view}" non reconnue, correction vers vue pillar`);
        correctedParams = {
          ...correctedParams,
          view: 'pillar'
        };
      }
      
      // Appliquer les règles de la vue pillar
      if (params.pillarId) {
        if (params.programId || params.thematicIds || params.destinationIds) {
          errors.push('En vue par défaut avec pillarId, les autres paramètres doivent être vides');
          correctedParams = {
            ...correctedParams,
            programId: null,
            thematicIds: null,
            destinationIds: null
          };
        }
      } else {
        if (params.programId || params.thematicIds || params.destinationIds) {
          errors.push('En vue par défaut sans pillarId, tous les paramètres doivent être vides');
          correctedParams = {
            ...correctedParams,
            programId: null,
            thematicIds: null,
            destinationIds: null
          };
        }
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    correctedParams,
    errors
  };
}

/**
 * Détermine la vue appropriée selon les paramètres présents
 */
export function inferViewFromParams(params: UrlParams): string {
  if (params.destinationIds && params.thematicIds && params.programId && params.pillarId) {
    return 'destination';
  }
  
  if (params.thematicIds && params.programId && params.pillarId) {
    return 'thematic';
  }
  
  if (params.programId && params.pillarId) {
    return 'program';
  }
  
  if (params.pillarId) {
    return 'pillar';
  }
  
  return 'pillar'; // Vue par défaut
}

/**
 * Nettoie les paramètres en supprimant ceux qui sont null ou undefined
 */
export function cleanParams(params: UrlParams): Record<string, string> {
  const cleanedParams: Record<string, string> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      cleanedParams[key] = value;
    }
  });
  
  return cleanedParams;
}

/**
 * Corrige automatiquement l'URL en supprimant les paramètres incohérents
 * et en ajustant la vue si nécessaire
 */
export function autoCorrectUrl(params: UrlParams): UrlParams {
  const validation = validateAndCorrectUrlParams(params);
  
  if (!validation.isValid) {
    // Si la validation échoue complètement (paramètres obligatoires manquants),
    // essayer d'inférer une vue correcte
    const inferredView = inferViewFromParams(params);
    const correctedWithInferredView = {
      ...validation.correctedParams,
      view: inferredView
    };
    
    // Re-valider avec la vue inférée
    const revalidation = validateAndCorrectUrlParams(correctedWithInferredView);
    return revalidation.correctedParams;
  }
  
  return validation.correctedParams;
}
