import { useSearchParams } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useFinanceYears } from "../../../api/common";
import {
  useFinanceEtablissementDetail,
  useCheckMultipleEstablishments,
  useCheckEstablishmentExists,
} from "../../../api/api";
import PageHeader from "./page-header";
import SectionNavigation from "./section-navigation";
import {
  FinancementsSection,
  SanteFinancierSection,
  MoyensHumainsSection,
  EtudiantsSection,
  AnalysesSection,
  ImplantationsSection,
} from "../sections/sections";
import CustomBreadcrumb from "../../../../../components/custom-breadcrumb";
import navigationConfig from "../../../navigation-config.json";
import MultipleEstablishmentsSelector from "./multiple-establishments-selector";
import EstablishmentNotExistsAlert from "./establishment-not-exists-alert";

export default function EstablishmentView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedYear = searchParams.get("year") || "2024";
  const selectedEtablissement = searchParams.get("structureId") || "";
  const useHistorical = searchParams.get("useHistorical") === "true";
  const section = searchParams.get("section") || "ressources";

  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);

  const { data: multiplesData, isLoading: isCheckingMultiples } =
    useCheckMultipleEstablishments(
      selectedEtablissement,
      String(selectedYear || years[0] || ""),
      !!selectedEtablissement && !!(selectedYear || years[0]) && !useHistorical
    );

  const { data: existsData, isLoading: isCheckingExists } =
    useCheckEstablishmentExists(
      selectedEtablissement,
      String(selectedYear || years[0] || ""),
      !!selectedEtablissement && !!(selectedYear || years[0])
    );

  const showMultipleSelector =
    !useHistorical && multiplesData?.hasMultiples && !isCheckingMultiples;

  const showNotExistsAlert =
    existsData && !existsData.exists && existsData.etablissementActuel;

  const { data: detailData, isLoading } = useFinanceEtablissementDetail(
    selectedEtablissement,
    String(selectedYear || years[0] || ""),
    !!selectedEtablissement &&
      !!(selectedYear || years[0]) &&
      !showMultipleSelector &&
      !showNotExistsAlert,
    useHistorical
  );

  useEffect(() => {
    if (selectedEtablissement && !searchParams.get("section")) {
      const next = new URLSearchParams(searchParams);
      next.set("section", "ressources");
      setSearchParams(next, { replace: true });
    }
  }, [selectedEtablissement, searchParams, setSearchParams]);

  const handleClearSelection = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("structureId");
    next.delete("useHistorical");
    setSearchParams(next);
  };

  const handleSectionChange = (newSection: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("section", newSection);
    setSearchParams(next);
  };

  const handleYearChange = (year: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("year", year);
    next.delete("useHistorical");
    setSearchParams(next);
  };

  const renderSectionContent = () => {
    if (!detailData) return null;

    switch (section) {
      case "ressources":
        return (
          <FinancementsSection data={detailData} selectedYear={selectedYear} />
        );
      case "sante-financiere":
        return <SanteFinancierSection data={detailData} />;
      case "moyens-humains":
        return <MoyensHumainsSection data={detailData} />;
      case "diplomes-formations":
        return (
          <EtudiantsSection data={detailData} selectedYear={selectedYear} />
        );
      case "implantations":
        return <ImplantationsSection data={detailData} />;
      case "analyses":
        return (
          <AnalysesSection
            data={detailData}
            selectedEtablissement={selectedEtablissement}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading || isCheckingMultiples || isCheckingExists) {
    return (
      <Container fluid className="etablissement-selector__wrapper">
        <Container className="fr-py-4w">
          <p>Chargement des données...</p>
        </Container>
      </Container>
    );
  }

  if (showNotExistsAlert && existsData?.etablissementActuel) {
    return (
      <EstablishmentNotExistsAlert
        etablissementLibHistorique={
          existsData.etablissement_lib_historique || selectedEtablissement
        }
        etablissementActuel={existsData.etablissementActuel}
        selectedYear={selectedYear}
      />
    );
  }

  if (showMultipleSelector && multiplesData) {
    return (
      <main>
        <Container fluid className="etablissement-selector__wrapper">
          <Container as="section">
            <Row>
              <Col>
                <CustomBreadcrumb config={navigationConfig} />
              </Col>
            </Row>
          </Container>
        </Container>
        <MultipleEstablishmentsSelector
          etablissements={multiplesData.etablissements}
          selectedYear={selectedYear}
          etablissementActuelLib={
            multiplesData.etablissements[0]?.etablissement_actuel_lib || ""
          }
        />
      </main>
    );
  }

  if (!detailData) {
    return null;
  }

  return (
    <main>
      <Container fluid className="etablissement-selector__wrapper">
        <Container as="section">
          <Row>
            <Col>
              <CustomBreadcrumb config={navigationConfig} />
            </Col>
          </Row>
          <Row>
            <Col>
              <PageHeader data={detailData} onClose={handleClearSelection} />
            </Col>
          </Row>
        </Container>
      </Container>

      <Container as="section">
        <SectionNavigation
          activeSection={section}
          years={years}
          selectedYear={selectedYear}
          onSectionChange={handleSectionChange}
          onYearChange={handleYearChange}
          data={detailData}
        />
      </Container>

      <Container className="fr-mt-4w">{renderSectionContent()}</Container>
    </main>
  );
}
