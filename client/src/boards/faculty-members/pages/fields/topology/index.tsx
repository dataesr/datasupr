import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Title, Breadcrumb } from "@dataesr/dsfr-plus";
import { useParams } from "react-router-dom";
import useFacultyMembersByFields from "../api/use-by-fields";
import YearSelector from "../../../filters";
import { Link } from "@dataesr/dsfr-plus";
import { TreemapChart } from "./charts/treemap";
import useFacultyMembersByStatus from "../api/use-by-status";
import { DisciplineStatusStack } from "./charts/stack";

export function FieldsTopologie() {
  const { fieldId } = useParams<{ fieldId: string }>();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const { data: allFieldsData, isLoading: allDataLoading } =
    useFacultyMembersByFields(undefined, true);
  const { data: allFieldsByStatusData, isLoading: allDataByStatusLoading } =
    useFacultyMembersByStatus(selectedYear);
  console.log(allFieldsByStatusData);

  const { data: fieldsData, isLoading } =
    useFacultyMembersByFields(selectedYear);

  useEffect(() => {
    if (
      allFieldsData &&
      Array.isArray(allFieldsData) &&
      allFieldsData.length > 0
    ) {
      const uniqueYears = Array.from(
        new Set(
          allFieldsData.map((item) => item.year || item.academic_year || "")
        )
      ).filter(Boolean);

      const sortedYears = [...uniqueYears].sort((a, b) => {
        const yearA = parseInt(a.split("-")[0]);
        const yearB = parseInt(b.split("-")[0]);
        return yearB - yearA;
      });

      setAvailableYears(sortedYears);

      if (sortedYears.length > 0 && !selectedYear) {
        setSelectedYear(sortedYears[0]);
      }
    }
  }, [allFieldsData, selectedYear]);

  const displayYear = useMemo(() => {
    if (selectedYear) return selectedYear;
    return availableYears.length > 0 ? availableYears[0] : "chargement...";
  }, [selectedYear, availableYears]);

  const specificFieldData = useMemo(() => {
    if (!fieldId || !fieldsData) return null;
    return fieldsData.find(
      (d) => d.fieldId === fieldId || d.field_id === fieldId
    );
  }, [fieldsData, fieldId]);

  const pageTitle = useMemo(() => {
    if (fieldId && specificFieldData) {
      return `Topologie de la discipline ${
        specificFieldData.fieldLabel || specificFieldData.field_label
      }`;
    }
    return "Topologie des disciplines";
  }, [fieldId, specificFieldData]);

  const treemapData = useMemo(() => {
    if (!fieldsData) return [];

    let dataToProcess = fieldsData;
    if (fieldId) {
      if (specificFieldData) {
        // Si on est sur une discipline spécifique, on peut montrer ses groupes CNU
        // ou afficher juste cette discipline si pas de groupes disponibles
        if (
          specificFieldData.cnuGroups &&
          specificFieldData.cnuGroups.length > 0
        ) {
          return specificFieldData.cnuGroups.map((group) => ({
            id: group.cnuGroupId || "",
            name: group.cnuGroupLabel || "",
            value: group.totalCount || 0,
            colorValue:
              group.maleCount && group.femaleCount
                ? (group.femaleCount / (group.femaleCount + group.maleCount)) *
                  100
                : 50,
            maleCount: group.maleCount || 0,
            femaleCount: group.femaleCount || 0,
          }));
        } else {
          dataToProcess = [specificFieldData];
        }
      } else {
        return [];
      }
    }

    return dataToProcess.map((field) => ({
      id: field.fieldId || field.field_id || "",
      name: field.fieldLabel || field.field_label || "",
      value: field.totalCount || field.total_count || 0,
      colorValue:
        field.maleCount && field.femaleCount
          ? (field.femaleCount / (field.femaleCount + field.maleCount)) * 100
          : 50,
      maleCount: field.maleCount || 0,
      femaleCount: field.femaleCount || 0,
    }));
  }, [fieldsData, fieldId, specificFieldData]);

  const chartTitle = useMemo(() => {
    if (fieldId && specificFieldData) {
      if (
        specificFieldData.cnuGroups &&
        specificFieldData.cnuGroups.length > 0
      ) {
        return `Groupes CNU de ${
          specificFieldData.fieldLabel || specificFieldData.field_label
        }`;
      }
      return `Répartition des effectifs: ${
        specificFieldData.fieldLabel || specificFieldData.field_label
      }`;
    }
    return "Répartition des effectifs par discipline";
  }, [fieldId, specificFieldData]);

  return (
    <Container as="main">
      <Breadcrumb className="fr-m-0 fr-mt-1w">
        <Link href="/personnel-enseignant">Personnel enseignant</Link>
        <Link href="/personnel-enseignant/discipline/vue-d'ensemble/">
          Vue disciplinaire
        </Link>
        <Link>
          <strong>{specificFieldData.fieldLabel}</strong>
        </Link>
      </Breadcrumb>

      <Title as="h2" look="h4" className="fr-mt-4w">
        {pageTitle}
      </Title>

      <p className="fr-text fr-mb-3w">
        {fieldId
          ? "Cette visualisation montre la répartition détaillée au sein de cette discipline."
          : "Cette visualisation montre la répartition des effectifs entre les différentes disciplines. La taille de chaque bloc représente le nombre d'enseignants, et la couleur indique la proportion femmes/hommes."}
      </p>

      {availableYears.length > 0 && (
        <div className="fr-mb-3w">
          <YearSelector
            years={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
      )}

      <Row gutters>
        <Col md={12}>
          <div className="fr-card fr-p-3w">
            <TreemapChart
              data={treemapData}
              title={chartTitle}
              year={displayYear}
              isLoading={allDataLoading || isLoading}
            />
          </div>
        </Col>
      </Row>
      <Row gutters>
        <Col md={12}>
          <div className="fr-card fr-p-3w">
            {!fieldId && (
              <Col md={6}>
                <div className="fr-card fr-p-3w fr-mb-3w">
                  <Title as="h3" look="h6">
                    Répartition par statut
                  </Title>
                  <p className="fr-text--sm fr-mb-2w">
                    Composition des effectifs par discipline.
                  </p>
                  <DisciplineStatusStack
                    statusData={
                      allFieldsByStatusData
                        ? allFieldsByStatusData.map((item) => ({
                            ...item,
                            disciplines: item.disciplines?.map(
                              (discipline) => ({
                                ...discipline,
                                fieldLabel:
                                  discipline.fieldLabel || "Non spécifié",
                                totalCount: discipline.totalCount || 0,
                              })
                            ),
                          }))
                        : []
                    }
                    isLoading={allDataByStatusLoading || isLoading}
                    year={displayYear}
                    fieldId={fieldId}
                  />
                </div>
              </Col>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
