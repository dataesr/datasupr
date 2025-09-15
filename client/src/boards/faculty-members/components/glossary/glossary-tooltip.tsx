import React from "react";
import { Modal, ModalTitle, ModalContent, Link } from "@dataesr/dsfr-plus";
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

  const modalId = `glossary-modal-${entry.key.replace(/\s/g, "-")}`;
  const handleHideModal = () => {};

  return (
    <>
      <span
        title={`${entry.title} : ${
          entry.definition.split(".")[0]
        }... (Cliquer pour plus d'infos)`}
        style={{
          borderBottom: "1px dotted #0072f3",
          cursor: "help",
          color: "#0053b3",
          fontWeight: 500,
          padding: "0 2px",
        }}
      >
        {children || entry.title}
        <span
          aria-controls={modalId}
          data-fr-opened="false"
          role="button"
          tabIndex={0}
          aria-label={`Ouvrir la définition complète de ${entry.title}`}
          className="fr-icon-info-line fr-ml-1w"
          style={{
            cursor: "pointer",
            fontSize: "0.9em",
            verticalAlign: "middle",
            color: "var(--blue-france-sun-113-625)",
          }}
        >
          <span className="fr-sr-only">Définition</span>
        </span>
      </span>

      <Modal isOpen id={modalId} size="md" hide={handleHideModal}>
        <ModalTitle>{entry.title}</ModalTitle>
        <ModalContent>
          <p className="fr-text--sm">{entry.definition}</p>
          <div className="fr-mt-1w text-center">
            <Link href="/personnel-enseignant/glossaire" className="fr-link">
              <span
                className="fr-icon-information-line fr-mr-1w"
                aria-hidden="true"
                style={{ fontSize: "1.1em" }}
              />
              Glossaire des termes
            </Link>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
