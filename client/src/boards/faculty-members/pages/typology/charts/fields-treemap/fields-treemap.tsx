import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useFacultyMembersCNU } from "../../../../api/use-cnu";
import { CreateChartOptions } from "../../../../components/creat-chart-options";
import { useContextDetection } from "../../../../utils";
import { createTreemapOptions } from "./options";
import { Notice, Row, Text } from "@dataesr/dsfr-plus";
import SubtitleWithContext from "../../../../components/subtitle-with-context";

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
            <th>Discipline</th>
            <th>Effectif total</th>
            <th>Hommes</th>
            <th>Femmes</th>
            <th>% Hommes</th>
            <th>% Femmes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const totalCount = item.value || 0;
            const malePercent =
              totalCount > 0
                ? ((item.maleCount / totalCount) * 100).toFixed(1)
                : "0.0";
            const femalePercent =
              totalCount > 0
                ? ((item.femaleCount / totalCount) * 100).toFixed(1)
                : "0.0";

            return (
              <tr key={index}>
                <td>{item.name || "Non précisé"}</td>
                <td>{totalCount.toLocaleString()}</td>
                <td>{item.maleCount.toLocaleString()}</td>
                <td>{item.femaleCount.toLocaleString()}</td>
                <td>{malePercent}&nbsp;%</td>
                <td>{femalePercent}&nbsp;%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ItemsTreemapChart() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId } = useContextDetection();
  const navigate = useNavigate();

  const { data: cnuData, isLoading } = useFacultyMembersCNU({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const { data: treemapData, title } = useMemo(() => {
    if (!cnuData || !cnuData.cnu_groups_with_sections) {
      const labels = {
        fields: "discipline",
        geo: "région",
        structures: "établissement",
      };
      return {
        data: [],
        title: `Répartition des effectifs par ${
          labels[context] || "discipline"
        }`,
      };
    }

    const itemsData = cnuData.cnu_groups_with_sections
      .map((item) => {
        let totalMaleCount = 0;
        let totalFemaleCount = 0;

        item.groups?.forEach((group) => {
          group.sections?.forEach((section) => {
            section.details?.forEach((detail) => {
              if (detail.gender === "Masculin") {
                totalMaleCount += detail.count;
              } else if (detail.gender === "Féminin") {
                totalFemaleCount += detail.count;
              }
            });
          });
        });

        const itemCode = item._id.discipline_code;
        const itemName = item._id.discipline_name;
        const itemTotal = item.discipline_total;

        return {
          item_id: itemCode,
          itemLabel: itemName,
          totalCount: itemTotal || 0,
          maleCount: totalMaleCount,
          femaleCount: totalFemaleCount,
        };
      })
      .filter(
        (item) =>
          item.item_id &&
          item.itemLabel &&
          item.totalCount > 0 &&
          !isNaN(item.totalCount) &&
          isFinite(item.totalCount)
      );

    const processedData = itemsData.map((item, index) => {
      const totalCount = Math.max(item.totalCount, 1);
      const femalePercent =
        totalCount > 0 && item.femaleCount > 0
          ? Math.min(Math.max((item.femaleCount / totalCount) * 100, 0), 100)
          : 50;

      return {
        id: `${context}_${item.item_id}_${index}`,
        name: item.itemLabel.substring(0, 50),
        value: totalCount,
        colorValue: femalePercent,
        maleCount: item.maleCount || 0,
        femaleCount: item.femaleCount || 0,
      };
    });

    return {
      data: processedData
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 50),
      title: ` `,
    };
  }, [cnuData, context]);

  const largestGroup =
    treemapData && treemapData.length > 0 ? treemapData[0] : null;

  const treemapOptions = CreateChartOptions(
    "treemap",
    createTreemapOptions({
      title,
      selectedYear,
      treemapData,
      labels: {
        singular: "discipline",
        plural: "disciplines",
      },
      onItemClick: (itemCode) => {
        const parts = itemCode.split("_");
        const disciplineId = parts.slice(1, -1).join("_");
        navigate(
          `/personnel-enseignant/discipline/typologie?year=${selectedYear}&field_id=${disciplineId}`
        );
      },
    })
  );

  const config = {
    id: `${context}-treemap`,
    idQuery: `faculty-members-cnu`,
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h2" as const,
      fr: (
        <>
          État de la parité du personnel enseignant par grande discipline
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },
    readingKey: {
      fr: (
        <>
          {largestGroup && (
            <>
              La discipline la plus représentée est "
              <strong>{largestGroup.name}</strong>" avec{" "}
              <strong>{largestGroup.value.toLocaleString()}</strong>{" "}
              enseignants, dont {largestGroup.maleCount.toLocaleString()} hommes
              ({Math.round((largestGroup.maleCount / largestGroup.value) * 100)}
              % ♂) et {largestGroup.femaleCount.toLocaleString()} femmes (
              {Math.round(
                (largestGroup.femaleCount / largestGroup.value) * 100
              )}
              % ♀).
            </>
          )}
        </>
      ),
    },
    comment: {
      fr: (
        <>
          Les rectangles représentent les disciplines. La taille de chaque
          rectangle est proportionnelle à l'effectif total d'enseignants qu'il
          regroupe. La couleur indique la répartition hommes-femmes : un
          rectangle rouge/orangé indique une majorité de femmes, un rectangle
          jaune une majorité d'hommes et un rectangle gris une répartition
          équilibrée.
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "40px",
                    height: "24px",
                    backgroundColor: "#efcb3a",
                    marginRight: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                ></span>
                <span className="fr-text--sm">
                  <br />
                  <span style={{ fontSize: "0.85rem", color: "#666" }}>
                    Majorité masculine (≥60% ♂)
                  </span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "40px",
                    height: "24px",
                    backgroundColor: "#EFEFEF",
                    marginRight: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                ></span>
                <span className="fr-text--sm">
                  <br />
                  <span style={{ fontSize: "0.85rem", color: "#666" }}>
                    Parité hommes-femmes
                  </span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "40px",
                    height: "24px",
                    backgroundColor: "#e18b76",
                    marginRight: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                ></span>
                <span className="fr-text--sm">
                  <br />
                  <span style={{ fontSize: "0.85rem", color: "#666" }}>
                    Majorité féminine (≥60% ♀)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </>
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
    legend: false,
    integrationURL: `/personnel-enseignant/discipline/typologie`,
  };

  if (isLoading) {
    return (
      <Row horizontalAlign="center" style={{ display: "inline-block;" }}>
        <span
          className="fr-icon-refresh-line fr-icon--lg fr-icon--spin"
          aria-hidden="true"
        />
        <Text className="fr-ml-1w">
          Chargement des données par discipline...
        </Text>
      </Row>
    );
  }

  if (!treemapData || treemapData.length === 0) {
    return (
      <Notice closeMode={"disallow"} type={"warning"}>
        <Text>
          Aucune donnée disponible pour les disciplines pour l'année{" "}
          {selectedYear}
        </Text>
      </Notice>
    );
  }

  return (
    <>
      <ChartWrapper config={config} options={treemapOptions} renderData={() => <RenderData data={treemapData} />} />
    </>
  );
}

export default ItemsTreemapChart;
