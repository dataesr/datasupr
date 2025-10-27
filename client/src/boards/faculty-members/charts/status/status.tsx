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
            <th>Titulaires non-chercheurs</th>
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
  const [displayAsPercentage, setDisplayAsPercentage] = useState<boolean>(true);
  const [addedLabels, setAddedLabels] = useState<string[]>([]);

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
      return {
        fieldLabel:
          item._id.structure_name || item._id.field_name || item._id.geo_name,
        totalCount,
        nonTitulaires,
        titulairesNonChercheurs,
        enseignantsChercheurs,
        totalTitulaires: enseignantsChercheurs + titulairesNonChercheurs,
      };
    });
  }, [statusData]);

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

  const getContextLabel = (isPrefix = false) => {
    switch (context) {
      case "geo":
        return isPrefix ? "la région" : "région";
      case "fields":
        return isPrefix ? "la grande discipline" : "grande discipline";
      case "structures":
        return isPrefix ? "l'établissement" : "établissement";
      default:
        return "discipline";
    }
  };

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
        <Button
          size="sm"
          onClick={() => setDisplayAsPercentage(false)}
          variant={!displayAsPercentage ? undefined : "secondary"}
          className="fr-mr-2v"
        >
          Effectifs
        </Button>
        <Button
          size="sm"
          onClick={() => setDisplayAsPercentage(true)}
          variant={displayAsPercentage ? undefined : "secondary"}
          className="fr-mr-2v"
        >
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
                onSelect={(item) =>
                  onSelectStructure({ id: item.id, name: item.name })
                }
                disabledPredicate={(item) => displayedLabels.has(item.name)}
              />
            </div>
            {addedLabels.length > 0 && (
              <div className="fr-mt-2w">
                <div className="fr-text--sm fr-mb-1w">
                  Établissements ajoutés :
                </div>
                <div>
                  {addedLabels.map((label) => (
                    <DismissibleTag
                      color="blue-cumulus"
                      aria-label={`Retirer ${label}`}
                      onClick={() =>
                        setAddedLabels((prev) =>
                          prev.filter((l) => l !== label)
                        )
                      }
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
                Quelle est la répartition des statuts du personnel enseignant
                par {getContextLabel()} ?&nbsp;
                <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
              </>
            ),
          },
          comment: {
            fr: (
              <>
                Répartition par statut des{" "}
                <GlossaryTerm term="personnels enseignants">
                  personnels enseignants
                </GlossaryTerm>
                , distinguant notamment les{" "}
                <GlossaryTerm term="enseignant-chercheur">
                  enseignants-chercheurs
                </GlossaryTerm>
                , les titulaires non-chercheurs et les{" "}
                <GlossaryTerm term="permanent / non permanent">
                  non-permanents
                </GlossaryTerm>
                .
              </>
            ),
          },
          description: {
            fr: "",
          },
          readingKey: {
            fr: exampleItem ? (
              <>
                Par exemple, pour l'année universitaire {selectedYear} pour{" "}
                {getContextLabel(true)}{" "}
                <strong>{exampleItem.fieldLabel}</strong>, sur les{" "}
                <strong>
                  {exampleItem.totalCount.toLocaleString("fr-FR")}
                </strong>{" "}
                personnels enseignants,{" "}
                <strong>
                  {exampleItem.enseignantsChercheurs.toLocaleString("fr-FR")}
                </strong>{" "}
                sont enseignants-chercheurs et{" "}
                <strong>
                  {exampleItem.nonTitulaires.toLocaleString("fr-FR")}
                </strong>{" "}
                sont Non-permanents.
              </>
            ) : (
              <></>
            ),
          },
          source: {
            label: {
              fr: <>MESR-SIES, SISE</>,
              en: <>MESR-SIES, SISE</>,
            },
            url: {
              fr: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
              en: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
            },
          },
          updateDate: new Date(),
          integrationURL: generateIntegrationURL(context, "statuts"),
        }}
        options={chartOptions}
        legend={null}
        renderData={() => <RenderData data={processedData} />}
      />
    </>
  );
};

export default StatusDistribution;
