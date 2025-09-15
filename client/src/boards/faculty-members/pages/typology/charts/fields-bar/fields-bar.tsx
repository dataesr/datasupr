import { useRef, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import HighchartsReact from "highcharts-react-official";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Text, Notice } from "@dataesr/dsfr-plus";
import { useContextDetection } from "../../../../utils";
import { createBarChartOptions } from "./options";
import "../../../../styles.scss";
import { useGenderDistribution } from "./use-gender-distrubition";
import ChartWrapper from "../../../../../../components/chart-wrapper";
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
            <th>Nom</th>
            <th>Effectif total</th>
            <th>Hommes</th>
            <th>Femmes</th>
            <th>% Hommes</th>
            <th>% Femmes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.itemName || "Non précisé"}</td>
              <td>{item.totalCount.toLocaleString()}</td>
              <td>{item.hommesCount.toLocaleString()}</td>
              <td>{item.femmesCount.toLocaleString()}</td>
              <td>{item.hommesPercent}&nbsp;%</td>
              <td>{item.femmesPercent}&nbsp;%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ItemBarChart: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId } = useContextDetection();
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const navigate = useNavigate();
  const {
    data: overviewData,
    isLoading,
    error,
  } = useGenderDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId: contextId || undefined,
  });
  const [sortKey, setSortKey] = useState<
    "total" | "femmesPercent" | "hommesPercent"
  >("total");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [stackType, setStackType] = useState<"percent" | "normal">("percent");
  const rootStyles = getComputedStyle(document.documentElement);

  const items = useMemo(() => {
    if (!overviewData) return [];

    let distributionData;

    if (contextId) {
      distributionData = overviewData.gender_distribution;
    } else {
      switch (context) {
        case "fields":
          distributionData = overviewData.gender_distribution;
          break;
        case "geo":
          distributionData = overviewData.gender_distribution;
          break;
        case "structures":
          distributionData = overviewData.gender_distribution;
          break;
        default:
          return [];
      }
    }

    if (!distributionData) return [];

    return distributionData.map((item) => {
      let maleCount = 0;
      let femaleCount = 0;

      item.gender_breakdown?.forEach((genderData) => {
        if (genderData.gender === "Masculin") {
          maleCount = genderData.count;
        } else if (genderData.gender === "Féminin") {
          femaleCount = genderData.count;
        }
      });
      const totalCount = item.total_count;
      const itemCode =
        item._id?.geo_code ||
        item._id?.structure_code ||
        item._id?.field_code ||
        "";
      const itemName =
        item._id?.geo_name ||
        item._id?.structure_name ||
        item._id?.field_name ||
        "Non précisé";
      return {
        itemName,
        itemCode,
        hommesCount: maleCount,
        hommesPercent:
          totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0,
        femmesCount: femaleCount,
        femmesPercent:
          totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0,
        totalCount,
        isSelected: false,
      };
    });
  }, [overviewData, contextId, context]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const getVal = (d: typeof a) => {
        if (sortKey === "total") return d.totalCount;
        if (sortKey === "femmesPercent") return d.femmesPercent;
        if (sortKey === "hommesPercent") return d.hommesPercent;
        return 0;
      };
      const valA = getVal(a);
      const valB = getVal(b);
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }, [items, sortKey, sortOrder]);

  const categories = sortedItems.map((d) => {
    const name = d.itemName;
    const count = d.totalCount.toLocaleString();
    const style = d.isSelected
      ? "font-weight: bold; color: #161616;"
      : "color: #161616;";

    return `<span style="${style}">${name}</span> <span style="font-size:12px; color:#161616">(${count} personnes)</span>`;
  });

  const femmesData =
    stackType === "percent"
      ? sortedItems.map((d) => ({
          y: d.femmesPercent,
          color: d.isSelected
            ? rootStyles.getPropertyValue("--women-color-highlighted") ||
              "#d63384"
            : rootStyles.getPropertyValue("--women-color") || "#e1000f",
        }))
      : sortedItems.map((d) => ({
          y: d.femmesCount,
          color: d.isSelected
            ? rootStyles.getPropertyValue("--women-color-highlighted") ||
              "#d63384"
            : rootStyles.getPropertyValue("--women-color") || "#e1000f",
        }));

  const hommesData =
    stackType === "percent"
      ? sortedItems.map((d) => ({
          y: d.hommesPercent,
          color: d.isSelected
            ? rootStyles.getPropertyValue("--men-color-highlighted") ||
              "#0d6efd"
            : rootStyles.getPropertyValue("--men-color") || "#000091",
        }))
      : sortedItems.map((d) => ({
          y: d.hommesCount,
          color: d.isSelected
            ? rootStyles.getPropertyValue("--men-color-highlighted") ||
              "#0d6efd"
            : rootStyles.getPropertyValue("--men-color") || "#000091",
        }));

  const getLabels = () => {
    const labels = {
      fields: {
        singular: "discipline",
        plural: "disciplines",
        urlPath: "discipline",
      },
      geo: {
        singular: "région",
        plural: "régions",
        urlPath: "geo",
      },
      structures: {
        singular: "établissement",
        plural: "établissements",
        urlPath: "universite",
      },
    };
    return labels[context];
  };

  const labels = getLabels();

  const mostRepresentedItem = sortedItems.length > 0 ? sortedItems[0] : null;

  const handleItemClick = (itemCode: string) => {
    navigate(
      `/personnel-enseignant/${
        labels.urlPath
      }/typologie?annee_universitaire=${selectedYear}&${
        context === "fields"
          ? "field_id"
          : context === "geo"
          ? "geo_id"
          : "structure_id"
      }=${itemCode}`
    );
  };

  const config = {
    id: "gender-distribution-chart",
    idQuery: "gender-distribution",
    title: {
      className: "fr-mt-0w",
      look: "h6" as const,
      size: "h2" as const,
      fr: (
        <>
          Quelles sont les disciplines où le personnel enseignant est paritaire
          ?&nbsp;
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },
    readingKey: {
      fr: (
        <>
          Par exemple, pour l'année universitaire {selectedYear}, l'effectif le
          plus important se trouve dans la catégorie "
          <strong>{mostRepresentedItem?.itemName}</strong>" avec{" "}
          <strong>{mostRepresentedItem?.totalCount.toLocaleString()}</strong>{" "}
          personnes, dont {mostRepresentedItem?.hommesCount.toLocaleString()}{" "}
          hommes et {mostRepresentedItem?.femmesCount.toLocaleString()} femmes.
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
        </>
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
  };

  const options = createBarChartOptions({
    sortedItems,
    categories,
    femmesData,
    hommesData,
    selectedYear,
    contextId: contextId || null,
    stackType,
    labels,
    onItemClick: handleItemClick,
  });

  useEffect(() => {
    if (chartRef.current?.chart) {
      chartRef.current.chart.reflow();
    }
  }, [items, sortKey, sortOrder, stackType]);

  if (isLoading) {
    return (
      <Row horizontalAlign="center" style={{ display: "inline-block;" }}>
        <span
          className="fr-icon-refresh-line fr-icon--lg fr-icon--spin"
          aria-hidden="true"
        />
        <Text className="fr-ml-1w">
          Chargement des données par {labels.singular}...
        </Text>
      </Row>
    );
  }

  if (error) {
    return (
      <Row>
        <Notice closeMode={"disallow"} type={"warning"}>
          <Text>
            Erreur lors du chargement des données de répartition par genre
          </Text>
        </Notice>
      </Row>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Row>
        <Notice closeMode={"disallow"} type={"warning"}>
          <Text>
            Aucune donnée disponible pour la répartition par genre pour l'année{" "}
            {selectedYear}
          </Text>
        </Notice>
      </Row>
    );
  }

  return (
    <>
      <ChartWrapper.Title config={config}>
        <Row gutters className="fr-mb-2w">
          <Col md={8}>
            <div className="fr-mr-1w" style={{ display: "inline" }}>
              Trier par effectif :
            </div>
            <Button
              size="sm"
              className="fr-mr-1w"
              variant={sortKey === "hommesPercent" ? "primary" : "secondary"}
              onClick={() => setSortKey("hommesPercent")}
              title="Trier par effectif d'hommes"
            >
              Homme
            </Button>
            <Button
              size="sm"
              className="fr-mr-1w"
              variant={sortKey === "femmesPercent" ? "primary" : "secondary"}
              onClick={() => setSortKey("femmesPercent")}
              title="Trier par effectif de femmes"
            >
              Femme
            </Button>
            <Button
              size="sm"
              className="fr-mr-1w"
              variant={sortKey === "total" ? "primary" : "secondary"}
              onClick={() => setSortKey("total")}
              title="Trier par effectif total"
            >
              Total
            </Button>
            <div className="fr-mr-1w" style={{ display: "inline" }}>
              par ordre
            </div>
            <Button
              size="sm"
              className="fr-mr-1w"
              variant="secondary"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              title={`Trier par ordre ${
                sortOrder === "asc" ? "décroissant" : "croissant"
              }`}
            >
              {sortOrder === "asc" ? "croissant" : "décroissant"}
            </Button>
          </Col>
          <Col md={4} style={{ textAlign: "right" }} className="fr-pr-4w">
            <div style={{ display: "inline" }} className="fr-mr-1w">
              Voir les
            </div>
            <Button
              size="sm"
              className="fr-mr-1w"
              variant="secondary"
              onClick={() =>
                setStackType((prev) =>
                  prev === "percent" ? "normal" : "percent"
                )
              }
              title={`Afficher en ${
                stackType === "percent" ? "effectifs" : "pourcentages"
              }`}
            >
              {stackType === "percent" ? "effectifs" : "pourcentages"}
            </Button>
          </Col>
        </Row>
      </ChartWrapper.Title>

      <Col md={12}>
        <div style={{ position: "relative" }}>
          <ChartWrapper
            config={config}
            hideTitle={true}
            options={options}
            legend={null}
            renderData={() => <RenderData data={sortedItems} />}
          />
          <Row horizontalAlign="center" className="fr-mb-4w">
            <Col className="text-center">
              <div style={{ fontSize: "12px" }} className="fr-mr-3w">
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#efcb3a",
                    marginRight: "5px",
                    borderRadius: "2px",
                  }}
                ></span>
                Part d'hommes
              </div>
            </Col>
            <Col className="text-center">
              <div style={{ fontSize: "12px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#e18b76",
                    marginRight: "5px",
                    borderRadius: "2px",
                  }}
                ></span>
                Part de femmes
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </>
  );
};

export default ItemBarChart;
