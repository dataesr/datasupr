import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useStructuresFilters } from "../hooks";
import { useFinanceYears } from "../../../api/common";
import SelectionUI from "./selection-ui";
import StructureCard from "../../../../../components/structure-card";
import StructuresBreadcrumb from "./structures-breadcrumb";

export default function EstablishmentSelection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: yearsData } = useFinanceYears();
  const latestYear = useMemo(() => {
    if (!yearsData?.years?.length) return "2024";
    return String(Math.max(...yearsData.years));
  }, [yearsData]);

  const selectedRegion = searchParams.get("region") || "toutes";

  const [selectedType, setSelectedType] = useState("tous");
  const [selectedTypologie, setSelectedTypologie] = useState("toutes");
  const [selectedRce, setSelectedRce] = useState("tous");

  const {
    availableTypes,
    availableRegions,
    availableTypologies,
    filteredEtablissements,
  } = useStructuresFilters({
    selectedYear: latestYear,
    selectedType,
    selectedRegion,
    selectedTypologie,
    selectedRce,
  });

  const handleEtablissementSelect = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("structureId", id);
    next.set("section", "ressources");
    next.set("year", "2024");
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

  const handleRceChange = (rce: string) => {
    setSelectedRce(rce);
    const next = new URLSearchParams(searchParams);
    next.delete("structureId");
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSelectedType("tous");
    setSelectedTypologie("toutes");
    setSelectedRce("tous");
    const next = new URLSearchParams(searchParams);
    next.set("region", "toutes");
    next.delete("structureId");
    setSearchParams(next);
  };

  return (
    <main>
      <Container fluid className="etablissement-selector__wrapper">
        <Container as="section">
          <Row>
            <Col>
              <StructuresBreadcrumb />
            </Col>
          </Row>
          <Row>
            <Col>
              <SelectionUI
                selectedType={selectedType}
                selectedTypologie={selectedTypologie}
                selectedRegion={selectedRegion}
                selectedRce={selectedRce}
                availableTypes={availableTypes}
                availableTypologies={availableTypologies}
                availableRegions={availableRegions}
                filteredEtablissements={filteredEtablissements}
                onTypeChange={handleTypeChange}
                onTypologieChange={handleTypologieChange}
                onRegionChange={handleRegionChange}
                onRceChange={handleRceChange}
                onEtablissementSelect={handleEtablissementSelect}
                onResetFilters={handleResetFilters}
              />
            </Col>
          </Row>
        </Container>
      </Container>

      {filteredEtablissements.length > 0 && (
        <Container className="fr-py-4w">
          <p className="fr-text--sm fr-mb-2w">
            {filteredEtablissements.length} établissement
            {filteredEtablissements.length > 1 ? "s" : ""} trouvé
            {filteredEtablissements.length > 1 ? "s" : ""}
          </p>
          <Row gutters>
            {filteredEtablissements.map((etab: any) => {
              const id =
                etab.etablissement_id_paysage ||
                etab.etablissement_id_paysage_actuel ||
                etab.id;
              const displayName = etab.etablissement_lib || "";
              const type = etab.etablissement_actuel_type || "";
              const region = etab.etablissement_actuel_region;
              const studentCount = etab.effectif_sans_cpge;
              const year = etab.anuniv;

              return (
                <Col key={id} xs="12" md="6" lg="4">
                  <StructureCard
                    title={displayName}
                    region={region}
                    studentCount={studentCount}
                    type={type}
                    year={year}
                    onClick={() => handleEtablissementSelect(id)}
                  />
                </Col>
              );
            })}
          </Row>
        </Container>
      )}
    </main>
  );
}
