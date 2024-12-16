import { getThemeFromHtmlNode } from "../../../utils";

export default function Source() {
  const theme = getThemeFromHtmlNode();
  
  return (
    <div
    className="source"
    style={{
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(`--bg-${theme}`),
    }}
    >
      <strong>source des données :</strong> MESR - DGESIP/DGRI - SIES : synthèse des effectifs d'étudiants inscrits dans les établissements et formations de l'enseignement supérieur français
    </div>
  );
} 