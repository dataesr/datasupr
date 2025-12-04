import { useSearchParams } from "react-router-dom";

import { Link } from "@dataesr/dsfr-plus";

import i18n from "./i18n.json";

interface LocalizedContent {
  fr: JSX.Element;
  en?: JSX.Element;
}

interface LocalizedUrl {
  fr: string;
  en?: string;
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
 *     fr: <div>Ce graphique montre l'évolution des données sur 5 ans</div>
 *   }}
 *   // 'en' est maintenant optionnel
 * />
 * ```
 */
export default function ChartFooter({
  comment,
  readingKey,
  source,
  updateDate,
}: ChartFooterProps) {
  const [searchParams] = useSearchParams();
  const currentLang = (searchParams.get("language") || "fr") as "fr" | "en";

  function getI18nLabel(key: string) {
    return i18n[key][currentLang];
  }

  if (!comment && !readingKey && !source && !updateDate) {
    return null;
  }

  return (
    <div className="chart-footer">
      {comment && (
        <>
          <b>{getI18nLabel("comment")} </b>
          {comment[currentLang] || comment.fr}
        </>
      )}

      {readingKey && (
        <div>
          <b>{getI18nLabel("readingKey")} </b>
          {readingKey[currentLang] || readingKey.fr}
        </div>
      )}

      {(source || updateDate) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #ccc",
            marginTop: "10px",
            paddingTop: "10px",
          }}
        >
          {source && (
            <div>
              <b>{getI18nLabel("source")} </b>
              <Link href={source.url[currentLang] || source.url.fr} target="_blank" rel="noopener noreferrer">
                {source.label[currentLang] || source.label.fr}
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
