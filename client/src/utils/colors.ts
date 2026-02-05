export function getCssColor(variableName: string): string {
  const rootStyles = getComputedStyle(document.documentElement);

  // Détecte le thème actuel
  const isDarkTheme = document.documentElement.getAttribute("data-fr-theme") === "dark";

  // En thème dark, teste si la variable avec le suffixe "-dark" existe
  if (isDarkTheme) {
    const darkVariableName = `--${variableName}-dark`;
    const darkValue = rootStyles.getPropertyValue(darkVariableName).trim();
    if (darkValue) {
      return darkValue;
    }
  }

  // Récupère et retourne la variable CSS sans le suffixe "dark"
  return rootStyles.getPropertyValue(`--${variableName}`).trim();
}
