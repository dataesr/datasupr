import { useEffect, useMemo, useState } from "react";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import ChartWrapper from "../../../../components/chart-wrapper";

interface AgeDistributionData {
  year: string;
  fieldId: string;
  fieldLabel: string;
  totalCount: number;
  forcedSelectedField?: string;

  ageDistribution: Array<{
    ageClass: string;
    count: number;
    percent: number;
  }>;
}

interface AgeDistributionPieChartProps {
  ageData: AgeDistributionData[];
  isLoading: boolean;
  year: string;
  forcedSelectedField;
}

export function AgeDistributionPieChart({
  ageData,
  isLoading,
  year,
  forcedSelectedField,
}: AgeDistributionPieChartProps) {
  const [selectedField, setSelectedField] = useState<string>(
    forcedSelectedField || "all"
  );
  useEffect(() => {
    if (forcedSelectedField) {
      setSelectedField(forcedSelectedField);
    }
  }, [forcedSelectedField]);

  const fields = useMemo(() => {
    if (!ageData || !ageData.length) return [];

    const sortedData = [...ageData].sort((a, b) => b.totalCount - a.totalCount);

    return sortedData.map((field) => ({
      id: field.fieldId,
      label: field.fieldLabel,
      totalCount: field.totalCount,
    }));
  }, [ageData]);

  const chartOptions = useMemo(() => {
    if (!ageData || !ageData.length) {
      return null;
    }

    let chartData;
    let chartTitle;

    if (selectedField === "all") {
      const ageClasses = {};
      let totalCount = 0;

      ageData.forEach((field) => {
        totalCount += field.totalCount;
        field.ageDistribution.forEach((age) => {
          if (!ageClasses[age.ageClass]) {
            ageClasses[age.ageClass] = 0;
          }
          ageClasses[age.ageClass] += age.count;
        });
      });

      chartData = Object.entries(ageClasses).map(([ageClass, count]) => ({
        name: ageClass,
        y: ((count as number) / totalCount) * 100,
        count: count,
      }));

      chartTitle = "Répartition par âge - Toutes disciplines";
    } else {
      const selectedFieldData = ageData.find(
        (f) => f.fieldId === selectedField
      );

      if (!selectedFieldData) return null;

      chartData = selectedFieldData.ageDistribution.map((age) => ({
        name: age.ageClass,
        y: age.percent,
        count: age.count,
      }));

      chartTitle = `Répartition par âge - ${selectedFieldData.fieldLabel}`;
    }

    const colors = {
      "35 ans et moins": "#6EADFF",
      "36 à 55 ans": "#000091",
      "56 ans et plus": "#4B9DFF",
    };

    return CreateChartOptions("pie", {
      chart: {
        type: "pie",
        height: 400,
      },
      title: {
        text: chartTitle,
      },
      subtitle: {
        text: `Année académique ${year}`,
      },
      tooltip: {
        pointFormat:
          "<b>{point.name}</b>: {point.y:.1f}% ({point.count} enseignants)",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          colors: chartData.map((item) => colors[item.name] || "#999999"),
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.y:.1f}%",
            style: {
              textOutline: "1px contrast",
            },
          },
          showInLegend: true,
        },
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
        itemMarginTop: 5,
        itemMarginBottom: 5,
      },
      series: [
        {
          name: "Âge",
          type: "pie",
          data: chartData,
        },
      ],
      credits: { enabled: false },
    });
  }, [ageData, selectedField, year]);

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement des données de répartition par âge...
      </div>
    );
  }

  if (!chartOptions || !ageData || !ageData.length) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour la répartition par âge cette année
      </div>
    );
  }

  return (
    <div>
      {!forcedSelectedField && (
        <div className="fr-select-group fr-mb-3w">
          <select
            className="fr-select"
            id="discipline-select"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            <option value="all">
              Toutes les disciplines (
              {fields.reduce((sum, f) => sum + f.totalCount, 0)} enseignants)
            </option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.label} ({field.totalCount} enseignants)
              </option>
            ))}
          </select>
        </div>
      )}

      <ChartWrapper
        id="age-distribution-chart"
        options={chartOptions}
        legend={null}
      />
    </div>
  );
}
