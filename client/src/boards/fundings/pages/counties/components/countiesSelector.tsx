import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";

import DefaultSkeleton from "../../../../../components/charts-skeletons/default.tsx";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function CountiesSelector({
  selectedCounty,
  setSelectedCounty
}) {
  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            term: {
              participant_isFrench: true
            }
          },
          {
            term: {
              participant_status: "active"
            }
          },
        ]
      }
    },
    aggregations: {
      by_county: {
        terms: {
          field: "address.region.keyword",
          size: 100
        }
      }
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-counties'],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-participations`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  if (isLoading || !data) return <DefaultSkeleton />;
  const counties = data.aggregations?.by_county?.buckets.map((structure) => structure.key) || [];

  return (
    <Row gutters className="form-row">
      <Col md={12}>
        <select
          name="fundings-structure"
          id="fundings-structure"
          className="fr-mb-2w fr-select"
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
        >
          <option disabled value="">Sélectionnez une structure</option>
          {counties.map((county: string) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </Col>
    </Row>
  )
}