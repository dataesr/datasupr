import { Col, Row } from "@dataesr/dsfr-plus";

import { getYears } from "../../../utils";


export default function YearsSelector({
  selectedYearEnd,
  selectedYearStart,
  setSelectedYearEnd,
  setSelectedYearStart
}) {
  const years = getYears();

  return (
    <Row gutters className="form-row">
      <Col md={6}>
        <select
          name="fundings-year-start"
          id="fundings-year-start"
          className="fr-mb-2w fr-select"
          value={selectedYearStart}
          onChange={(e) => setSelectedYearStart(e.target.value)}
        >
          <option disabled value="">Sélectionnez une année de début</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </Col>
      <Col md={6}>
        <select
          name="fundings-year-end"
          id="fundings-year-end"
          className="fr-mb-2w fr-select"
          value={selectedYearEnd}
          onChange={(e) => setSelectedYearEnd(e.target.value)}
        >
          <option disabled value="">Sélectionnez une année de fin</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </Col>
    </Row>
  )
}