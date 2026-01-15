import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StatusOptions from "./options";
import ChartWrapper from "../../../../components/chart-wrapper";
import { useContextDetection, generateIntegrationURL } from "../../utils";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { useStatusDistribution } from "./use-status-distribution";
import { Button, DismissibleTag } from "@dataesr/dsfr-plus";
import SubtitleWithContext from "../../components/subtitle-with-context";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";
import { SearchBar as FacultySearchBar } from "../../components/search-bar";
import { useDataCompleteness } from "../../api/useDataCompleteness";

function RenderData({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div className="fr-table--sm fr-table fr-table--bordered fr-mt-3w">
      <table className="fr-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Effectif total</th>
            <th>Non-permanents</th>
            <th>Enseignant du Secondaire Affecté dans le Supérieur</th>
            <th>Enseignants-chercheurs</th>
            <th>Total titulaires</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.fieldLabel || "Inconnu"}</td>
              <td>{item.totalCount.toLocaleString("fr-FR")}</td>
              <td>{item.nonTitulaires.toLocaleString("fr-FR")}</td>
              <td>{item.titulairesNonChercheurs.toLocaleString("fr-FR")}</td>
              <td>{item.enseignantsChercheurs.toLocaleString("fr-FR")}</td>
              <td>{item.totalTitulaires.toLocaleString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const StatusDistribution: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId, contextName } = useContextDetection();
  const [displayAsPercentage, setDisplayAsPercentage] =
    useState<boolean>(false);
  const [addedLabels, setAddedLabels] = useState<string[]>([]);
  const { hasNonPermanentStaff } = useDataCompleteness();

  const {
    data: statusData,
    isLoading,
    error,
  } = useStatusDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const processedData = useMemo(() => {
    if (!statusData || !statusData.status_distribution) return [];

    return statusData.status_distribution.map((item) => {
      const totalCount = item.total_count;
      let enseignantsChercheurs = 0;
      let titulairesNonChercheurs = 0;
      let nonTitulaires = 0;

      item.status_breakdown?.forEach((status) => {
        switch (status.status) {
          case "enseignant_chercheur":
            enseignantsChercheurs = status.count;
            break;
          case "titulaire_non_chercheur":
            titulairesNonChercheurs = status.count;
            break;
          case "non_titulaire":
            nonTitulaires = status.count;
            break;
        }
      });
      let fieldLabel, itemId, itemType;

      if (context === "fields") {
        fieldLabel = item._id.field_name;
        itemId = item._id.field_code;
        itemType = "fields" as const;
      } else if (context === "geo") {
        fieldLabel = item._id.geo_name;
        itemId = item._id.geo_code;
        itemType = "geo" as const;
      } else {
        fieldLabel = item._id.structure_name;
        itemId = item._id.structure_code;
        itemType = "structures" as const;
      }

      return {
        fieldLabel,
        itemId,
        itemType,
        totalCount,
        nonTitulaires,
        titulairesNonChercheurs,
        enseignantsChercheurs,
        totalTitulaires: enseignantsChercheurs + titulairesNonChercheurs,
      };
    });
  }, [statusData, context]);

  const exampleItem = useMemo(() => {
    if (!processedData || processedData.length === 0) {
      return null;
    }
    return processedData[0];
  }, [processedData]);

  const chartData = useMemo(() => {
    return processedData.map((item) => ({
      ...item,
      series: [
        {
          name: "Non-permanents",
          value: item.nonTitulaires,
          color: "var(--blue-ecume-moon-675)",
        },
        {
          name: "Titulaires ",
          value: item.titulairesNonChercheurs,
          color: "var(--green-bourgeon-main-640)",
        },
        {
          name: "Enseignants-chercheurs",
          value: item.enseignantsChercheurs,
          color: "var(--orange-terre-battue-main-645)",
        },
      ],
    }));
  }, [processedData]);

  const chartOptions = StatusOptions({
    disciplines: chartData,
    displayAsPercentage: displayAsPercentage,
    alwaysIncludeLabels: addedLabels,
  });

  const baseTopLabels = useMemo(() => {
    return [...processedData]
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, 10)
      .map((d) => d.fieldLabel);
  }, [processedData]);

  const displayedLabels = useMemo(() => {
    return new Set<string>([...baseTopLabels, ...addedLabels]);
  }, [baseTopLabels, addedLabels]);

  const onSelectStructure = (item: { id: string; name: string }) => {
    const selected = { id: item.id, lib: item.name };
    if (!selected) return;

    const existsInData = processedData.some(
      (d) => d.fieldLabel === selected.lib
    );
    if (existsInData && !addedLabels.includes(selected.lib)) {
      setAddedLabels((prev) => [...prev, selected.lib]);
    }
  };

  const getContextLabel = (isPrefix = false, itemId?: string) => {
    switch (context) {
      case "geo":
        if (itemId && itemId.toString().startsWith("A")) {
          return isPrefix ? "l'académie" : "académie";
        }
        return isPrefix ? "la région" : "région";
      case "fields":
        return isPrefix ? "la grande discipline" : "grande discipline";
      case "structures":
        return isPrefix ? "l'établissement" : "établissement";
      default:
        return "discipline";
    }
  };

  const getContextLabelWithName = () => {
    if (!contextId || !contextName) {
      return getContextLabel();
    }

    switch (context) {
      case "geo": {
        const lowerName = contextName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (
          lowerName.startsWith("region") ||
          contextName.toLowerCase().startsWith("région")
        ) {
          const regionName = contextName.replace(/^Région\s+/i, "");
          return `dans la région ${regionName}`;
        }
        if (
          lowerName.startsWith("academie") ||
          contextName.toLowerCase().startsWith("académie")
        ) {
          const academyName = contextName.replace(/^Académie\s+/i, "");
          return `dans l'académie ${academyName}`;
        }
        if (contextName.toLowerCase().includes("académie")) {
          return `Académie ${contextName}`;
        }
        return `Région ${contextName}`;
      }

      case "structures": {
        const lowerStructureName = contextName.toLowerCase();
        if (
          lowerStructureName.includes("université") ||
          lowerStructureName.includes("universite")
        ) {
          return `à ${contextName}`;
        }
        if (
          lowerStructureName.includes("école") ||
          lowerStructureName.includes("ecole")
        ) {
          return `à l'${contextName}`;
        }
        if (lowerStructureName.includes("institut")) {
          return `à l'${contextName}`;
        }
        return `à ${contextName}`;
      }

      case "fields":
        return `en ${contextName}`;

      default:
        return contextName;
    }
  };

  const contextLabelForTitle = getContextLabelWithName();

  const getContextLabelForPrefix = () => {
    if (!contextId || !contextName) {
      return getContextLabel(true);
    }

    switch (context) {
      case "geo": {
        const lowerName = contextName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (
          lowerName.startsWith("region") ||
          contextName.toLowerCase().startsWith("région")
        ) {
          const regionName = contextName.replace(/^Région\s+/i, "");
          return `la région ${regionName}`;
        }
        if (
          lowerName.startsWith("academie") ||
          contextName.toLowerCase().startsWith("académie")
        ) {
          const academyName = contextName.replace(/^Académie\s+/i, "");
          return `l'académie ${academyName}`;
        }
        return `la région ${contextName}`;
      }

      case "structures": {
        const lowerStructureName = contextName.toLowerCase();
        if (
          lowerStructureName.includes("université") ||
          lowerStructureName.includes("universite")
        ) {
          return contextName;
        }
        if (
          lowerStructureName.includes("école") ||
          lowerStructureName.includes("ecole")
        ) {
          return `l'${contextName}`;
        }
        if (lowerStructureName.includes("institut")) {
          return `l'${contextName}`;
        }
        return contextName;
      }

      case "fields":
        return `la grande discipline ${contextName}`;

      default:
        return contextName;
    }
  };

  const contextLabelForPrefix = getContextLabelForPrefix();

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        <DefaultSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-text--center fr-py-3w fr-text--red">
        Erreur lors du chargement des données par statut
      </div>
    );
  }

  if (!statusData || processedData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour les statuts pour l'année {selectedYear}
        {contextId &&
          ` et ${
            contextName === "discipline"
              ? "la"
              : contextName === "région"
              ? "la"
              : "l'"
          } ${contextName} sélectionnée`}
      </div>
    );
  }

  return (
    <>
      <div className="fr-mb-2w fr-flex fr-flex--center">
        <Button size="sm" onClick={() => setDisplayAsPercentage(false)} variant={!displayAsPercentage ? undefined : "secondary"} className="fr-mr-2v">
          Effectifs
        </Button>
        <Button size="sm" onClick={() => setDisplayAsPercentage(true)} variant={displayAsPercentage ? undefined : "secondary"} className="fr-mr-2v">
          Pourcentage
        </Button>
      </div>
      {context === "structures" && !contextId && (
        <div className="fr-mb-2w">
          <div className="text-right">
            <div style={{ minWidth: 420, display: "inline-block" }}>
              <FacultySearchBar
                mode="select"
                allowedTypes={["univ"]}
                placeholder="Ajouter un établissement dans le graphique"
                onSelect={(item) => onSelectStructure({ id: item.id, name: item.name })}
                disabledPredicate={(item) => displayedLabels.has(item.name)}
              />
            </div>
            {addedLabels.length > 0 && (
              <div className="fr-mt-2w">
                <div className="fr-text--sm fr-mb-1w">Établissements ajoutés :</div>
                <div>
                  {addedLabels.map((label) => (
                    <DismissibleTag
                      color="blue-cumulus"
                      aria-label={`Retirer ${label}`}
                      onClick={() => setAddedLabels((prev) => prev.filter((l) => l !== label))}
                    >
                      {label}
                    </DismissibleTag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {context === "geo" && !contextId && (
        <div className="fr-mb-2w">
          <div className="text-right">
            <div style={{ minWidth: 420, display: "inline-block" }}>
              <FacultySearchBar
                mode="select"
                allowedTypes={["region"]}
                placeholder="Ajouter une région dans le graphique"
                onSelect={(item) => onSelectStructure({ id: item.id, name: item.name })}
                disabledPredicate={(item) => displayedLabels.has(item.name)}
              />
            </div>
            {addedLabels.length > 0 && (
              <div className="fr-mt-2w">
                <div className="fr-text--sm fr-mb-1w">Régions ajoutées :</div>
                <div>
                  {addedLabels.map((label) => (
                    <DismissibleTag
                      color="blue-cumulus"
                      aria-label={`Retirer ${label}`}
                      onClick={() => setAddedLabels((prev) => prev.filter((l) => l !== label))}
                    >
                      {label}
                    </DismissibleTag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ChartWrapper
        config={{
          id: "statusDistribution",
          idQuery: "status-distribution",
          title: {
            className: "fr-mt-0w",
            look: "h5",
            as: "h2",
            fr: (
              <>
                {hasNonPermanentStaff
                  ? `Quelle est la répartition des statuts du personnel enseignant ${
                      contextLabelForTitle.startsWith("dans") || contextLabelForTitle.startsWith("à") || contextLabelForTitle.startsWith("en")
                        ? contextLabelForTitle
                        : `par ${contextLabelForTitle}`
                    } ?`
                  : `Quelle est la répartition des statuts des enseignants permanents ${
                      contextLabelForTitle.startsWith("dans") || contextLabelForTitle.startsWith("à") || contextLabelForTitle.startsWith("en")
                        ? contextLabelForTitle
                        : `par ${contextLabelForTitle}`
                    } ?`}
                &nbsp;
                <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
              </>
            ),
          },
          comment: {
            fr: (
              <>
                Répartition par statut des{" "}
                {hasNonPermanentStaff ? (
                  <GlossaryTerm term="personnels enseignants">personnels enseignants</GlossaryTerm>
                ) : (
                  <GlossaryTerm term="enseignants permanents">enseignants permanents</GlossaryTerm>
                )}
                , distinguant notamment les <GlossaryTerm term="enseignant-chercheur">enseignants-chercheurs</GlossaryTerm>
                {hasNonPermanentStaff && (
                  <>
                    , les enseignants du secondaire affectés dans le supérieur et les{" "}
                    <GlossaryTerm term="permanent / non permanent">non-permanents</GlossaryTerm>
                  </>
                )}
                {!hasNonPermanentStaff && " et les Enseignant du Secondaire Affecté dans le Supérieur"}.
                {!hasNonPermanentStaff && (
                  <>
                    <br />
                    <strong>Note :</strong> Les données présentées ne concernent que les enseignants permanents. Les données relatives aux enseignants
                    non-permanents ne sont pas disponibles pour cette période.
                  </>
                )}
              </>
            ),
          },
          description: {
            fr: "",
          },
          readingKey: {
            fr: exampleItem ? (
              <>
                {displayAsPercentage ? (
                  <>
                    Pour l'année universitaire {selectedYear} pour {contextId ? contextLabelForPrefix : getContextLabel(true, exampleItem.itemId)}{" "}
                    {!contextId && <strong>"{exampleItem.fieldLabel}"</strong>}, la répartition des{" "}
                    {hasNonPermanentStaff ? "personnels enseignants" : "enseignants permanents"} par statut est la suivante :{" "}
                    <strong>{((exampleItem.enseignantsChercheurs / exampleItem.totalCount) * 100).toFixed(1)}%</strong> sont des
                    enseignants-chercheurs
                    {hasNonPermanentStaff && (
                      <>
                        {" et "}
                        <strong>{((exampleItem.nonTitulaires / exampleItem.totalCount) * 100).toFixed(1)}%</strong> sont des non-permanents
                      </>
                    )}
                    .
                  </>
                ) : (
                  <>
                    Pour l'année universitaire {selectedYear} pour {contextId ? contextLabelForPrefix : getContextLabel(true, exampleItem.itemId)}{" "}
                    {!contextId && (
                      <>
                        <strong>"{exampleItem.fieldLabel}"</strong>, on dénombre{" "}
                      </>
                    )}
                    {contextId && ", on dénombre "}
                    <strong>{exampleItem.totalCount.toLocaleString("fr-FR")}</strong>{" "}
                    {hasNonPermanentStaff ? "personnels enseignants" : "enseignants permanents"}, dont{" "}
                    <strong>{exampleItem.enseignantsChercheurs.toLocaleString("fr-FR")}</strong> enseignants-chercheurs
                    {hasNonPermanentStaff && (
                      <>
                        {" et "}
                        <strong>{exampleItem.nonTitulaires.toLocaleString("fr-FR")}</strong> non-permanents
                      </>
                    )}
                    .
                  </>
                )}
              </>
            ) : (
              <></>
            ),
          },
          sources: [{
            label: {
              fr: <>MESR-SIES, SISE</>,
              en: <>MESR-SIES, SISE</>,
            },
            update: new Date(),
            url: {
              fr: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
              en: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
            },
          }],
          integrationURL: generateIntegrationURL(context, "statuts"),
        }}
        options={chartOptions}
        renderData={() => <RenderData data={processedData} />}
      />
    </>
  );
};

export default StatusDistribution;
