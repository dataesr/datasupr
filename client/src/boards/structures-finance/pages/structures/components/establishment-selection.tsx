import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useStructuresFilters } from "../hooks";
import SelectionUI from "./selection-ui";
import CustomBreadcrumb from "../../../../../components/custom-breadcrumb";
import navigationConfig from "../../../navigation-config.json";

export default function EstablishmentSelection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedYear = searchParams.get("year") || "2024";
  const selectedRegion = searchParams.get("region") || "toutes";

  const [selectedType, setSelectedType] = useState("tous");
  const [selectedTypologie, setSelectedTypologie] = useState("toutes");

  const {
    availableTypes,
    availableRegions,
    availableTypologies,
    filteredEtablissements,
  } = useStructuresFilters({
    selectedYear,
    selectedType,
    selectedRegion,
    selectedTypologie,
  });

  const handleEtablissementSelect = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("structureId", id);
    next.set("section", "ressources");
    next.set("year", selectedYear || "2024");
    next.delete("type");
    next.delete("region");
    next.delete("typologie");
    setSearchParams(next);
  };

  const handleRegionChange = (region: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("region", region);
    next.delete("structureId");
    setSearchParams(next);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedTypologie("toutes");
    const next = new URLSearchParams(searchParams);
    next.delete("structureId");
    setSearchParams(next);
  };

  const handleTypologieChange = (typologie: string) => {
    setSelectedTypologie(typologie);
    const next = new URLSearchParams(searchParams);
    next.delete("structureId");
    setSearchParams(next);
  };

  return (
    <main>
      <Container fluid className="etablissement-selector__wrapper">
        <Container as="section" className="fr-py-4w">
          <Row>
            <Col>
              <CustomBreadcrumb config={navigationConfig} />
            </Col>
          </Row>
          <Row>
            <Col>
              <SelectionUI
                selectedType={selectedType}
                selectedTypologie={selectedTypologie}
                selectedRegion={selectedRegion}
                availableTypes={availableTypes}
                availableTypologies={availableTypologies}
                availableRegions={availableRegions}
                filteredEtablissements={filteredEtablissements}
                onTypeChange={handleTypeChange}
                onTypologieChange={handleTypologieChange}
                onRegionChange={handleRegionChange}
                onEtablissementSelect={handleEtablissementSelect}
              />
            </Col>
          </Row>
        </Container>
      </Container>
    </main>
  );
}
