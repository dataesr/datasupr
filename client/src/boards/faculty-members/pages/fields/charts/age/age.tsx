import { useEffect, useMemo, useState } from "react";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import { Col } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { AgeDistributionChartProps } from "../../types";

export function AgeDistributionPieChart({
  ageData,
  isLoading,
  year,
  forcedSelectedField,
}: AgeDistributionChartProps) {
  const [selectedField, setSelectedField] = useState<string>(
    forcedSelectedField || "all"
  );

  const config = {
    id: "age-distribution-chart",
    idQuery: "age-distribution-chart",
    title: {
      fr: "Répartition par âge des enseignants",
      en: "Distribution of faculty members by age",
    },
    description: {
      fr: "Répartition des enseignants par âge",
      en: "Distribution of faculty members by age",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };

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
        count: count as number,
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

    const sortOrder = {
      "35 ans et moins": 1,
      "36 à 55 ans": 2,
      "56 ans et plus": 3,
    };
    chartData.sort((a, b) => sortOrder[a.name] - sortOrder[b.name]);

    const colors = {
      "35 ans et moins": "#6EADFF",
      "36 à 55 ans": "#000091",
      "56 ans et plus": "#4B9DFF",
    };

    return CreateChartOptions("bar", {
      chart: {
        type: "bar",
        height: 350,
      },
      title: {
        text: chartTitle,
      },
      subtitle: {
        text: `Année académique ${year}`,
      },
      xAxis: {
        categories: chartData.map((item) => item.name),
        title: {
          text: null,
        },
        labels: {
          style: {
            fontSize: "14px",
          },
        },
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: "Pourcentage",
          align: "high",
        },
        labels: {
          format: "{value}%",
          overflow: "justify",
        },
      },
      tooltip: {
        formatter: function () {
          return `<b>${this.x}</b><br>${this.y?.toFixed(1) ?? 0}% (${
            chartData.find((d) => d.name === this.x)?.count
          } enseignants)`;
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            format: "{y:.1f}%",
          },
          colorByPoint: true,
          colors: chartData.map((item) => colors[item.name]),
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
          name: "Âge",
          data: chartData.map((item) => item.y),
          type: "bar",
        },
      ],
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
      <Col md={12} className="fr-mb-3w">
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
      </Col>

      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={undefined}
      />
    </div>
  );
}
