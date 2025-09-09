import { useSearchParams } from "react-router-dom";

import { Link } from "@dataesr/dsfr-plus";

import i18n from "./i18n.json";

interface LocalizedContent {
  fr: JSX.Element;
  en: JSX.Element;
}

interface LocalizedUrl {
  fr: string;
  en: string;
}

interface Source {
  label: LocalizedContent;
  url: LocalizedUrl;
}

interface ChartFooterProps {
  comment?: LocalizedContent;
  readingKey?: LocalizedContent;
  source?: Source;
  updateDate?: Date;
}

/**
 * Composant ChartFooter - Affiche un pied de graphique avec commentaires, clé de lecture, source et date de mise à jour
 *
 * @example
 * ```tsx
 * <ChartFooter
 *   comment={{
 *     fr: <div>Ce graphique montre l'évolution des données sur 5 ans</div>,
 *     en: <div>This chart shows data evolution over 5 years</div>
 *   }}
 *   readingKey={{
 *     fr: <div>Chaque barre représente une année complète</div>,
 *     en: <div>Each bar represents a full year</div>
 *   }}
 *   source={{
 *     label: {
 *       fr: <div>Ministère de l'Enseignement Supérieur</div>,
 *       en: <div>Ministry of Higher Education</div>
 *     },
 *     url: {
 *       fr: "https://data.gouv.fr/dataset-fr",
 *       en: "https://data.gouv.fr/dataset-en"
 *     }
 *   }}
 *   updateDate={new Date('2024-09-08')}
 * />
 * ```
 */
export default function ChartFooter({ comment, readingKey, source, updateDate }: ChartFooterProps) {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  function getI18nLabel(key: string) {
    return i18n[key][currentLang];
  }

  // Si aucune prop n'est fournie, ne rien afficher
  if (!comment && !readingKey && !source && !updateDate) {
    return null;
  }

  return (
    <div className="chart-footer">
      {comment && (
        <>
          <b>{getI18nLabel("comment")} </b>
          <div>{comment[currentLang]}</div>
        </>
      )}

      {readingKey && (
        <div>
          <b>{getI18nLabel("readingKey")} </b>
          {readingKey[currentLang]}
        </div>
      )}

      {(source || updateDate) && (
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ccc", marginTop: "10px", paddingTop: "10px" }}>
          {source && (
            <div>
              <b>{getI18nLabel("source")} </b>
              <Link href={source.url[currentLang]} target="_blank" rel="noopener noreferrer">
                {source.label[currentLang]}
              </Link>
            </div>
          )}

          {updateDate && (
            <div>
              <b>{getI18nLabel("updateDate")} </b>
              {updateDate.toLocaleDateString(currentLang === "fr" ? "fr-FR" : "en-US")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
