import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
  Badge,
  Text,
} from "@dataesr/dsfr-plus";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import YearSelector from "../../filters";
import useFacultyMembersByFields from "./api/use-by-fields";
import GenderByDiscipline from "./charts/gender/gender";
import { DisciplineData, FieldData } from "../../types";
import CnuGroupsTable from "./table/cnu-group-table";
import CnuSectionsTable from "./table/cnu-section-table";

export default function SpecificFieldsOverview() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [disciplinesData, setDisciplinesData] = useState<DisciplineData[]>([]);
  const [specificFieldData, setSpecificFieldData] = useState<FieldData | null>(
    null
  );
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const { fieldId } = useParams<{ fieldId: string }>();

  const { data: allFieldsData, isLoading: allDataLoading } =
    useFacultyMembersByFields(undefined, true);

  const {
    data: fieldData,
    isLoading: dataLoading,
    isError,
    error,
  } = useFacultyMembersByFields(selectedYear);

  useEffect(() => {
    if (
      allFieldsData &&
      Array.isArray(allFieldsData) &&
      allFieldsData.length > 0
    ) {
      const filteredData = (allFieldsData as FieldData[]).filter(
        (field) => field.fieldId === fieldId
      );

      if (filteredData.length === 0) {
        return;
      }

      const uniqueYears = Array.from(
        new Set(filteredData.map((item) => item.year))
      );

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
  }, [allFieldsData, fieldId, selectedYear]);

  useEffect(() => {
    if (fieldData && Array.isArray(fieldData) && fieldId && selectedYear) {
      const foundField = (fieldData as FieldData[]).find(
        (field) => field.fieldId === fieldId && field.year === selectedYear
      );

      setSpecificFieldData(foundField || null);
    } else {
      setSpecificFieldData(null);
    }
  }, [fieldData, fieldId, selectedYear]);

  useEffect(() => {
    if (fieldData && Array.isArray(fieldData) && selectedYear) {
      const currentYearData = fieldData.filter(
        (item) =>
          item.year === selectedYear || item.academic_year === selectedYear
      );

      const transformedData = currentYearData
        .map((field) => {
          if (field.numberMan !== undefined) {
            return {
              fieldId: field.field_id,
              fieldLabel: field.field_label,
              maleCount: field.numberMan,
              femaleCount: field.numberWoman,
              unknownCount: field.numberUnknown || 0,
              totalCount:
                field.numberMan +
                field.numberWoman +
                (field.numberUnknown || 0),
            };
          } else {
            return {
              fieldId: field.fieldId,
              fieldLabel: field.fieldLabel,
              maleCount: field.maleCount,
              femaleCount: field.femaleCount,
              unknownCount: field.unknownCount || 0,
              totalCount:
                field.totalCount ||
                field.maleCount + field.femaleCount + (field.unknownCount || 0),
            };
          }
        })
        .sort((a, b) => b.totalCount - a.totalCount);

      setDisciplinesData(transformedData as DisciplineData[]);
    } else {
      setDisciplinesData([]);
    }
  }, [fieldData, selectedYear]);

  const isLoading = allDataLoading || dataLoading;
  if (isLoading) return <div>Chargement des données...</div>;
  if (isError) return <div>Erreur : {error?.message}</div>;

  if (!specificFieldData) {
    return (
      <Container as="main">
        <Row>
          <Col>
            <div className="fr-alert fr-alert--warning fr-my-5w">
              <p>
                Aucune donnée trouvée pour la discipline {fieldId} en{" "}
                {selectedYear}.
              </p>
              <p>
                Veuillez vérifier l'identifiant de la discipline ou sélectionner
                une autre année.
              </p>

              {availableYears.length > 0 && (
                <div className="fr-mt-3w">
                  <p>Années disponibles pour cette discipline:</p>
                  <YearSelector
                    years={availableYears}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  const fieldLabel = specificFieldData.fieldLabel;
  const cnuGroups = specificFieldData.cnuGroups || [];

  const cnuSections =
    cnuGroups?.flatMap((group) =>
      (group.cnuSections || []).map((section) => ({
        ...section,
        cnuGroupId: group.cnuGroupId,
        cnuGroupLabel: group.cnuGroupLabel,
        fieldId: specificFieldData.fieldId,
        fieldLabel: specificFieldData.fieldLabel,
      }))
    ) || [];

  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link href="/personnel-enseignant/discipline/vue-d'ensemble/">
              Vue disciplinaire
            </Link>
            <Link>
              <strong>{fieldLabel}</strong>
            </Link>
          </Breadcrumb>
          <Title as="h3" look="h5" className="fr-mt-5w">
            {fieldLabel} <Badge color="blue-cumulus">{fieldId}</Badge>
          </Title>
        </Col>
        <Col md={3} style={{ textAlign: "right" }}>
          <YearSelector
            years={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </Col>
      </Row>
      <Row className="text-center fr-mt-4w">
        <Col>
          <Text className="fr-mt-2w">
            <strong>Année universitaire</strong>
            <br />
            {selectedYear}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col md={12} style={{ textAlign: "center" }}>
          <GenderByDiscipline disciplinesData={disciplinesData} />
        </Col>
      </Row>
      <Row gutters className="fr-mt-5w">
        <Col md={12} className="text-center">
          <CnuGroupsTable cnuGroups={cnuGroups || []} />
        </Col>
        <i>
          <strong>Répartition par groupes CNU</strong>
          <br />
          Cette page présente la répartition des personnels enseignants par
          groupe CNU. Les données permettent d'analyser la distribution par
          genre et par champ disciplinaire universitaire.
        </i>
      </Row>
      <Col className="text-center">
        <CnuSectionsTable cnuSections={cnuSections} maxDisplay={30} />
      </Col>
      <i>
        <strong>Répartition par section CNU</strong>
        <br />
        Cette page présente la répartition des personnels enseignants par groupe
        CNU. Les données permettent d'analyser la distribution par genre et par
        champ disciplinaire universitaire.
      </i>
      <Row className="fr-mt-5w fr-mb-5w"></Row>
    </Container>
  );
}
