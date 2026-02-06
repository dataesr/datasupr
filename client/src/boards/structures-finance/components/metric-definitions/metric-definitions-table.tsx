import { useMemo, useState } from "react";
import "./metric-definitions-table.scss";
import { Title, Link } from "@dataesr/dsfr-plus";
import { useFinanceDefinitions } from "../../pages/definitions/api";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { parseMarkdown } from "../../../../utils/format";

interface MetricDefinitionsTableProps {
  metricKeys: string[];
}

export default function MetricDefinitionsTable({
  metricKeys,
}: MetricDefinitionsTableProps) {
  const [isOpen, setIsOpen] = useState(metricKeys.length < 3);
  const { data: definitions, isLoading } = useFinanceDefinitions();
  const relevantDefinitions = useMemo(() => {
    if (!definitions || !metricKeys) return [];

    const result: Array<{
      PageDefinition: boolean;
      calculfr: string;
      indicateur: string;
      libelle: string;
      definition: string;
      interpretation: string;
      source1fr?: string | null;
      opendata1?: string | null;
      source2fr?: string | null;
      opendata2?: string | null;
      source3fr?: string | null;
      opendata3?: string | null;
      source4fr?: string | null;
      opendata4?: string | null;
      unite: string;
    }> = [];

    for (const category of definitions) {
      for (const sousRubrique of category.sousRubriques) {
        for (const def of sousRubrique.definitions) {
          if (
            metricKeys.includes(def.indicateur) &&
            def.PageDefinition !== false
          ) {
            result.push({
              calculfr: def.calculfr,
              PageDefinition: def.PageDefinition,
              indicateur: def.indicateur,
              libelle: def.libelle,
              definition: def.definition,
              interpretation: def.interpretation,
              source1fr: def.source1fr,
              opendata1: def.opendata1,
              source2fr: def.source2fr,
              opendata2: def.opendata2,
              source3fr: def.source3fr,
              opendata3: def.opendata3,
              source4fr: def.source4fr,
              opendata4: def.opendata4,
              unite: def.unite,
            });
          }
        }
      }
    }

    return result;
  }, [definitions, metricKeys]);

  if (isLoading) {
    return (
      <div className="fr-mt-4w">
        <DefaultSkeleton height="120px" />
      </div>
    );
  }

  if (relevantDefinitions.length === 0) {
    return null;
  }

  const renderSourceLinks = (def: (typeof relevantDefinitions)[0]) => {
    const sources: Array<{ label: string; link: string | null }> = [
      { label: def.source1fr || "", link: def.opendata1 || null },
      { label: def.source2fr || "", link: def.opendata2 || null },
      { label: def.source3fr || "", link: def.opendata3 || null },
      { label: def.source4fr || "", link: def.opendata4 || null },
    ].filter((source) => source.label);

    if (sources.length === 0) return null;

    return (
      <div className="definition-footer">
        <span className="fr-icon-database-line" aria-hidden="true" />
        <div className="source-content fr-text--sm">
          {sources.map((source, index) => (
            <div key={index} className={index > 0 ? "fr-mt-1v" : ""}>
              <span className="source-text">{source.label}</span>
              {source.link && (
                <>
                  {" "}
                  <Link
                    href={source.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fr-link--sm"
                    title="Accéder aux données ouvertes"
                  >
                    (données ouvertes)
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="metric-definitions-table fr-mt-4w">
      <button
        className="definitions-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="definitions-toggle-content">
          <span
            className="fr-icon-information-line fr-icon--lg"
            aria-hidden="true"
          />
          <Title as="h4" look="h6" className="fr-mb-0">
            À propos des indicateurs
          </Title>
          <span className="definitions-count">
            {relevantDefinitions.length} indicateur
            {relevantDefinitions.length > 1 ? "s" : ""}
          </span>
        </div>
        <span
          className={`fr-icon-arrow-down-s-line toggle-icon ${isOpen ? "open" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="definitions-grid">
          {relevantDefinitions.map((def, index) => (
            <div key={`${def.indicateur}-${index}`} className="definition-card">
              <div className="definition-card-header">
                <Title as="h5" look="h6" className="definition-title">
                  {def.libelle}
                </Title>
                {def.unite && def.unite !== "-" && (
                  <span className="definition-unit">{def.unite}</span>
                )}
              </div>

              {def.definition && def.definition !== "-" && (
                <div className="definition-section">
                  <span
                    className="section-icon fr-icon-file-text-line"
                    aria-hidden="true"
                  />
                  <div className="section-content">
                    <strong className="section-label">Définition</strong>
                    <p
                      className="fr-mb-2w fr-text--sm"
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdown(def.definition),
                      }}
                    />
                  </div>
                </div>
              )}
              {def.calculfr && def.calculfr !== "-" && (
                <div className="definition-section">
                  <span
                    className="section-icon fr-icon-line-chart-fill"
                    aria-hidden="true"
                  />
                  <div className="section-content">
                    <strong className="section-label">Calcul</strong>
                    <p
                      className="fr-mb-2w fr-text--sm"
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdown(def.calculfr),
                      }}
                    />
                  </div>
                </div>
              )}

              {def.interpretation && def.interpretation !== "-" && (
                <div className="definition-section">
                  <span
                    className="section-icon fr-icon-lightbulb-line"
                    aria-hidden="true"
                  />
                  <div className="section-content">
                    <strong className="section-label">Interprétation</strong>
                    <p className="section-text">{def.interpretation}</p>
                  </div>
                </div>
              )}

              {renderSourceLinks(def)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
