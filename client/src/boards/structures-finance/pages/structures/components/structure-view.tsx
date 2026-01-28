import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useFinanceYears } from "../../../api/common";
import {
  useFinanceStructureDetail,
  useCheckMultipleStructures,
  useCheckStructureExists,
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
  PositionnementSection,
} from "../sections/sections";
import Breadcrumb from "../../../../financements-par-aap/components/breadcrumb";
import StructureNotExistsAlert from "./structure-not-exists-alert";
import MultipleStructuresSelector from "./multiple-structures-selector";

export default function StructureView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedYear = searchParams.get("year") || "2024";
  const selectedStructure = searchParams.get("structureId") || "";
  const useHistorical = searchParams.get("useHistorical") === "true";
  const section = searchParams.get("section") || "ressources";

  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);

  const { data: multiplesData, isLoading: isCheckingMultiples } =
    useCheckMultipleStructures(
      selectedStructure,
      String(selectedYear || years[0] || ""),
      !!selectedStructure && !!(selectedYear || years[0]) && !useHistorical
    );

  const { data: existsData, isLoading: isCheckingExists } =
    useCheckStructureExists(
      selectedStructure,
      String(selectedYear || years[0] || ""),
      !!selectedStructure && !!(selectedYear || years[0])
    );

  const showMultipleSelector =
    !useHistorical && multiplesData?.hasMultiples && !isCheckingMultiples;

  const showNotExistsAlert =
    existsData && !existsData.exists && existsData.etablissementActuel;

  const { data: detailData, isLoading } = useFinanceStructureDetail(
    selectedStructure,
    String(selectedYear || years[0] || ""),
    !!selectedStructure &&
      !!(selectedYear || years[0]) &&
      !showMultipleSelector &&
      !showNotExistsAlert,
    useHistorical
  );

  const handleClearSelection = () => {
    const params = Object.fromEntries(searchParams);
    delete params.structureId;
    delete params.useHistorical;
    setSearchParams(params);
  };

  const handleSectionChange = (newSection: string) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      section: newSection,
    });
  };

  const handleYearChange = (year: string) => {
    const params = Object.fromEntries(searchParams);
    params.year = year;
    delete params.useHistorical;
    setSearchParams(params);
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
      case "positionnement":
        return (
          <PositionnementSection
            data={detailData}
            selectedYear={selectedYear}
          />
        );
      case "analyses":
        return (
          <AnalysesSection
            data={detailData}
            selectedStructure={selectedStructure}
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
      <StructureNotExistsAlert
        etablissementLibHistorique={
          existsData.etablissement_lib_historique || selectedStructure
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
                <Breadcrumb
                  items={[
                    { label: "Accueil", href: "/structures-finance/accueil" },
                    {
                      label:
                        multiplesData.etablissements[0]
                          ?.etablissement_actuel_lib || "Établissement",
                    },
                  ]}
                />
              </Col>
            </Row>
          </Container>
        </Container>
        <MultipleStructuresSelector
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
              <Breadcrumb
                items={[
                  { label: "Accueil", href: "/structures-finance/accueil" },
                  {
                    label:
                      detailData?.etablissement_lib ||
                      detailData?.etablissement_actuel_lib ||
                      "Établissement",
                  },
                ]}
              />
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
