import { Col, Row } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import { years } from "../../utils";


export default function YearSelector() {
  const [searchParams, setSearchParams] = useSearchParams({});
  const year = searchParams.get("year") ?? "";

  const handleYearChange = (year: string) => {
    searchParams.set("year", year);
    setSearchParams(searchParams);
  };

  return (
    <Row gutters>
      <Col xs="4">
        <label className="fr-label">Année</label>
        <select
          className="fr-select"
          id="fundings-year"
          name="fundings-year"
          onChange={(e) => handleYearChange(e.target.value)}
          value={year}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </Col>
    </Row>
  );
}