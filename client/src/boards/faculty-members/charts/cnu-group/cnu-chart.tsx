import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import { createCnuGroupsChartOptions, getShade } from "./options";
import { useFacultyMembersCNU } from "../../api/use-cnu";
import { useContextDetection, getColorForDiscipline } from "../../utils";
import ChartWrapper from "../../../../components/chart-wrapper";

function RenderData({ groupedData }) {
  if (!groupedData || groupedData.length === 0) {
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
            <table id="cnu-groups-table">
              <thead>
                <tr>
                  <th>Groupe CNU</th>
                  <th>Effectif total</th>
                  <th>Hommes</th>
                  <th>Femmes</th>
                  <th>% Hommes</th>
                  <th>% Femmes</th>
                </tr>
              </thead>
              <tbody>
                {groupedData.map((group, index) => (
                  <tr key={index}>
                    <td>{group.groupLabel}</td>
                    <td>{group.totalCount.toLocaleString()}</td>
                    <td>{group.maleCount.toLocaleString()}</td>
                    <td>{group.femaleCount.toLocaleString()}</td>
                    <td>{group.malePercent}%</td>
                    <td>{group.femalePercent}%</td>
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
  disciplineIndex: number;
}

interface GroupedData {
  discipline: string;
  groups: CNUGroup[];
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
  const isDisciplineContext = context === "fields" && !!contextId;

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

  const tableData = useMemo(() => {
    if (!groupedData || groupedData.length === 0) return [];

    return groupedData.flatMap((itemData) =>
      itemData.groups.map((group) => {
        const maleCount = group.maleCount || 0;
        const femaleCount = group.femaleCount || 0;
        const totalCount = group.totalCount || 0;

        return {
          groupLabel: `${group.cnuGroupLabel} (Groupe ${group.cnuGroupId})`,
          totalCount,
          maleCount,
          femaleCount,
          malePercent:
            totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0,
          femalePercent:
            totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0,
        };
      })
    );
  }, [groupedData]);

  const categories = useMemo(() => {
    if (isDisciplineContext && groupedData.length > 0) {
      return groupedData[0].groups.map(
        (g) => `${g.cnuGroupLabel} (Groupe ${g.cnuGroupId})`
      );
    }
    return groupedData.map((d) => d.discipline);
  }, [isDisciplineContext, groupedData]);

  const data: DataPoint[] = useMemo(() => {
    if (isDisciplineContext && groupedData.length > 0) {
      const result: DataPoint[] = [];
      const singleDiscipline = groupedData[0];
      const baseColor =
        getColorForDiscipline(singleDiscipline.discipline) || "";

      singleDiscipline.groups.forEach((group, index) => {
        const typedGroup = group as CNUGroup;
        const maleCount = typedGroup.maleCount || 0;
        const femaleCount = typedGroup.femaleCount || 0;
        const totalCount = typedGroup.totalCount || 0;
        const groupId = typedGroup.cnuGroupId || "";
        const groupLabel = typedGroup.cnuGroupLabel || "";

        result.push({
          name: `${groupLabel} (Groupe ${groupId})`,
          y: totalCount,
          x: index,
          disciplineIndex: 0,
          cnuGroupId: groupId,
          color: getShade(baseColor, index, singleDiscipline.groups.length),
          maleCount,
          femaleCount,
          malePercent:
            totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0,
          femalePercent:
            totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0,
          cnuGroupPercent:
            singleDiscipline.totalCount > 0
              ? Math.round((totalCount / singleDiscipline.totalCount) * 100)
              : 0,
        });
      });
      return result;
    }

    const result: DataPoint[] = [];
    groupedData.forEach((itemData) => {
      const baseColor = getColorForDiscipline(itemData.discipline) || "";
      const disciplineIndex = categories.indexOf(itemData.discipline);

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
          x: disciplineIndex,
          disciplineIndex: disciplineIndex,
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
  }, [isDisciplineContext, groupedData, categories]);

  const options = createCnuGroupsChartOptions(
    data,
    categories,
    groupedData,
    !isDisciplineContext
  );

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

  return (
    <div className="fr-mb-4w fr-mt-4w">
      <ChartWrapper
        config={{
          id: "cnu-groups-chart",
          idQuery: "cnu-groups",
          title: {
            fr: "Groupes CNU",
          },
          description: {
            fr: "Il est composé de 11 groupes, eux-mêmes divisés en 52 sections, dont chacune correspond à une discipline. Chaque section comprend deux collèges où siègent en nombre égal d’une part, des représentants des professeurs des universités et personnels assimilés et, d’autre part, des représentants des maîtres de conférences et personnels assimilés.Ce graphique présente la répartition des enseignants-chercheurs par groupes CNU. La taille de chaque barre est proportionnelle au nombre d'enseignants-chercheurs dans le groupe. Les données incluent également la répartition par genre au sein de chaque groupe, permettant d'identifier les disparités hommes-femmes selon les disciplines scientifiques.",
          },
          integrationURL: "/integration-url",
        }}
        options={options}
        legend={null}
        renderData={() => <RenderData groupedData={tableData} />}
      />
    </div>
  );
}
