import { glossary } from "./definitions";

type GlossaryTermProps = {
  term: string;
  children?: React.ReactNode;
};

export function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const entry = glossary.find(
    (item) => item.key.toLowerCase() === term.toLowerCase()
  );

  if (!entry) {
    return <>{children || term}</>;
  }
  const tooltipId = `tooltip-${entry.key.replace(/\s/g, "-")}`;
  return (
    <>
      <span
        className="fr-tooltip__container"
        style={{ display: "inline-block" }}
      >
        <span
          aria-describedby={tooltipId}
          style={{
            borderBottom: "1px dotted #0072f3",
            cursor: "help",
            color: "#0053b3",
            fontWeight: 500,
            padding: "0 2px",
          }}
        >
          {children || entry.title}
        </span>
        <span
          className="fr-tooltip fr-placement"
          id={tooltipId}
          role="tooltip"
          aria-hidden="true"
        >
          {entry.definition}
        </span>
      </span>
    </>
  );
}
