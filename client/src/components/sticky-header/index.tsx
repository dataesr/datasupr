import { ReactNode } from "react";
import "./styles.scss";

interface StickyHeaderProps {
  title: string;
  subtitle?: string;
  badge?: {
    content: ReactNode;
    color?: "info" | "success" | "warning" | "error" | "new";
  };
  selector?: {
    label: string;
    options: (string | number)[];
    value: string | number;
    onChange: (value: string) => void;
  };
}

export default function StickyHeader({
  title,
  subtitle,
  badge,
  selector,
}: StickyHeaderProps) {
  return (
    <div className="sticky-header">
      <div className="sticky-header__content">
        {subtitle && (
          <p className="fr-text--lg fr-mb-0 sticky-header__subtitle">
            {subtitle}
          </p>
        )}
        <p className="fr-text--lg fr-mb-0 sticky-header__title">{title}</p>
      </div>
      {badge && (
        <span className={`fr-badge fr-badge--${badge.color || "info"}`}>
          {badge.content}
        </span>
      )}
      {selector && (
        <div className="sticky-header__selector">
          <span className="sticky-header__selector-label">
            {selector.label}
          </span>
          <select
            className="fr-select sticky-header__select"
            value={selector.value}
            onChange={(e) => selector.onChange(e.target.value)}
          >
            {selector.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
