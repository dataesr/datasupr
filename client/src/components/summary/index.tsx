import { useLocation, useSearchParams } from "react-router-dom";
import { useState } from "react";
import "./styles.scss";
import i18n from "./i18n.json";

export function SummaryWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  const getI18nLabel = (key: string) => {
    return i18n[key][currentLang];
  };

  return (
    <div className={`fr-summary-wrapper ${className || ""}`}>
      <button
        className="fr-summary__btn fr-btn fr-btn--secondary fr-btn--sm fr-hidden-lg"
        aria-controls="summary-collapse"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? getI18nLabel("hideSummary") : getI18nLabel("showSummary")}
      </button>
      <div className={`fr-summary-collapse ${isExpanded ? "fr-summary-collapse--expanded" : ""}`} id="summary-collapse">
        {children}
      </div>
    </div>
  );
}

export function Summary({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  const getI18nLabel = (key: string) => {
    return i18n[key][currentLang];
  };

  const summaryTitle = title || getI18nLabel("summary");

  return (
    <nav className={`fr-summary ${className || ""}`} role="navigation" aria-labelledby="fr-summary-title">
      <h2 className="fr-summary__title" id="fr-summary-title">
        {summaryTitle}
      </h2>
      <ol>{children}</ol>
    </nav>
  );
}

export function SubSummary({ children }: { children: React.ReactNode }) {
  return <ol>{children}</ol>;
}

export function SummaryItem({ href, label }: { href: string; label: string }) {
  const location = useLocation();
  const selected = location.hash === href;

  return (
    <li>
      <a className={`fr-summary__link${selected ? " selected" : ""}`} href={href}>
        {label}
      </a>
    </li>
  );
}
