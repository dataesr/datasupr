import { useFinanceDefinitions } from "../../boards/structures-finance/pages/definitions/api";
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
    color: "var(--green-tilleul-700)",
    label: "Vigilance",
  },
  normal: {
    color: "var(--text-default-success)",
    label: "Normal",
  },
};

export default function StatusIndicator({
  status,
  className = "",
  indicateur,
}: StatusIndicatorProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.normal;
  const { data: definitions } = useFinanceDefinitions();
  const tooltipId = `tooltip-status-${status}`;

  const getInterpretation = () => {
    if (!definitions || !indicateur) return config.label;
    for (const category of definitions) {
      for (const subCategory of category.sousRubriques) {
        const def = subCategory.definitions.find(
          (d: any) => d.indicateur === indicateur
        );
        if (def && (def as any).interpretation) {
          return (def as any).interpretation;
        }
      }
    }
    return config.label;
  };

  const displayText = getInterpretation();

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
