import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";

import DefaultSkeleton from "../../../../../components/charts-skeletons/default.tsx";
import { getIdFromName, getLabelFromName } from "../../../utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function LaboratoriesSelector({
  selectedLaboratoryId,
  setSelectedLaboratoryId
}) {
  const bodyLaboratories = {
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
              participant_type: "laboratory"
            }
          }
        ]
      }
    },
    aggregations: {
      by_laboratory: {
        terms: {
          field: "participant_id_name.keyword",
          size: 100
        }
      }
    }
  }

  const { data: dataLaboratories, isLoading: isLoadingLaboratories } = useQuery({
    queryKey: ['fundings-laboratories'],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-participations`, {
        body: JSON.stringify(bodyLaboratories),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  if (isLoadingLaboratories || !dataLaboratories) return <DefaultSkeleton />;

  const laboratories = dataLaboratories.aggregations.by_laboratory.buckets.map((laboratory) => ({ id: getIdFromName(laboratory.key), key: laboratory.key, name: getLabelFromName(laboratory.key) }));

  return (
    <Row gutters className="form-row">
      <Col md={12}>
        <select
          name="fundings-laboratory"
          id="fundings-laboratory"
          className="fr-mb-2w fr-select"
          value={selectedLaboratoryId}
          onChange={(e) => setSelectedLaboratoryId(e.target.value)}
        >
          <option disabled value="">Sélectionnez un laboratoire</option>
          {laboratories.map((laboratory) => (
            <option key={laboratory.key} value={laboratory.key}>
              {laboratory.name}
            </option>
          ))}
        </select>
      </Col>
    </Row>
  )
}