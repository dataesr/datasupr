import { useMemo } from "react";
import { useFinanceDefinitions } from "../../pages/definitions/api";
import "./styles.scss";

interface StatusIndicatorProps {
  status: "alerte" | "vigilance" | "normal";
  className?: string;
  indicateur?: string;
}

const STATUS_CONFIG = {
  alerte: {
    color: "var(--text-default-error)",
    label: "Alerte",
  },
  vigilance: {
    color: "var(--text-default-warning)",
    label: "Vigilance",
  },
  normal: {
    color: "var(--text-default-success)",
    label: "Normal",
  },
};

const MAX_CHARS = 200;

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
};

export default function StatusIndicator({
  status,
  className = "",
  indicateur,
}: StatusIndicatorProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.normal;
  const { data: definitions } = useFinanceDefinitions();
  const tooltipId = `tooltip-status-${indicateur}-${status}`;

  const interpretation = useMemo(() => {
    if (!definitions || !indicateur) return null;
    for (const category of definitions) {
      for (const subCategory of category.sousRubriques) {
        const def = subCategory.definitions.find(
          (d) => d.indicateur === indicateur
        );
        if (def?.interpretation) {
          return def.interpretation;
        }
      }
    }
    return null;
  }, [definitions, indicateur]);

  const displayText = interpretation
    ? `${config.label} : ${truncateText(interpretation, MAX_CHARS)}`
    : config.label;

  return (
    <>
      <button
        type="button"
        className={`fr-btn--tooltip fr-btn status-indicator ${className}`}
        aria-describedby={tooltipId}
      >
        <span
          className="status-indicator__dot"
          style={{ backgroundColor: config.color }}
          aria-hidden="true"
        />
      </button>
      <span
        className="fr-tooltip fr-placement"
        id={tooltipId}
        role="tooltip"
        aria-hidden="true"
      >
        {displayText}
      </span>
    </>
  );
}
