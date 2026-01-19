import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "@dataesr/dsfr-plus";
import { useMemo, useState } from "react";
import { useFinanceYears } from "../../api/common";
import { useFinanceEtablissements } from "./api";
import SearchableSelect from "../../../../components/searchable-select";
import "./styles.scss";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="accueil-hero">
      <Container>
        <Row>
          <Col xs="12" lg="6">
            <div className="accueil-hero__text">
              <p className="accueil-hero__label">FINANCES DES ÉTABLISSEMENTS</p>
              <h1 className="accueil-hero__title">
                Explorez les données financières de l'enseignement supérieur
              </h1>
              <p className="accueil-hero__description">
                Consultez et analysez les données financières des universités et
                établissements d'enseignement supérieur français. Visualisez les
                tendances nationales et les indicateurs clés.
              </p>
              <div className="accueil-hero__cta">
                <button
                  className="fr-btn fr-btn--icon-right fr-icon-arrow-right-line"
                  onClick={() => navigate("/structures-finance/national")}
                >
                  Vue nationale
                </button>
                <button
                  className="fr-btn fr-btn--icon-right fr-icon-arrow-right-line"
                  onClick={() => navigate("/structures-finance/etablissements")}
                >
                  Situation d’un établissement{" "}
                </button>
              </div>
            </div>
          </Col>
          <Col xs="12" lg="6">
            <div className="accueil-hero__illustration">
              <img
                src="/artwork/pictograms/institutions/money.svg"
                alt=""
                aria-hidden="true"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

// =============================================================================
// QUICK ACCESS SECTION
// =============================================================================

function QuickAccessSection() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const { data: yearsData } = useFinanceYears();
  const latestYear = useMemo(
    () => (yearsData?.years || [])[0] || "2024",
    [yearsData]
  );
  const { data: etablissementsData } = useFinanceEtablissements(
    String(latestYear)
  );

  const etablissementOptions = useMemo(() => {
    if (!etablissementsData || !Array.isArray(etablissementsData)) return [];

    return etablissementsData
      .map((etab: any) => {
        const displayName = etab.nom || "";
        const searchText = [displayName, etab.type, etab.region]
          .filter(Boolean)
          .join(" ");

        return {
          id: etab.id,
          label: `${displayName}${etab.region ? ` — ${etab.region}` : ""}`,
          searchableText: searchText,
          subtitle: etab.type,
        };
      })
      .sort((a, b) => {
        return a.label.localeCompare(b.label, "fr", { sensitivity: "base" });
      });
  }, [etablissementsData]);

  const handleEtablissementSelect = (etablissementId: string) => {
    navigate(
      `/structures-finance/etablissements?year=2024&type=tous&region=toutes&structureId=${etablissementId}`
    );
    setSearchValue("");
  };

  return (
    <section className="accueil-section accueil-section--alt">
      <Container>
        <Row>
          <Col xs="12" lg="8" offsetLg="2">
            <div className="accueil-quick-access">
              <h2 className="accueil-section__title">Accès rapide</h2>
              <p className="accueil-section__description">
                Accédez directement aux données financières détaillées d’un
                établissement
              </p>
              <div className="accueil-quick-access__search">
                <SearchableSelect
                  options={etablissementOptions}
                  value={searchValue}
                  onChange={handleEtablissementSelect}
                  placeholder="Rechercher un établissement..."
                  label=""
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default function AccueilView() {
  return (
    <div className="accueil-page">
      <HeroSection />
      <QuickAccessSection />
    </div>
  );
}
