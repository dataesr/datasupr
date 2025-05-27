import { useEffect, useMemo, useState } from "react";
import { Col } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createAgeDistributionChartOptions } from "./options";
import useFacultyMembersAgeDistribution from "../../api/use-by-age";

interface AgeDistributionPieChartProps {
  selectedYear: string;
  forcedSelectedField?: string;
}

export function AgeDistributionPieChart({
  selectedYear,
  forcedSelectedField,
}: AgeDistributionPieChartProps) {
  const [selectedField, setSelectedField] = useState<string>(
    forcedSelectedField || "all"
  );

  // Utilisation du hook directement dans le composant
  const { data: ageData, isLoading } =
    useFacultyMembersAgeDistribution(selectedYear);

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

    return createAgeDistributionChartOptions(
      chartData,
      chartTitle,
      selectedYear
    );
  }, [ageData, selectedField, selectedYear]);

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
        Aucune donnée disponible pour la répartition par âge pour l'année{" "}
        {selectedYear}
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
