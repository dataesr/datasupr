import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Notice,
} from "@dataesr/dsfr-plus";
import { useParams } from "react-router-dom";
import useFacultyMembersByFields from "../api/use-by-fields";
import YearSelector from "../../../filters";
import { Link } from "@dataesr/dsfr-plus";
import { TreemapChart } from "./charts/treemap";
import useFacultyMembersByStatus from "../api/use-by-status";
import { GenderDataCard } from "./components/gender-info";
import DisciplineBarChart from "./charts/fields-bar";

export function FieldsTypologie() {
  const { fieldId } = useParams<{ fieldId: string }>();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const { data: allFieldsData } = useFacultyMembersByFields(undefined, true);

  const { data: allFieldsByStatusData } =
    useFacultyMembersByStatus(selectedYear);

  const { data: fieldsData } = useFacultyMembersByFields(selectedYear);

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

  const specificFieldData = useMemo(() => {
    if (!fieldId || !fieldsData) return null;
    return fieldsData.find(
      (d) => d.fieldId === fieldId || d.field_id === fieldId
    );
  }, [fieldsData, fieldId]);

  const pageTitle = useMemo(() => {
    if (fieldId && specificFieldData) {
      return `Typologie de la discipline ${
        specificFieldData.fieldLabel || specificFieldData.field_label
      }`;
    }
    return "Typologie du personnel enseignant par discipline";
  }, [fieldId, specificFieldData]);

  const shareTitulaire =
    allFieldsByStatusData?.[0]?.aggregatedStats?.titulairesPercent;

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
              <strong>
                {specificFieldData?.fieldLabel ??
                  "Typologie du personnel enseignant"}
              </strong>
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
        {shareTitulaire == 100 && (
          <Notice closeMode={"disallow"} type={"warning"}>
            Les données des personnels enseignants non permanents ne sont pas
            prises en compte pour l'année {selectedYear} car elles ne sont pas
            disponibles.
          </Notice>
        )}
        <Title as="h3" look="h5" className="fr-mt-2w">
          {pageTitle}
        </Title>
      </Row>

      <Row gutters>
        <Col md={6}>
          <GenderDataCard selectedYear={selectedYear} gender="hommes" />
        </Col>
        <Col md={6}>
          <GenderDataCard selectedYear={selectedYear} gender="femmes" />
        </Col>
        {!fieldId && (
          <Col md={12}>
            <DisciplineBarChart selectedYear={selectedYear} />
          </Col>
        )}
      </Row>
      <Row gutters>
        <Col md={12}>
          <TreemapChart selectedYear={selectedYear} />
        </Col>
      </Row>
      {fieldId && (
        <Row gutters>
          <Col md={12}>
            <Title as="h4" look="h6" className="fr-mt-2w">
              Statut des enseignants par discipline
            </Title>
            <DisciplineBarChart selectedYear={selectedYear} />
          </Col>
        </Row>
      )}
    </Container>
  );
}
