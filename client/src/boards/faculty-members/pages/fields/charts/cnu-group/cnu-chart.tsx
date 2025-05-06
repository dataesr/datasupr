import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CNUGroup } from "../../../../types";

interface CnuGroupsChartProps {
  cnuGroups: CNUGroup[];
}

export default function CnuGroupsChart({ cnuGroups }: CnuGroupsChartProps) {
  const groupedData = useMemo(() => {
    if (!cnuGroups || cnuGroups.length === 0) return [];

    const disciplines = Array.from(
      new Set(cnuGroups.map((group) => group.fieldLabel))
    );

    const sortedDisciplines = [...disciplines].sort((a, b) => {
      const totalA = cnuGroups
        .filter((g) => g.fieldLabel === a)
        .reduce((sum, g) => sum + g.totalCount, 0);
      const totalB = cnuGroups
        .filter((g) => g.fieldLabel === b)
        .reduce((sum, g) => sum + g.totalCount, 0);
      return totalB - totalA;
    });

    return sortedDisciplines.map((discipline) => {
      const disciplineGroups = cnuGroups
        .filter((g) => g.fieldLabel === discipline)
        .sort((a, b) => b.totalCount - a.totalCount);

      const totalCount = disciplineGroups.reduce(
        (sum, g) => sum + g.totalCount,
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

  const getColorForDiscipline = (discipline: string) => {
    if (discipline.includes("Science")) return "#000091";
    if (discipline.includes("Lettre") || discipline.includes("humaine"))
      return "#e1000f";
    if (discipline.includes("Droit") || discipline.includes("économie"))
      return "#6E445A";
    if (discipline.includes("Médecine")) return "#E1000F";
    if (discipline.includes("Pharma")) return "#009099";
    return "#666666";
  };

  const getShade = (baseColor: string, index: number, total: number) => {
    const opacity = Math.max(0.3, 1 - (index * 0.7) / Math.max(1, total - 1));
    return Highcharts.color(baseColor).setOpacity(opacity).get();
  };

  const data = useMemo(() => {
    interface DataPoint {
      name: string;
      y: number;
      x: number;
      cnuGroupId: string;
      color: Highcharts.ColorType;
      maleCount: number;
      femaleCount: number;
      malePercent: number;
      femalePercent: number;
      cnuGroupPercent: number;
    }

    const result: DataPoint[] = [];

    groupedData.forEach((disciplineData) => {
      const baseColor = getColorForDiscipline(disciplineData.discipline);

      disciplineData.groups.forEach((group, index) => {
        result.push({
          name: `${group.cnuGroupLabel} (Groupe ${group.cnuGroupId})`,
          y: group.totalCount,
          x: categories.indexOf(disciplineData.discipline),
          cnuGroupId: group.cnuGroupId,
          color: getShade(baseColor, index, disciplineData.groups.length),
          maleCount: group.maleCount,
          femaleCount: group.femaleCount,
          malePercent: Math.round((group.maleCount / group.totalCount) * 100),
          femalePercent: Math.round(
            (group.femaleCount / group.totalCount) * 100
          ),
          cnuGroupPercent: Math.round(
            (group.totalCount / disciplineData.totalCount) * 100
          ),
        });
      });
    });

    return result;
  }, [groupedData, categories]);

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 600,
    },
    title: {
      text: "Répartition des groupes CNU par discipline",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
      align: "left",
    },
    xAxis: {
      categories,
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: "12px",
        },
        formatter: function () {
          const index = categories.indexOf(this.value as string);
          const totalCount = groupedData[index]?.totalCount || 0;
          return `${
            this.value
          }<br><span style="font-weight:normal;font-size:12px;">${totalCount.toLocaleString()} pers.</span>`;
        },
        useHTML: true,
      },
    },
    yAxis: {
      title: {
        text: "Effectifs",
      },
      labels: {
        formatter: function () {
          const value = Number(this.value);
          return value >= 1000 ? `${value / 1000}k` : value.toString();
        },
      },
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        const point = this.point as Highcharts.Point & {
          name: string;
          y: number;
          cnuGroupId: string;
          maleCount: number;
          femaleCount: number;
          malePercent: number;
          femalePercent: number;
          cnuGroupPercent: number;
        };
        return `<div style="padding:8px">
                <div style="font-weight:bold;margin-bottom:5px">${
                  point.name
                }</div>
                <div style="font-size:14px;font-weight:bold;margin-bottom:8px">${point.y.toLocaleString()} enseignants</div>
                <div style="color:#666;margin-bottom:5px">${
                  point.cnuGroupPercent
                }% de la discipline</div>
                <div style="margin-top:8px">👨 Hommes: ${point.maleCount} (${
          point.malePercent
        }%)</div>
                <div>👩 Femmes: ${point.femaleCount} (${
          point.femalePercent
        }%)</div>
                </div>`;
      },
    },
    plotOptions: {
      column: {
        stacking: "percent",
        borderWidth: 0,
        borderRadius: 2,
      },
      series: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            const point = this.point as Highcharts.Point & {
              y: number;
              cnuGroupId: string;
              cnuGroupPercent: number;
            };
            if (point.y < 1000) return "";
            return `Gr.${point.cnuGroupId} (${point.cnuGroupPercent}%)`;
          },
          style: {
            fontSize: "11px",
            fontWeight: "normal",
            color: "#FFFFFF",
            textOutline: "1px contrast",
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Groupes CNU",
        data: data,
        pointPadding: 0.1,
        groupPadding: 0.2,
        colorByPoint: true,
        type: "column",
      },
    ],
  };

  if (!cnuGroups || cnuGroups.length === 0) {
    return <p>Aucune donnée disponible pour les groupes CNU</p>;
  }

  return (
    <div className="fr-mb-4w">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
