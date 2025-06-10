import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsTreemap from "highcharts/modules/treemap";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useFacultyMembersCNU } from "../../../../api/use-cnu";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import { useContextDetection } from "../../../../utils";
import { createTreemapOptions } from "./options";

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
      <div className="fr-text--center fr-py-3w">
        <div className="fr-mb-2w">
          <span
            className="fr-icon-loader-line fr-icon--lg"
            aria-hidden="true"
          ></span>
        </div>
        <div>Chargement des données par {labels.singular}...</div>
      </div>
    );
  }

  if (!treemapData || treemapData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        <div className="fr-alert fr-alert--info fr-alert--sm">
          <p>
            Aucune donnée disponible pour les {labels.plural} pour l'année{" "}
            {selectedYear}
          </p>
        </div>
      </div>
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

      <div className="fr-text--xs fr-mt-2w" style={{ display: "block" }}>
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
          <div className="fr-col-auto">
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
          </div>
          <div className="fr-col-auto">
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
          </div>
          <div className="fr-col-auto">
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
          </div>
        </div>

        <div className="fr-text--center fr-mt-2w">
          <em>
            Cliquez sur {contextId ? "une autre" : "une"} {labels.singular} pour
            explorer ses groupes et sections CNU en détail
          </em>
        </div>
      </div>
    </>
  );
}

export default ItemsTreemapChart;
