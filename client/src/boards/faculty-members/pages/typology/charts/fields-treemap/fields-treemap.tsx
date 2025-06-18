import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsTreemap from "highcharts/modules/treemap";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useFacultyMembersCNU } from "../../../../api/use-cnu";
import { CreateChartOptions } from "../../../../components/creat-chart-options";
import { useContextDetection } from "../../../../utils";
import { createTreemapOptions } from "./options";
import { Col, Notice, Row, Text } from "@dataesr/dsfr-plus";

HighchartsTreemap(Highcharts);

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

        let itemCode, itemName, itemTotal;

        switch (context) {
          case "fields":
            itemCode = item._id.discipline_code;
            itemName = item._id.discipline_name;
            itemTotal = item.discipline_total;
            break;
          case "geo":
            itemCode = item._id.discipline_code;
            itemName = item._id.discipline_name;
            itemTotal = item.discipline_total;
            break;
          case "structures":
            itemCode = item._id.discipline_code;
            itemName = item._id.discipline_name;
            itemTotal = item.discipline_total;
            break;
          default:
            itemCode = item._id.discipline_code;
            itemName = item._id.discipline_name;
            itemTotal = item.discipline_total;
        }

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

  const getNavigationURL = (itemCode: string) => {
    const paramNames = {
      fields: "field_id",
      geo: "geo_id",
      structures: "structure_id",
    };

    const targetPath = context === "fields" ? "discipline" : "discipline";

    return `/personnel-enseignant/${targetPath}/typologie?year=${selectedYear}&${
      paramNames[context === "fields" ? "fields" : "fields"]
    }=${itemCode}`;
  };

  const handleItemClick = (itemCode: string) => {
    const parts = itemCode.split("_");
    const disciplineId = parts.slice(1, -1).join("_");

    navigate(getNavigationURL(disciplineId));
  };

  const treemapOptions = CreateChartOptions(
    "treemap",
    createTreemapOptions({
      title,
      selectedYear,
      treemapData,
      labels,
      onItemClick: handleItemClick,
    })
  );

  const config = {
    id: `${context}-treemap`,
    idQuery: `faculty-members-cnu`,
    title: {
      fr: `Répartition des effectifs par ${labels.singular}`,
      en: `Distribution of faculty members by ${labels.singular}`,
    },
    description: {
      fr: `Visualisation hiérarchique des effectifs enseignants par ${labels.singular}`,
      en: `Hierarchical visualization of faculty members by ${labels.singular}`,
    },
    integrationURL: `/personnel-enseignant/${labels.urlPath}/typologie`,
  };

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

  if (!treemapData || treemapData.length === 0) {
    return (
        <Notice closeMode={"disallow"} type={"warning"}>
          <Text>
            Aucune donnée disponible pour les {labels.plural} pour l'année{" "}
            {selectedYear}
          </Text>
        </Notice>
    );
  }

  return (
    <>
      <ChartWrapper
        config={config}
        options={treemapOptions}
        legend={null}
        renderData={undefined}
      />

      <Row horizontalAlign="center" className="fr-mt-2w">
          <Col className="text-center">
            <span className="fr-mr-3w">
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
              Majorité masculine (≥60%)
            </span>
          </Col>
          <Col className="text-center">
            <span className="fr-mr-3w">
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#EFEFEF",
                  marginRight: "5px",
                  borderRadius: "2px",
                  border: "1px solid #ddd",
                }}
              ></span>
              Parité (40-60%)
            </span>
          </Col>
          <Col className="text-center">
            <span>
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
              Majorité féminine (≥60%)
            </span>
          </Col>
      </Row>
      <Row horizontalAlign="center" className="fr-mt-2w fr-text--italic">
        <em>
          Cliquez sur {contextId ? "une autre" : "une"} {labels.singular} pour
          explorer ses groupes et sections CNU en détail.
        </em>
      </Row>
    </>
  );
}

export default ItemsTreemapChart;
