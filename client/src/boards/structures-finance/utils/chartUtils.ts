// Fonction qui vient de Yann
/**
 * Calcule un tickInterval optimal pour éviter les valeurs répétées sur l'axe Y
 * @param dataMin - Valeur minimale des données
 * @param dataMax - Valeur maximale des données
 * @param format - Format des données (number, percent, decimal, euro)
 * @returns Le tickInterval optimal ou undefined si aucun ajustement n'est nécessaire
 */
export function calculateOptimalTickInterval(
  dataMin: number,
  dataMax: number,
  format: "number" | "percent" | "decimal" | "euro"
): number | undefined {
  const range = dataMax - dataMin;

  // Si la plage est nulle ou très petite, on ne définit pas de tickInterval
  if (range === 0) {
    return undefined;
  }

  // Pour les pourcentages avec une petite plage
  if (format === "percent") {
    if (range < 0.5) {
      // < 0.5% : intervalles de 0.1%
      return 0.1;
    } else if (range < 2) {
      // < 2% : intervalles de 0.5%
      return 0.5;
    } else if (range < 5) {
      // < 5% : intervalles de 1%
      return 1;
    } else if (range < 10) {
      // < 10% : intervalles de 2%
      return 2;
    } else if (range < 20) {
      // < 20% : intervalles de 5%
      return 5;
    } else if (range < 50) {
      // < 50% : intervalles de 10%
      return 10;
    }
    // Sinon laisser Highcharts décider
    return undefined;
  }

  // Pour les nombres décimaux
  if (format === "decimal") {
    if (range < 1) {
      return 0.2;
    } else if (range < 5) {
      return 1;
    } else if (range < 10) {
      return 2;
    } else if (range < 50) {
      return 10;
    }
    return undefined;
  }

  // Pour les euros et nombres entiers
  if (format === "euro" || format === "number") {
    const magnitude = Math.pow(10, Math.floor(Math.log10(range)));

    if (range < magnitude * 2) {
      return magnitude / 5;
    } else if (range < magnitude * 5) {
      return magnitude;
    } else {
      return magnitude * 2;
    }
  }

  return undefined;
}
