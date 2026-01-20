import { useSearchParams } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useFinanceYears } from "../../../api/common";
import { useFinanceEtablissementDetail } from "../../../api/api";
import PageHeader from "./page-header";
import SectionNavigation from "./section-navigation";
import {
  FinancementsSection,
  SanteFinancierSection,
  MoyensHumainsSection,
  EtudiantsSection,
  AnalysesSection,
} from "../sections/sections";
import CustomBreadcrumb from "../../../../../components/custom-breadcrumb";
import navigationConfig from "../../../navigation-config.json";

export default function EstablishmentView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedYear = searchParams.get("year") || "2024";
  const selectedEtablissement = searchParams.get("structureId") || "";
  const section = searchParams.get("section") || "ressources";

  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);

  const { data: detailData, isLoading } = useFinanceEtablissementDetail(
    selectedEtablissement,
    String(selectedYear || years[0] || ""),
    !!selectedEtablissement && !!(selectedYear || years[0])
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

  if (isLoading) {
    return (
      <Container fluid className="etablissement-selector__wrapper">
        <Container className="fr-py-4w">
          <p>Chargement des données...</p>
        </Container>
      </Container>
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
        />
      </Container>

      <Container className="fr-mt-4w">{renderSectionContent()}</Container>
    </main>
  );
}
