import React, { useRef, useEffect } from "react";
import { Modal, ModalTitle, ModalContent, Badge } from "@dataesr/dsfr-plus";
import { glossary } from "./definitions";

type GlossaryTermProps = {
  term: string;
  children?: React.ReactNode;
};

export function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const entry = glossary.find(
    (item) => item.key.toLowerCase() === term.toLowerCase()
  );
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!entry) return;
    const elementToScrollTo = itemRefs.current[entry.key.toLowerCase()];

    if (elementToScrollTo) {
      setTimeout(() => {
        elementToScrollTo.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  });

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

      <Modal isOpen id={modalId} size="lg" hide={handleHideModal}>
        <ModalTitle>
          Glossaire
          <Badge className="fr-ml-2w">{entry.title}</Badge>
        </ModalTitle>
        <ModalContent>
          <div className="fr-grid-row fr-grid-row--gutters">
            {glossary.map((item) => (
              <div
                className={`fr-col-12 fr-mb-2w ${
                  item.key.toLowerCase() === entry.key.toLowerCase()
                    ? "fr-background-alt--blue-france highlighted-glossary-card"
                    : "glossary-card"
                }`}
                key={item.key}
                ref={(el) => {
                  itemRefs.current[item.key.toLowerCase()] = el;
                }}
              >
                <div className="fr-card fr-enlarge-link fr-card--no-background fr-p-2w">
                  <div className="fr-card__body fr-p-0">
                    <div className="fr-card__content">
                      <h3 className="fr-card__title fr-text--md fr-mb-1w fr-text--bold">
                        {item.title}
                      </h3>
                      <p className="fr-card__desc fr-text--sm">
                        {item.definition}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
