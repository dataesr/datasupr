import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { createAgeDistributionChartOptions } from "./options";
import {
  generateContextualTitle,
  generateIntegrationURL,
  useContextDetection,
} from "../../utils";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { useAgeDistribution } from "./use-age-distribution";
import ChartWrapper from "../../../../components/chart-wrapper";
import { Col, Title } from "@dataesr/dsfr-plus";
import "./styles.scss";
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
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="age-distribution-table">
              <thead>
                <tr>
                  <th>Tranche d'âge</th>
                  <th>Pourcentage</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.y}&nbsp;%</td>
                    <td>{item.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgeDistributionPieChart() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const { context, contextId, contextName } = useContextDetection();
  const { hasNonPermanentStaff } = useDataCompleteness();

  const {
    data: ageData,
    isLoading,
    error,
  } = useAgeDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const processedData = useMemo(() => {
    if (!ageData?.age_distribution) return null;

    const ageDistribution = ageData.age_distribution;

    let totalCount = 0;
    ageDistribution.forEach((ageData) => {
      if (ageData._id !== "Non précisé") {
        totalCount += ageData.count;
      }
    });

    const chartData = ageDistribution
      .filter((ageData) => ageData._id !== "Non précisé")
      .map((ageData) => ({
        name: ageData._id,
        y:
          totalCount > 0
            ? Math.round((ageData.count / totalCount) * 100 * 10) / 10
            : 0,
        count: ageData.count,
      }));

    const chartTitle = generateContextualTitle(
      "Répartition par âge",
      context,
      contextId,
      ageData,
      isLoading
    );

    return {
      chartData,
      title: chartTitle,
      totalCount,
      isSpecific: !!contextId,
      contextName: ageData.context_info?.name || contextName,
    };
  }, [ageData, contextId, context, contextName, isLoading]);

  const chartOptions = useMemo(() => {
    if (!processedData) return null;

    return createAgeDistributionChartOptions(processedData.chartData);
  }, [processedData]);

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
        Erreur lors du chargement des données par âge
      </div>
    );
  }

  if (!chartOptions || !processedData) {
    const getEmptyMessage = () => {
      let message = `Aucune donnée disponible pour la répartition par âge pour l'année ${selectedYear}`;

      if (contextId) {
        if (processedData?.contextName) {
          message += ` et ${processedData.contextName}`;
        } else {
          message += ` et ${
            contextName === "discipline"
              ? "la"
              : contextName === "région"
              ? "la"
              : "l'"
          } ${contextName} sélectionnée`;
        }
      }

      return message;
    };

    return <div className="fr-text--center fr-py-3w">{getEmptyMessage()}</div>;
  }

  return (
    <>
      <Col className="ageFigure">
        <Title as="h3" look="h5">
          {processedData.title}{" "}
        </Title>
        <ChartWrapper
          config={{
            id: "age-distribution-pie-chart",
            idQuery: "age-distribution",
            title: {
              fr: "",
            },
            comment: {
              fr: (
                <>
                  Les effectifs{" "}
                  {hasNonPermanentStaff
                    ? "du personnel enseignant"
                    : "des enseignants permanents"}{" "}
                  sont répartis par tranches d'âge.
                  {!hasNonPermanentStaff && (
                    <>
                      <br />
                      <strong>Note :</strong> Les données présentées ne
                      concernent que les enseignants permanents. Les données
                      relatives aux enseignants non-permanents ne sont pas
                      disponibles pour cette période.
                    </>
                  )}
                </>
              ),
            },
            source: {
              label: { fr: <>MESR-SIES, SISE</> },
              url: {
                fr: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
              },
            },
            updateDate: new Date(),
            integrationURL: generateIntegrationURL(context, "age-distribution"),
          }}
          legend={false}
          options={chartOptions}
          renderData={() => <RenderData data={processedData.chartData} />}
        />
      </Col>
    </>
  );
}
