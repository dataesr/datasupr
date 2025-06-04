import { useRef, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "@dataesr/dsfr-plus";
import { useFacultyMembersOverview } from "../../../../api/use-overview";
import { useContextDetection } from "../../../../utils";
import { createBarChartOptions } from "./options";
import "../../../../styles.scss";

const ItemBarChart: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("year") || "";
  const { context, contextId } = useContextDetection();
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const navigate = useNavigate();
  const {
    data: overviewData,
    isLoading,
    error,
  } = useFacultyMembersOverview({
    context,
    year: selectedYear,
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
      `/personnel-enseignant/${labels.urlPath}/typologie?year=${selectedYear}&${
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
      <div className="fr-text--center fr-py-3w">
        <div className="fr-mb-2w">
          <span
            className="fr-icon-loader-line fr-icon--lg"
            aria-hidden="true"
          ></span>
        </div>
        <div>Chargement des données de répartition par genre...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-text--center fr-py-3w">
        <div className="fr-alert fr-alert--error fr-alert--sm">
          <p>Erreur lors du chargement des données de répartition par genre</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        <div className="fr-alert fr-alert--info fr-alert--sm">
          <p>
            Aucune donnée disponible pour la répartition par genre pour l'année{" "}
            {selectedYear}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fr-mb-3w">
      <Row gutters className="fr-mb-2w">
        <Col className="fr-text--right">
          <div className="fr-text--xs fr-text--mention-grey fr-mb-1w">
            Options d'affichage :
          </div>

          <div className="fr-btn-group fr-btn-group--sm">
            <Button
              size="sm"
              variant={sortKey === "total" ? "primary" : "secondary"}
              onClick={() => setSortKey("total")}
              title="Trier par effectif total"
            >
              <i className="ri-bar-chart-horizontal-line"></i>
              Total
            </Button>

            <Button
              size="sm"
              variant={sortKey === "femmesPercent" ? "primary" : "secondary"}
              onClick={() => setSortKey("femmesPercent")}
              title="Trier par pourcentage de femmes"
            >
              <i className="ri-women-line"></i>
              Femmes
            </Button>

            <Button
              size="sm"
              variant={sortKey === "hommesPercent" ? "primary" : "secondary"}
              onClick={() => setSortKey("hommesPercent")}
              title="Trier par pourcentage d'hommes"
            >
              <i className="ri-men-line"></i>
              Hommes
            </Button>
          </div>

          <div className="fr-btn-group fr-btn-group--sm fr-ml-2w">
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
            >
              <span
                className={
                  stackType === "percent" ? "ri-percent-fill" : "ri-user-fill"
                }
                aria-hidden="true"
              />
              {stackType === "percent" ? "%" : "Nb"}
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
            >
              <span
                className={
                  sortOrder === "asc"
                    ? "fr-icon-arrow-up-s-fill"
                    : "fr-icon-arrow-down-s-fill"
                }
                aria-hidden="true"
              />
              {sortOrder === "asc" ? "Croiss." : "Décroiss."}
            </Button>
          </div>
        </Col>
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
        <Row className="fr-mt-2w">
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
    </div>
  );
};

export default ItemBarChart;
