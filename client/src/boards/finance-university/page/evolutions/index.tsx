import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { useFinanceYears } from "../../api";
import SectionHeader from "../../layout/section-header";
import EtablissementSelector from "./components/etablissement-selector";
import MultiEtablissementsChart from "./charts/multi-etablissements";
import { DSFR_COLORS } from "../../constants/colors";
import { useMultipleEtablissementsEvolution } from "./hooks/useMultipleEtablissementsEvolution";

export default function EvolutionsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);
  const yearFromUrl = searchParams.get("year") || "";
  const [selectedYear, setSelectedYear] = useState<string>(yearFromUrl);
  const [selectedEtablissements, setSelectedEtablissements] = useState<
    string[]
  >([]);

  const evolutionQueries = useMultipleEtablissementsEvolution(
    selectedEtablissements
  );

  useEffect(() => {
    if (!years.length) return;
    const yearsStr = years.map(String);

    if (yearFromUrl && yearsStr.includes(yearFromUrl)) {
      if (selectedYear !== yearFromUrl) {
        setSelectedYear(yearFromUrl);
      }
      return;
    }

    const fallback = yearsStr[0];
    if (selectedYear !== fallback) {
      setSelectedYear(fallback);
    }

    const next = new URLSearchParams(searchParams);
    next.set("year", fallback);
    setSearchParams(next);
  }, [years, yearFromUrl, selectedYear, searchParams, setSearchParams]);

  const yearFilter = (
    <div className="fr-input-group fr-mb-0" style={{ minWidth: "240px" }}>
      <label className="fr-label" htmlFor="annee-exercice">
        Année de référence
      </label>
      <select
        className="fr-select"
        id="annee-exercice"
        name="annee-exercice"
        value={selectedYear}
        onChange={(e) => {
          setSelectedYear(e.target.value);
          const next = new URLSearchParams(searchParams);
          next.set("year", e.target.value);
          setSearchParams(next);
        }}
        disabled={!years.length}
      >
        {!years.length && <option>Chargement...</option>}
        {years.map((year) => (
          <option key={year} value={String(year)}>
            {`Exercice ${year}`}
          </option>
        ))}
      </select>
    </div>
  );

  const etablissementsWithData = useMemo(() => {
    return selectedEtablissements
      .map((id, idx) => {
        const query = evolutionQueries[idx];
        if (!query.data || !query.data.series) return null;

        return {
          id,
          nom:
            query.data.series[0]?.etablissement_actuel_lib ||
            query.data.series[0]?.etablissement_lib ||
            "Inconnu",
          series: query.data.series.map((point: any) => ({
            annee: point.annee,
            recettes_propres: point.recettes_propres || 0,
            scsp: point.scsp || 0,
          })),
        };
      })
      .filter(Boolean);
  }, [selectedEtablissements, evolutionQueries]);

  const isLoading = evolutionQueries.some((q) => q.isLoading);

  return (
    <Container fluid className="fr-px-2w fr-py-2w">
      <SectionHeader title="Évolutions comparées" />

      <Row gutters className="fr-mb-3w">
        <Col md="12">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              backgroundColor: DSFR_COLORS.backgroundAlt,
              borderRadius: "8px",
              border: `1px solid ${DSFR_COLORS.borderDefault}`,
            }}
          >
            <div>
              <h2 className="fr-h5 fr-mb-0">
                📈 Analyse comparative d'évolutions
              </h2>
              <p
                className="fr-text--sm fr-mb-0 fr-mt-1v"
                style={{ color: DSFR_COLORS.textDefault }}
              >
                Sélectionnez jusqu'à 5 établissements pour comparer leur
                évolution sur toute la période disponible
              </p>
            </div>
            {yearFilter}
          </div>
        </Col>
      </Row>

      <Row gutters>
        <Col md="12">
          <EtablissementSelector
            selectedYear={selectedYear}
            selectedEtablissements={selectedEtablissements}
            onSelectionChange={setSelectedEtablissements}
            maxSelection={5}
          />
        </Col>
      </Row>

      {isLoading && (
        <div
          className="fr-p-6w"
          style={{
            textAlign: "center",
            backgroundColor: DSFR_COLORS.backgroundAlt,
            borderRadius: "8px",
          }}
        >
          <p style={{ color: DSFR_COLORS.textDefault }}>
            Chargement des données d'évolution...
          </p>
        </div>
      )}

      {!isLoading && etablissementsWithData.length > 0 && (
        <Row gutters>
          <Col md="12">
            <MultiEtablissementsChart
              etablissements={etablissementsWithData as any}
            />
          </Col>
        </Row>
      )}

      {!isLoading &&
        selectedEtablissements.length > 0 &&
        etablissementsWithData.length === 0 && (
          <div
            className="fr-alert fr-alert--warning"
            style={{ textAlign: "center" }}
          >
            <p>
              Aucune donnée d'évolution disponible pour les établissements
              sélectionnés.
            </p>
          </div>
        )}

      {selectedEtablissements.length === 0 && !isLoading && (
        <div
          className="fr-p-6w"
          style={{
            textAlign: "center",
            backgroundColor: DSFR_COLORS.backgroundAlt,
            borderRadius: "8px",
            border: `2px dashed ${DSFR_COLORS.borderDefault}`,
          }}
        >
          <p className="fr-h6" style={{ color: DSFR_COLORS.textDefault }}>
            👆 Sélectionnez des établissements ci-dessus
          </p>
          <p className="fr-text--sm" style={{ color: DSFR_COLORS.textDefault }}>
            Les graphiques d'évolution comparative apparaîtront ici
          </p>
        </div>
      )}
    </Container>
  );
}
