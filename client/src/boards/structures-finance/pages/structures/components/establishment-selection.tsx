import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useStructuresFilters } from "../hooks";
import { useFinanceYears } from "../../../api/common";
import SelectionUI from "./selection-ui";
import StructureCard from "../../../../../components/structure-card";
import StructuresBreadcrumb from "./structures-breadcrumb";

// SelectionUI -> rendre indépendant grace a l'url

export default function EstablishmentSelection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: yearsData } = useFinanceYears();
  const latestYear = useMemo(() => {
    if (!yearsData?.years?.length) return "2024";
    return String(Math.max(...yearsData.years));
  }, [yearsData]);

  const selectedRegion = searchParams.get("region") || "toutes";
  const selectedType = searchParams.get("type") || "tous";
  const selectedTypologie = searchParams.get("typologie") || "toutes";
  const selectedRce = searchParams.get("rce") || "tous";

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
    setSearchParams({
      structureId: id,
      section: "ressources",
      year: "2024",
    });
  };

  const handleRegionChange = (region: string) => {
    setSearchParams({
      region,
      type: selectedType,
      typologie: selectedTypologie,
      rce: selectedRce,
    });
  };

  const handleTypeChange = (type: string) => {
    setSearchParams({
      region: selectedRegion,
      type,
      typologie: "toutes",
      rce: selectedRce,
    });
  };

  const handleTypologieChange = (typologie: string) => {
    setSearchParams({
      region: selectedRegion,
      type: selectedType,
      typologie,
      rce: selectedRce,
    });
  };

  const handleRceChange = (rce: string) => {
    setSearchParams({
      region: selectedRegion,
      type: selectedType,
      typologie: selectedTypologie,
      rce,
    });
  };

  const handleResetFilters = () => {
    setSearchParams({ region: "toutes" });
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
          <ul
            className="fr-grid-row fr-grid-row--gutters"
            style={{ listStyle: "none", padding: 0 }}
          >
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
                <li key={id} className="fr-col-12 fr-col-md-6 fr-col-lg-4">
                  <StructureCard
                    title={displayName}
                    region={region}
                    studentCount={studentCount}
                    type={type}
                    year={year}
                    onClick={() => handleEtablissementSelect(id)}
                  />
                </li>
              );
            })}
          </ul>
        </Container>
      )}
    </main>
  );
}
