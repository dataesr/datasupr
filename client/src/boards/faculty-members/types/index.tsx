// COUCOUCOUCOUCOUCOUCCOUCU$

/**
 * Props pour les sélecteurs d'années
 */
export interface YearSelectorProps {
  /** Liste des années disponibles */
  years: string[];
  /** Année actuellement sélectionnée */
  selectedYear: string;
  /** Fonction appelée lors du changement d'année */
  onYearChange: (year: string) => void;
}
