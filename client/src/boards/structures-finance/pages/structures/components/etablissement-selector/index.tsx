import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import {
  useFinanceYears,
  useFinanceEtablissementDetail,
} from "../../../../api";
import Filters from "./Filters";
import InfoCard from "./InfoCard";
import "./styles.scss";

export default function EtablissementSelector() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);

  const defaultYear = useMemo(() => {
    if (!years.length) return "";
    return years.includes(2024) ? "2024" : String(years[0]);
  }, [years]);

  const selectedYear = searchParams.get("year") || defaultYear;
  const selectedEtablissement = searchParams.get("structureId") || "";

  const { data: detailData } = useFinanceEtablissementDetail(
    selectedEtablissement,
    String(selectedYear || years[0] || ""),
    !!selectedEtablissement && !!(selectedYear || years[0])
  );

  const handleClearSelection = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("structureId");
    setSearchParams(next);
  };

  return (
    <section
      className="etablissement-selector"
      aria-labelledby="selector-heading"
    >
      <Container fluid className="etablissement-selector__header">
        <Container>
          <Row gutters>
            <Col xs="12" lg={selectedEtablissement ? "6" : "12"}>
              <h2
                id="selector-heading"
                className="etablissement-selector__title"
              >
                Rechercher un établissement
              </h2>

              <Filters selectedEtablissement={selectedEtablissement} />
            </Col>

            {selectedEtablissement && detailData && (
              <Col xs="12" lg="6">
                <InfoCard data={detailData} onClose={handleClearSelection} />
              </Col>
            )}
          </Row>
        </Container>
      </Container>
    </section>
  );
}
