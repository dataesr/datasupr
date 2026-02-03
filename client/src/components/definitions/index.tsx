interface Definition {
  indicateur: string;
  libelle: string;
  definition: string;
  interpretation?: string;
  source: string;
  unite: string;
  pageDefinition?: boolean;
  opendata1?: string | null;
  opendata2?: string | null;
  opendata3?: string | null;
  opendata4?: string | null;
}

interface DefinitionCategory {
  rubrique: string;
  sousRubriques: {
    nom: string;
    definitions: Definition[];
    interpretation?: string;
  }[];
}

interface DefinitionsProps {
  data: DefinitionCategory[];
  className?: string;
}

export default function Definitions({
  data,
  className = "",
}: DefinitionsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune définition disponible pour le moment.</p>
      </div>
    );
  }

  const renderOpendataLinks = (def: Definition) => {
    const links = [
      def.opendata1,
      def.opendata2,
      def.opendata3,
      def.opendata4,
    ].filter(Boolean);

    if (links.length === 0) return null;

    return (
      <div className="fr-mt-1w">
        <strong className="fr-text--sm">Sources de données ouvertes :</strong>
        <div className="fr-mt-1v">
          {links.map((link, index) => (
            <a
              key={index}
              href={link!}
              target="_blank"
              rel="noopener noreferrer"
              className="fr-link fr-link--sm fr-mr-2w"
              title="Accéder aux données ouvertes"
            >
              <span
                className="fr-icon-external-link-line fr-icon--sm fr-mr-1v"
                aria-hidden="true"
              />
              Données {index + 1}
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {data.map((category, categoryIndex) => (
        <div key={`category-${categoryIndex}`} className="fr-mb-8w">
          <h2 className="fr-h2 fr-mb-3w">{category.rubrique}</h2>
          {category.sousRubriques
            .filter((sousRubrique) => sousRubrique.definitions.length > 0)
            .map((sousRubrique, sousIndex) => (
              <div
                key={`sous-${categoryIndex}-${sousIndex}`}
                className="fr-mb-6w"
              >
                <h3 className="fr-h4 fr-mb-2w">{sousRubrique.nom}</h3>
                <div className="fr-table fr-table--bordered">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Indicateur</th>
                        <th scope="col">Définition</th>
                        <th scope="col">Unité</th>
                        <th scope="col">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sousRubrique.definitions
                        .filter(
                          (def) =>
                            def.pageDefinition !== false &&
                            def.definition &&
                            def.definition.trim() !== ""
                        )
                        .map((def, defIndex) => (
                          <tr
                            key={`def-${categoryIndex}-${sousIndex}-${defIndex}`}
                          >
                            <td>
                              <strong>{def.libelle}</strong>
                              <br />
                              <code className="fr-text--xs">
                                {def.indicateur}
                              </code>
                            </td>
                            <td>
                              {def.definition}
                              {def.interpretation && (
                                <>
                                  <br />
                                  <br />
                                  <strong>Interprétation :</strong>{" "}
                                  {def.interpretation}
                                </>
                              )}
                              {renderOpendataLinks(def)}
                            </td>
                            <td className="fr-text--center">{def.unite}</td>
                            <td className="fr-text--xs">{def.source}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
