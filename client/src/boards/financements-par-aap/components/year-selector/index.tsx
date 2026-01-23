import { Alert, Col, Row } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import { years } from "../../utils";


export default function YearSelector() {
  const [searchParams, setSearchParams] = useSearchParams({});
  const yearMax: string = searchParams.get("yearMax") ?? String(years[years.length - 2]);
  const yearMin: string = searchParams.get("yearMin") ?? String(years[years.length - 2]);

  const handleYearMaxChange = (year: string) => {
    searchParams.set("yearMax", year);
    setSearchParams(searchParams);
  };

  const handleYearMinChange = (year: string) => {
    searchParams.set("yearMin", year);
    setSearchParams(searchParams);
  };

  return (
    <Row gutters>
      <Col xs="3">
        <label className="fr-label">Année de début</label>
        <select
          className="fr-select"
          id="fundings-year-min"
          name="fundings-year-min"
          onChange={(e) => handleYearMinChange(e.target.value)}
          value={yearMin}
        >
          {[...years].sort((a, b) => b - a).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </Col>
      <Col xs="3">
        <label className="fr-label">Année de fin</label>
        <select
          className="fr-select"
          id="fundings-year-max"
          name="fundings-year-max"
          onChange={(e) => handleYearMaxChange(e.target.value)}
          value={yearMax}
        >
          {[...years].sort((a, b) => b - a).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </Col>
      {(Number(yearMax) >= 2024 && Number(yearMin) <= 2025) && (
        <Col xs="6">
          <Alert variant="warning" title="Attention" description="Les sources disponibles ne fournissent que des données provisoires pour 2024 et 2025" size="sm" />
        </Col>
      )}
      {(Number(yearMin) > Number(yearMax)) && (
        <Col xs="6">
          <Alert variant="error" title="Erreur" description="L'année de fin doit être supérieure ou égale à l'année de début" size="sm" />
        </Col>
      )}
    </Row>
  );
}
