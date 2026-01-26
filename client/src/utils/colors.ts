export function getCssColor(variableName: string): string {
  const rootStyles = getComputedStyle(document.documentElement);

  // Détecte le thème actuel
  const isDarkTheme = document.documentElement.getAttribute("data-fr-theme") === "dark";

  // Construit le nom de la variable CSS en fonction du thème
  const cssVariableName = isDarkTheme ? `--${variableName}-dark` : `--${variableName}`;

  // Récupère et retourne la valeur de la variable CSS
  return rootStyles.getPropertyValue(cssVariableName).trim();
}
