import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  createCnuGroupsChartOptions,
  getColorForDiscipline,
  getShade,
} from "./options";
import { useFacultyMembersFieldsCnu } from "../../api/use-cnu";

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

interface CNUSection {
  details?: Array<{
    gender: string;
    count: number;
  }>;
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
  cnuSections: CNUSection[];
}
export default function CnuGroupsChart() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("year") || "";
  console.log("Selected Year:", selectedYear);
  const { data: cnuData } = useFacultyMembersFieldsCnu(selectedYear);
  console.log(cnuData);

  const cnuGroups = useMemo(() => {
    if (!cnuData?.disciplines_with_cnu_groups || !selectedYear) {
      return [];
    }

    const allGroups: CNUGroup[] = [];

    // Pour chaque discipline
    cnuData.disciplines_with_cnu_groups.forEach((discipline) => {
      const disciplineCode = discipline._id.discipline_code;
      const disciplineName = discipline._id.discipline_name;

      discipline.groups?.forEach((group) => {
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
          field_id: disciplineCode,
          fieldLabel: disciplineName,
          cnuSections: group.sections || [],
        });
      });
    });

    return allGroups;
  }, [cnuData, selectedYear]);

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
