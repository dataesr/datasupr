import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Col, Container, Row, Text } from "@dataesr/dsfr-plus";
import { useStructuresFilters } from "../hooks";
import { useFinanceYears } from "../../../api/common";
import { useFilters } from "../../../hooks/useFilters";
import SelectionUI from "./selection-ui";
import CardSimple from "../../../../../components/card-simple";
import Breadcrumb from "../../../../financements-par-aap/components/breadcrumb";
import DefaultSkeleton from "../../../../../components/charts-skeletons/default";

export default function StructureSelection() {
  const [, setSearchParams] = useSearchParams();

  const { data: yearsData, isLoading: isLoadingYears } = useFinanceYears();
  const latestYear = useMemo(() => {
    if (!yearsData?.years?.length) return "2024";
    return String(Math.max(...yearsData.years));
  }, [yearsData]);

  const {
    selectedType,
    selectedTypologie,
    selectedRegion,
    selectedRce,
    selectedDevimmo,
  } = useFilters();

  const {
    availableTypes,
    availableRegions,
    availableTypologies,
    filteredEtablissements,
    isLoading: isLoadingStructures,
  } = useStructuresFilters({
    selectedYear: latestYear,
    selectedType: selectedType || "tous",
    selectedRegion: selectedRegion || "toutes",
    selectedTypologie: selectedTypologie || "toutes",
    selectedRce: selectedRce || "tous",
    selectedDevimmo: selectedDevimmo || "tous",
  });

  const isLoading = isLoadingYears || isLoadingStructures;

  const handleEtablissementSelect = (id: string) => {
    setSearchParams({
      structureId: id,
      section: "ressources",
      year: "2024",
    });
  };

  return (
    <main>
      <Container fluid className="etablissement-selector__wrapper">
        <Container as="section">
          <Row>
            <Col>
              <Breadcrumb
                items={[
                  { label: "Accueil", href: "/structures-finance/accueil" },
                  { label: "Sélectionner un établissement" },
                ]}
              />
            </Col>
          </Row>
          {isLoading ? (
            <Row>
              <Col>
                <DefaultSkeleton height="200px" />
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <SelectionUI
                  availableTypes={availableTypes}
                  availableTypologies={availableTypologies}
                  availableRegions={availableRegions}
                  filteredEtablissements={filteredEtablissements}
                  onEtablissementSelect={handleEtablissementSelect}
                />
              </Col>
            </Row>
          )}
        </Container>
      </Container>

      {!isLoading && filteredEtablissements.length > 0 && (
        <Container
          as="section"
          className="fr-py-4w"
          aria-label="Résultats de recherche"
        >
          <Text size="sm" className="fr-mb-2w" aria-live="polite">
            {filteredEtablissements.length} établissement
            {filteredEtablissements.length > 1 ? "s" : ""} trouvé
            {filteredEtablissements.length > 1 ? "s" : ""}
          </Text>
          <Row gutters className="fr-raw-list">
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
                  <CardSimple
                    description={region}
                    onClick={() => handleEtablissementSelect(id)}
                    stat={studentCount}
                    subtitle={type}
                    title={displayName}
                    year={year}
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
