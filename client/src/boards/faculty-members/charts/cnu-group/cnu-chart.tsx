import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  createCnuGroupsChartOptions,
  getColorForDiscipline,
  getShade,
} from "./options";
import { useFacultyMembersCNU } from "../../api/use-cnu";
import { useContextDetection } from "../../utils";
import { formatToPercent } from "../../../../utils/format";

interface DataPoint {
  name: string;
  y: number;
  x: number;
  cnuGroupId: string | number;
  color: Highcharts.ColorType;
  maleCount: number;
  femaleCount: number;
  malePercent: number;
  femalePercent: number;
  cnuGroupPercent: number;
}

interface GroupedData {
  discipline: string;
  groups: unknown[];
  totalCount: number;
}

interface CNUGroup {
  cnuGroupId: string;
  cnuGroupLabel: string;
  maleCount: number;
  femaleCount: number;
  unknownCount: number;
  totalCount: number;
  field_id?: string;
  fieldLabel?: string;
  cnuSections: Array<{ section_code: string; section_name: string }>;
}

export default function CnuGroupsChart() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId, contextName } = useContextDetection();

  const { data: cnuData } = useFacultyMembersCNU({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });
  const cnuGroups = useMemo(() => {
    if (!cnuData?.cnu_groups_with_sections || !selectedYear) {
      return [];
    }

    const allGroups: CNUGroup[] = [];

    cnuData.cnu_groups_with_sections.forEach((item) => {
      const itemCode = item._id.discipline_code;
      const itemName = item._id.discipline_name;

      item.groups?.forEach((group) => {
        let maleCount = 0;
        let femaleCount = 0;

        group.sections?.forEach((section) => {
          section.details?.forEach((detail) => {
            if (detail.gender === "Masculin") {
              maleCount += detail.count;
            } else if (detail.gender === "Féminin") {
              femaleCount += detail.count;
            }
          });
        });

        allGroups.push({
          cnuGroupId: group.group_code,
          cnuGroupLabel: group.group_name,
          maleCount,
          femaleCount,
          unknownCount: 0,
          totalCount: group.group_total,
          field_id: itemCode,
          fieldLabel: itemName,
          cnuSections: group.sections || [],
        });
      });
    });

    return allGroups;
  }, [cnuData, selectedYear]);
  const groupedData: GroupedData[] = useMemo(() => {
    if (!cnuGroups || cnuGroups.length === 0) return [];

    const items = Array.from(
      new Set(cnuGroups.map((group) => group.fieldLabel).filter(Boolean))
    ) as string[];

    const sortedItems = [...items].sort((a, b) => {
      const totalA = cnuGroups
        .filter((g) => g.fieldLabel === a)
        .reduce((sum, g) => sum + (g.totalCount || 0), 0);
      const totalB = cnuGroups
        .filter((g) => g.fieldLabel === b)
        .reduce((sum, g) => sum + (g.totalCount || 0), 0);
      return totalB - totalA;
    });

    return sortedItems.map((item) => {
      const itemGroups = cnuGroups
        .filter((g) => g.fieldLabel === item)
        .sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0));

      const totalCount = itemGroups.reduce(
        (sum, g) => sum + (g.totalCount || 0),
        0
      );

      return {
        discipline: item,
        groups: itemGroups,
        totalCount,
      };
    });
  }, [cnuGroups]);

  const categories = groupedData.map((d) => d.discipline);

  const data: DataPoint[] = useMemo(() => {
    const result: DataPoint[] = [];

    groupedData.forEach((itemData) => {
      const baseColor = getColorForDiscipline(itemData.discipline);

      itemData.groups.forEach((group, index) => {
        const typedGroup = group as CNUGroup;
        const maleCount = typedGroup.maleCount || 0;
        const femaleCount = typedGroup.femaleCount || 0;
        const totalCount = typedGroup.totalCount || 0;
        const groupId = typedGroup.cnuGroupId || "";
        const groupLabel = typedGroup.cnuGroupLabel || "";

        result.push({
          name: `${groupLabel} (Groupe ${groupId})`,
          y: totalCount,
          x: categories.indexOf(itemData.discipline),
          cnuGroupId: groupId,
          color: getShade(baseColor, index, itemData.groups.length),
          maleCount,
          femaleCount,
          malePercent:
            totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0,
          femalePercent:
            totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0,
          cnuGroupPercent:
            itemData.totalCount > 0
              ? Math.round((totalCount / itemData.totalCount) * 100)
              : 0,
        });
      });
    });

    return result;
  }, [groupedData, categories]);

  const options = createCnuGroupsChartOptions(data, categories, groupedData);

  if (!cnuGroups || cnuGroups.length === 0) {
    return (
      <div className="fr-alert fr-alert--info fr-my-3w">
        <p>
          Aucune donnée disponible pour les groupes CNU pour l'année{" "}
          {selectedYear}
          {contextId &&
            ` et ${
              contextName === "discipline"
                ? "la"
                : contextName === "région"
                ? "la"
                : "l'"
            } ${contextName} sélectionnée`}
        </p>
      </div>
    );
  }
  if (cnuGroups.length === 1) {
    const singleGroup = cnuGroups[0];
    const femalePercent =
      singleGroup.totalCount > 0
        ? Math.round((singleGroup.femaleCount / singleGroup.totalCount) * 100)
        : 0;
    const malePercent = 100 - femalePercent;

    return (
      <div className="fr-py-4w">
        <div className="fr-alert fr-alert--info">
          <h3 className="fr-alert__title">Groupe CNU unique</h3>
          <p>
            {contextId
              ? `${
                  contextName === "discipline"
                    ? "Cette"
                    : contextName === "région"
                    ? "Cette"
                    : "Cet"
                } ${contextName} ne contient qu'un seul groupe CNU`
              : "Il n'y a qu'un seul groupe CNU dans la sélection actuelle"}{" "}
            :{" "}
            <strong>
              Groupe {singleGroup.cnuGroupId} - {singleGroup.cnuGroupLabel}
            </strong>
          </p>
          <div className="fr-mt-3w">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <div className="fr-card fr-card--grey">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h4 className="fr-card__title">Effectif total</h4>
                      <p className="fr-text--xl fr-mb-0">
                        <strong>
                          {singleGroup.totalCount.toLocaleString()}
                        </strong>{" "}
                        enseignants
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-3">
                <div className="fr-card fr-card--grey">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h4 className="fr-card__title">Hommes</h4>
                      <p className="fr-text--xl fr-mb-0">
                        <strong>
                          {singleGroup.maleCount.toLocaleString()}
                        </strong>{" "}
                        ({malePercent}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-3">
                <div className="fr-card fr-card--grey">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h4 className="fr-card__title">Femmes</h4>
                      <p className="fr-text--xl fr-mb-0">
                        <strong>
                          {singleGroup.femaleCount.toLocaleString()}
                        </strong>{" "}
                        ({formatToPercent(femalePercent)})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-3">
                <div className="fr-card fr-card--grey">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h4 className="fr-card__title">Sections CNU</h4>
                      <p className="fr-text--xl fr-mb-0">
                        <strong>{singleGroup.cnuSections.length}</strong>{" "}
                        sections
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fr-mt-3w">
            <h4>Sections CNU du groupe :</h4>
            <div className="fr-grid-row fr-grid-row--gutters">
              {singleGroup.cnuSections.map((section, index) => (
                <div key={index} className="fr-col-12 fr-col-md-6">
                  <div className="fr-badge fr-badge--info fr-m-1w">
                    {section.section_code} - {section.section_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="fr-mt-3w fr-text--sm">
            Un graphique en barres empilées n'est pas nécessaire pour visualiser
            un seul groupe. Les données détaillées sont disponibles ci-dessus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fr-mb-4w">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
