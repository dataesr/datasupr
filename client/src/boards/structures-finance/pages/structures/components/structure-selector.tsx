import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useStructuresFilters } from "../hooks";
import { useFinanceYears } from "../../../api/common";
import SelectionUI from "./selection-ui";
import CardSimple from "../../../../../components/card-simple";
import Breadcrumb from "../../../../financements-par-aap/components/breadcrumb";
import DefaultSkeleton from "../../../../../components/charts-skeletons/default";

export default function StructureSelection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: yearsData, isLoading: isLoadingYears } = useFinanceYears();
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
    isLoading: isLoadingStructures,
  } = useStructuresFilters({
    selectedYear: latestYear,
    selectedType,
    selectedRegion,
    selectedTypologie,
    selectedRce,
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
                  <CardSimple
                    description={region}
                    onClick={() => handleEtablissementSelect(id)}
                    stat={studentCount}
                    subtitle={type}
                    title={displayName}
                    year={year}
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
