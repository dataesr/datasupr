import { useRef, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Text, Notice } from "@dataesr/dsfr-plus";
import { useFacultyMembersOverview } from "../../../../api/use-overview";
import { useContextDetection } from "../../../../utils";
import { createBarChartOptions } from "./options";
import "../../../../styles.scss";

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
  } = useFacultyMembersOverview({
    context,
    annee_universitaire: selectedYear,
    contextId: contextId || undefined,
  });
  // AJOUTER LE CHARTWRAPPER
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
      distributionData = overviewData.disciplineGenderDistribution;
    } else {
      switch (context) {
        case "fields":
          distributionData = overviewData.disciplineGenderDistribution;
          break;
        case "geo":
          distributionData = overviewData.regionGenderDistribution;
          break;
        case "structures":
          distributionData = overviewData.structureGenderDistribution;
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
      let itemCode, itemName;

      if (contextId) {
        itemCode = item._id.discipline_code;
        itemName = item._id.discipline_name;
      } else {
        switch (context) {
          case "fields":
            itemCode = item._id.discipline_code;
            itemName = item._id.discipline_name;
            break;
          case "geo":
            itemCode = item._id.geo_code;
            itemName = item._id.geo_name;
            break;
          case "structures":
            itemCode = item._id.structure_code;
            itemName = item._id.structure_name;
            break;
          default:
            itemCode = "";
            itemName = "";
        }
      }

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
    const style = d.isSelected ? "font-weight: bold; color: #000091;" : "";

    return `<span style="${style}">${name}</span> <span style="font-size:11px; color:#888">(${count} personnes)</span>`;
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
      <Row horizontalAlign="center" style={{display: 'inline-block;'}}>
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
          <Text>Erreur lors du chargement des données de répartition par genre</Text>
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
          <Row className="fr-mb-1w">
            Options d'affichage :
          </Row>

          <Row className="fr-mb-1w">
              <Button
                size="sm"
                variant={sortKey === "total" ? "primary" : "secondary"}
                onClick={() => setSortKey("total")}
                title="Trier par effectif total"
                className="fr-mr-1w"
                >
                <i className="ri-bar-chart-horizontal-line"></i>
                Total
              </Button>

              <Button
                size="sm"
                variant={sortKey === "femmesPercent" ? "primary" : "secondary"}
                onClick={() => setSortKey("femmesPercent")}
                title="Trier par pourcentage de femmes"
                className="fr-mr-1w"
                >
                <i className="ri-women-line"></i>
                Femmes
              </Button>

              <Button
                size="sm"
                variant={sortKey === "hommesPercent" ? "primary" : "secondary"}
                onClick={() => setSortKey("hommesPercent")}
                title="Trier par pourcentage d'hommes"
                className="fr-mr-1w"
                >
                <i className="ri-men-line"></i>
                Hommes
              </Button>
          </Row>
          <Row> 
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setStackType((prev) =>
                  prev === "percent" ? "normal" : "percent"
                )
              }
              title={`Afficher en ${
                stackType === "percent" ? "effectifs" : "pourcentages"
              }`}
              className="fr-mr-1w"
            >
              <span
                className={
                  stackType === "percent" ? "ri-user-fill" : "ri-percent-fill"
                }
                aria-hidden="true"
              />
              {stackType === "percent" ? "Nb" : ""}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              title={`Trier par ordre ${
                sortOrder === "asc" ? "décroissant" : "croissant"
              }`}
              className="fr-mr-1w"
            >
              <span
                className={
                  sortOrder === "asc"
                    ? "fr-icon-arrow-up-s-fill"
                    : "fr-icon-arrow-down-s-fill"
                }
                aria-hidden="true"
              />
              {sortOrder === "asc" ? "Croissant" : "Décroissant"}
            </Button>
          </Row>

      <Row>
        <Col md={12}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
        </Col>
      </Row>

      {contextId && (
        <Row>
          <Col md={12}>
            <div className="fr-text--xs fr-text--mention-grey">
              <strong>Note :</strong>{" "}
              {labels.singular.charAt(0).toUpperCase() +
                labels.singular.slice(1)}{" "}
              sélectionnée est mise en évidence. Cliquez sur une autre{" "}
              {labels.singular} pour la comparer.
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ItemBarChart;
