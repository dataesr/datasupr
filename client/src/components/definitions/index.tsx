interface Definition {
  indicateur: string;
  libelle: string;
  definition: string;
  source: string;
  unite: string;
}

interface DefinitionCategory {
  rubrique: string;
  sousRubriques: {
    nom: string;
    definitions: Definition[];
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
                            def.definition && def.definition.trim() !== ""
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
                            <td>{def.definition}</td>
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
