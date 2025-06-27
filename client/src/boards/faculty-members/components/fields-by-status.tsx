import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useContextDetection } from "../utils";
import DefaultSkeleton from "../../../components/charts-skeletons/default";
import { useStatusDistribution } from "../charts/status/use-status-distribution";

const FieldByStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId } = useContextDetection();

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
    if (!statusData || !statusData.status_distribution) return null;

    let enseignantsChercheurs = 0;
    let titulairesNonChercheurs = 0;
    let nonTitulaires = 0;
    let totalCount = 0;

    statusData.status_distribution.forEach((item) => {
      totalCount += item.total_count;

      item.status_breakdown?.forEach((status) => {
        switch (status.status) {
          case "enseignant_chercheur":
            enseignantsChercheurs += status.count;
            break;
          case "titulaire_non_chercheur":
            titulairesNonChercheurs += status.count;
            break;
          case "non_titulaire":
            nonTitulaires += status.count;
            break;
        }
      });
    });

    const totalTitulaires = enseignantsChercheurs + titulairesNonChercheurs;

    return {
      totalCount,
      totalTitulaires,
      enseignantsChercheurs,
      nonTitulaires,
      titulairesPercent:
        totalCount > 0 ? (totalTitulaires / totalCount) * 100 : 0,
      enseignantsChercheursPercent:
        totalCount > 0 ? (enseignantsChercheurs / totalCount) * 100 : 0,
      nonTitulairesPercent:
        totalCount > 0 ? (nonTitulaires / totalCount) * 100 : 0,
    };
  }, [statusData]);

  if (isLoading) {
    return (
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <DefaultSkeleton />
      </div>
    );
  }

  if (error || !processedData) {
    return (
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <span className="fr-text--sm">
          Aucune donnée de statut disponible pour l'année {selectedYear}
        </span>
      </div>
    );
  }

  const {
    totalCount,
    totalTitulaires,
    enseignantsChercheurs,
    nonTitulaires,
    titulairesPercent,
    enseignantsChercheursPercent,
    nonTitulairesPercent,
  } = processedData;

  const statusItems = [
    {
      label: "Titulaires",
      percent: Math.round(titulairesPercent || 0),
      count: totalTitulaires,
      color: "var(--blue-cumulus-sun-368)",
    },
    {
      label: "Enseignants-chercheurs",
      percent: Math.round(enseignantsChercheursPercent || 0),
      count: enseignantsChercheurs,
      color: "var(--pink-tuile-sun-425)",
    },
    {
      label: "Non titulaires",
      percent: Math.round(nonTitulairesPercent || 0),
      count: nonTitulaires,
      color: "var(--beige-gris-galet-sun-407)",
    },
  ].filter((item) => item.percent > 0);

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <div className="fr-text--sm">Résumé des statuts</div>
        <div className="fr-text--xs fr-text--grey">
          Année universitaire {selectedYear}
        </div>
      </div>

      {statusItems.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: "1rem",
            paddingBottom: "1rem",
            borderBottom:
              index < statusItems.length - 1 ? "1px solid #ddd" : "none",
          }}
        >
          <div className="fr-text--sm fr-text--bold">{item.label}</div>
          <div className="fr-text--xs fr-text--grey">
            {item.count.toLocaleString()} personnes
          </div>
          <div
            style={{
              height: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              overflow: "hidden",
              marginTop: "0.5rem",
            }}
          >
            <div
              style={{
                width: `${item.percent}%`,
                backgroundColor: item.color,
                height: "100%",
              }}
            ></div>
          </div>
        </div>
      ))}

      <div className="fr-text--xs fr-text--grey">
        Total: {totalCount.toLocaleString()} enseignants
      </div>
    </div>
  );
};

export default FieldByStatus;
