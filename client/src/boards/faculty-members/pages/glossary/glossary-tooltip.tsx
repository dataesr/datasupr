import React from "react";
import { glossary } from ".";
import { Link } from "@dataesr/dsfr-plus";

type GlossaryTooltipProps = {
  term: string;
  children?: React.ReactNode;
};

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const entry = glossary.find(
    (item) => item.key.toLowerCase() === term.toLowerCase()
  );
  if (!entry) return <>{children || term}</>;

  return (
    <span
      title={`${entry.title} : ${entry.definition} (Voir le glossaire)`}
      style={{
        borderBottom: "1px dotted #0072f3",
        cursor: "help",
        color: "#0053b3",
        fontWeight: 500,
        background: "rgba(0, 114, 243, 0.06)",
        padding: "0 2px",
      }}
    >
      {children || entry.title}
      <Link
        href="/personnel-enseignant/glossaire"
        style={{
          marginLeft: 4,
          fontSize: "0.9em",
          textDecoration: "underline dotted",
          color: "#0053b3",
        }}
        tabIndex={-1}
        aria-label={`Voir la définition de ${entry.title} dans le glossaire`}
        onClick={(e) => e.stopPropagation()}
      >
        <span aria-hidden="true" style={{ marginLeft: 2 }}>
          ℹ️
        </span>
      </Link>
    </span>
  );
}
