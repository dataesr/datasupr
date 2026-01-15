import { Col, Row } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";


export default function SelectedStructure({ name }: { name: string }) {
  const [searchParams, setSearchParams] = useSearchParams({});
  const year = searchParams.get("year") ?? "";
  const years = Array.from(Array(10).keys()).map((item) => item + 2015);

  const handleYearChange = (year: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('year', year);
    setSearchParams(next);
  };

  return (
    <div>
      <Row gutters>
        <Col xs="12" sm="6" md="8">
          {name}
        </Col>
        <Col  xs="12" sm="6" md="4">
          <select
            className="fr-select"
            id="fundings-year"
            name="fundings-year"
            onChange={(e) => handleYearChange(e.target.value)}
            value={year}
          >
            <option disabled value="">
              Sélectionnez une année de début
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Col>
      </Row>
    </div>
  );
}