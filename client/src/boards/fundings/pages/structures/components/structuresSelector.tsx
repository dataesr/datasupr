import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";

import DefaultSkeleton from "../../../../../components/charts-skeletons/default.tsx";
import { getLabelFromName } from "../../../utils";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function StructuresSelector({
  selectedStructureId,
  setSelectedStructureId
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
          {
            term: {
              participant_type: "institution"
            }
          }
        ]
      }
    },
    aggregations: {
      by_structure: {
        terms: {
          field: "participant_id_name.keyword",
          size: 100
        }
      }
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-structures'],
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
  const structures = data.aggregations.by_structure.buckets.map((structure) => ({ id: structure.key, name: getLabelFromName(structure.key) }));

  return (
    <Row gutters className="form-row">
      <Col md={12}>
        <select
          name="fundings-structure"
          id="fundings-structure"
          className="fr-mb-2w fr-select"
          value={selectedStructureId}
          onChange={(e) => setSelectedStructureId(e.target.value)}
        >
          <option disabled value="">Sélectionnez une structure</option>
          {structures.map((structure) => (
            <option key={structure.id} value={structure.id}>
              {structure.name}
            </option>
          ))}
        </select>
      </Col>
    </Row>
  )
}