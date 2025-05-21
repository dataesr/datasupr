import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Title, Breadcrumb, Notice } from "@dataesr/dsfr-plus";
import { useParams } from "react-router-dom";
import useFacultyMembersByFields from "../api/use-by-fields";
import YearSelector from "../../../filters";
import { Link } from "@dataesr/dsfr-plus";
import { TreemapChart } from "./charts/treemap";
import useFacultyMembersByStatus from "../api/use-by-status";
import useFacultyMembersGenderComparison from "../api/use-by-gender";
import { GenderDataCard } from "./components/gender-info";
import DisciplineBarChart from "./charts/fields-bar";
import StackStatusPerDisciplineBar from "./charts/stack-status-per-discipline/stack-status-per-discipline";

export function FieldsTypologie() {
  const { fieldId } = useParams<{ fieldId: string }>();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const { data: allFieldsData, isLoading: allDataLoading } =
    useFacultyMembersByFields(undefined, true);
  const { data: allFieldsByStatusData, isLoading: allDataByStatusLoading } =
    useFacultyMembersByStatus(selectedYear);

  const { data: fieldsData, isLoading } =
    useFacultyMembersByFields(selectedYear);

  const { data: genderComparisonData, isLoading: genderDataLoading } =
    useFacultyMembersGenderComparison({
      selectedYear,
      disciplineCode: fieldId,
    });

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

  const genderData = useMemo(() => {
    if (!genderComparisonData) return null;

    if (Array.isArray(genderComparisonData)) {
      if (fieldId) {
        return genderComparisonData.find(
          (item) => item.discipline?.code === fieldId
        );
      }
      return genderComparisonData[0];
    }

    return genderComparisonData;
  }, [genderComparisonData, fieldId]);

  const pageTitle = useMemo(() => {
    if (fieldId && specificFieldData) {
      return `Typologie de la discipline ${
        specificFieldData.fieldLabel || specificFieldData.field_label
      }`;
    }
    return "Typologie du personnel enseignant par discipline";
  }, [fieldId, specificFieldData]);

  const treemapData = useMemo(() => {
    if (!fieldsData) return [];

    let dataToProcess = fieldsData;
    if (fieldId) {
      if (specificFieldData) {
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

  const allDisciplines = genderData?.allDisciplines || [];

  const prepareChartData = (allDisciplines) => {
    if (
      !allDisciplines ||
      !Array.isArray(allDisciplines) ||
      allDisciplines.length === 0
    ) {
      return [];
    }

    return allDisciplines.map((disc) => ({
      discipline: disc.discipline.label,
      disciplineCode: disc.discipline.code,
      hommesCount: disc.hommes.total_count,
      hommesPercent: Math.round(
        (disc.hommes.total_count / disc.total_count) * 100
      ),
      femmesCount: disc.femmes.total_count,
      femmesPercent: Math.round(
        (disc.femmes.total_count / disc.total_count) * 100
      ),
    }));
  };

  const shareTitulaire = allFieldsByStatusData?.[0]?.aggregatedStats?.titulairesPercent;

  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-pt-3w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link href="/personnel-enseignant/discipline/vue-d'ensemble/">
              Vue disciplinaire
            </Link>
            <Link>
              <strong>{specificFieldData?.fieldLabel ?? "Typologie du personnel enseignant"}</strong>
            </Link>
          </Breadcrumb>
        </Col>
        <Col md={3} style={{ textAlign: "right" }}>
          {availableYears.length > 0 && (
            <YearSelector
              years={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          )}
        </Col>
      </Row>

      <Row className="fr-mt-3w">
          {shareTitulaire == 100 &&(
            <Notice closeMode={"disallow"} type={"warning"}>
              Les données des personnels enseignants non permanents ne sont pas prises en compte
              pour l'année {selectedYear} car elles ne sont pas disponibles.
            </Notice>
            )}
            <Title as="h3" look="h5"className="fr-mt-2w">
             {pageTitle}
          </Title>
      </Row>

      <Row gutters>
        <Col md={6}>
          <GenderDataCard
            data={genderData}
            gender="hommes"
            isLoading={genderDataLoading}
            allDisciplines={allDisciplines}
          />
        </Col>
        <Col md={6}>
          <GenderDataCard
            data={genderData}
            gender="femmes"
            isLoading={genderDataLoading}
            allDisciplines={allDisciplines}
          />
        </Col>
        {allDisciplines && !fieldId && (
          <Col md={12}>
            <DisciplineBarChart
              disciplines={prepareChartData(allDisciplines)}
            />
          </Col>
        )}
      </Row>

      <Row gutters>
        <Col md={12}>
          <div>
            <TreemapChart
              data={treemapData}
              title={chartTitle}
              year={displayYear}
              isLoading={allDataLoading || isLoading}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <StackStatusPerDisciplineBar
            statusData={allFieldsByStatusData || allDataByStatusLoading}
            selectedYear={selectedYear}
          />
        </Col>
      </Row>
    </Container>
  );
}
