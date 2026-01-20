import { Col, Row } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import { years } from "../../utils";


export default function YearSelector() {
  const [searchParams, setSearchParams] = useSearchParams({});
  const year:string = searchParams.get("year") ?? years[years.length  - 1].toString();

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
          {[...years].sort((a, b) => b - a).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </Col>
    </Row>
  );
}