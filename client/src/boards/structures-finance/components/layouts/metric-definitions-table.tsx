import { useMemo, useState } from "react";
import "./metric-definitions-table.scss";
import { Title } from "@dataesr/dsfr-plus";
import { useFinanceDefinitions } from "../../pages/definitions/api";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { parseMarkdown } from "../../../../utils/format";

interface MetricDefinitionsTableProps {
  metricKeys: string[];
}

export default function MetricDefinitionsTable({
  metricKeys,
}: MetricDefinitionsTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: definitions, isLoading } = useFinanceDefinitions();
  const relevantDefinitions = useMemo(() => {
    if (!definitions || !metricKeys) return [];

    const result: Array<{
      indicateur: string;
      libelle: string;
      definition: string;
      interpretation: string;
      source: string;
      unite: string;
    }> = [];

    for (const category of definitions) {
      for (const sousRubrique of category.sousRubriques) {
        for (const def of sousRubrique.definitions) {
          if (metricKeys.includes(def.indicateur)) {
            result.push(def);
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

              {def.source && def.source !== "-" && (
                <div className="definition-footer">
                  <span className="fr-icon-database-line" aria-hidden="true" />
                  <span className="source-text">{def.source}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
