import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  createCnuGroupsChartOptions,
  getColorForDiscipline,
  getShade,
} from "./options";
import useFacultyMembersByFields from "../../api/use-by-fields";
import { CNUGroup } from "../../types";

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

interface CnuGroupsChartProps {
  selectedYear: string;
}

export default function CnuGroupsChart({ selectedYear }: CnuGroupsChartProps) {
  const { data: fieldData } = useFacultyMembersByFields(selectedYear);

  const cnuGroups = useMemo(() => {
    if (!fieldData?.length || !selectedYear) {
      return [];
    }

    const currentYearFields = fieldData.filter(
      (item) =>
        item.year === selectedYear || item.academic_year === selectedYear
    );

    const allGroups: CNUGroup[] = [];

    currentYearFields.forEach((field) => {
      const groups = field.headcount_per_cnu_group || field.cnuGroups || [];
      const fieldId = field.fieldId || field.field_id;
      const fieldLabel = field.fieldLabel || field.field_label;

      groups.forEach((group) => {
        const groupId = group.cnuGroupId || group.cnu_group_id;
        const groupLabel = group.cnuGroupLabel || group.cnu_group_label;
        const maleCount = group.numberMan || group.maleCount || 0;
        const femaleCount = group.numberWoman || group.femaleCount || 0;
        const unknownCount = group.numberUnknown || group.unknownCount || 0;
        const totalCount = maleCount + femaleCount + unknownCount;

        allGroups.push({
          cnuGroupId: groupId,
          cnuGroupLabel: groupLabel,
          maleCount: maleCount || 0,
          femaleCount: femaleCount || 0,
          unknownCount: unknownCount || 0,
          totalCount: totalCount || 0,
          fieldId,
          fieldLabel,
          cnuSections: [],
        });
      });
    });

    const mergedGroups = Object.values(
      allGroups.reduce<Record<string, CNUGroup>>((acc, group) => {
        const key = group.cnuGroupId;
        if (!key) return acc;

        if (!acc[key]) {
          acc[key] = { ...group };
        } else {
          acc[key]!.maleCount =
            (acc[key]!.maleCount || 0) + (group.maleCount || 0);
          acc[key]!.femaleCount =
            (acc[key]!.femaleCount || 0) + (group.femaleCount || 0);
          acc[key]!.unknownCount =
            (acc[key]!.unknownCount || 0) + (group.unknownCount || 0);
          acc[key]!.totalCount =
            (acc[key]!.totalCount || 0) + (group.totalCount || 0);
        }
        return acc;
      }, {})
    ).sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0));

    return mergedGroups;
  }, [fieldData, selectedYear]);

  const groupedData: GroupedData[] = useMemo(() => {
    if (!cnuGroups || cnuGroups.length === 0) return [];

    const disciplines = Array.from(
      new Set(cnuGroups.map((group) => group.fieldLabel).filter(Boolean))
    ) as string[];

    const sortedDisciplines = [...disciplines].sort((a, b) => {
      const totalA = cnuGroups
        .filter((g) => g.fieldLabel === a)
        .reduce((sum, g) => sum + (g.totalCount || 0), 0);
      const totalB = cnuGroups
        .filter((g) => g.fieldLabel === b)
        .reduce((sum, g) => sum + (g.totalCount || 0), 0);
      return totalB - totalA;
    });

    return sortedDisciplines.map((discipline) => {
      const disciplineGroups = cnuGroups
        .filter((g) => g.fieldLabel === discipline)
        .sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0));

      const totalCount = disciplineGroups.reduce(
        (sum, g) => sum + (g.totalCount || 0),
        0
      );

      return {
        discipline,
        groups: disciplineGroups,
        totalCount,
      };
    });
  }, [cnuGroups]);

  const categories = groupedData.map((d) => d.discipline);

  const data: DataPoint[] = useMemo(() => {
    const result: DataPoint[] = [];

    groupedData.forEach((disciplineData) => {
      const baseColor = getColorForDiscipline(disciplineData.discipline);

      disciplineData.groups.forEach((group, index) => {
        const typedGroup = group as CNUGroup;
        const maleCount = typedGroup.maleCount || 0;
        const femaleCount = typedGroup.femaleCount || 0;
        const totalCount = typedGroup.totalCount || 0;
        const groupId = typedGroup.cnuGroupId || "";
        const groupLabel = typedGroup.cnuGroupLabel || "";

        result.push({
          name: `${groupLabel} (Groupe ${groupId})`,
          y: totalCount,
          x: categories.indexOf(disciplineData.discipline),
          cnuGroupId: groupId,
          color: getShade(baseColor, index, disciplineData.groups.length),
          maleCount,
          femaleCount,
          malePercent:
            totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0,
          femalePercent:
            totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0,
          cnuGroupPercent:
            disciplineData.totalCount > 0
              ? Math.round((totalCount / disciplineData.totalCount) * 100)
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
        </p>
      </div>
    );
  }

  return (
    <div className="fr-mb-4w">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
