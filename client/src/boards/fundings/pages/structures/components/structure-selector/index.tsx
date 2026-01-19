import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import SearchableSelect from "../../../../../../components/searchable-select";
import { useState } from "react";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } =
  import.meta.env;


export default function StructureSelector({ setName }) {
  const [county, setCounty] = useState("*");
  const [searchParams, setSearchParams] = useSearchParams({});
  const structure = searchParams.get("structure") ?? "";

  const bodyCounties = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            term: {
              participant_isFrench: true,
            },
          },
          {
            term: {
              participant_status: "active",
            },
          },
          {
            term: {
              participant_type: "institution",
            },
          },
          {
            term: {
              "participant_kind.keyword": "Secteur public",
            },
          },
          {
            terms: {
              "project_type.keyword": [
                "ANR",
                "PIA ANR",
                "PIA hors ANR",
                "H2020",
                "Horizon Europe",
              ],
            },
          },
        ],
      },
    },
    aggregations: {
      by_county: {
        terms: {
          field: "address.region.keyword",
          order: { _key: "asc" },
          size: 30,
        },
      },
    },
  };

  const bodyStructures: any = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            term: {
              participant_isFrench: true,
            },
          },
          {
            term: {
              participant_status: "active",
            },
          },
          {
            term: {
              participant_type: "institution",
            },
          },
          {
            term: {
              "participant_kind.keyword": "Secteur public",
            },
          },
          {
            terms: {
              "project_type.keyword": [
                "ANR",
                "PIA ANR",
                "PIA hors ANR",
                "H2020",
                "Horizon Europe",
              ],
            },
          },
        ],
      },
    },
    aggregations: {
      by_structure: {
        terms: {
          field: "participant_id_name_default.keyword",
          size: 1500,
        },
      },
    },
  };
  if (county && county !== '*') {
    bodyStructures.query.bool.filter.push({ wildcard: { "address.region.keyword": county } });
  }

  const { data: dataCounties, isLoading: isLoadingCounties } = useQuery({
    queryKey: ["fundings-counties"],
    queryFn: () =>
      fetch(
        `${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS}`,
        {
          body: JSON.stringify(bodyCounties),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
        }
      ).then((response) => response.json()),
  });

  const { data: dataStructures, isLoading: isLoadingStructures } = useQuery({
    queryKey: ["fundings-structures", county],
    queryFn: () =>
      fetch(
        `${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS}`,
        {
          body: JSON.stringify(bodyStructures),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
        }
      ).then((response) => response.json()),
  });

  const counties = (dataCounties?.aggregations?.by_county?.buckets ?? []).map((bucket) => bucket.key);
  const structures =
    (dataStructures?.aggregations?.by_structure?.buckets ?? []).map((bucket) => {
      const [id, label] = bucket.key.split('###');
      return ({ id, label, searchableText: label.normalize('NFD').replace(/[\u0300-\u036f]/g, '') });
    }) || [];

  const handleStructureChange = (selectedStructure: string) => {
    setName(structures.find((item) => item.id === selectedStructure).label);
    searchParams.set("structure", selectedStructure.split('###')[0]);
    setSearchParams(searchParams);
  };

  if (structure && structure.length > 0) {
    const str = structures.find((item) => item.id === structure);
    if (str && str?.label) {
      setName(str.label);
    }
  }

  return (
    <Row gutters>
      <Col xs="12" sm="6" md="4">
        {isLoadingCounties ? <DefaultSkeleton height="70px" /> : (
          <div className="fr-select-group">
            <label className="fr-label">Région</label>
            <select
              aria-describedby="select-hint-messages"
              className="fr-select"
              id="select-hint"
              name="select-hint"
              onChange={(e) => setCounty(e.target.value)}
              value={county}
            >
              <option value="*">Toutes les régions</option>
              {counties.map((county: string) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
        )}
      </Col>

      <Col xs="12" sm="6" md="8">
        {isLoadingStructures ? <DefaultSkeleton height="70px" /> : (
          <>
            <label className="fr-label">Structure</label>
            <div className="fr-mt-1w">
              <SearchableSelect
                onChange={handleStructureChange}
                options={structures}
                placeholder="Rechercher une structure..."
                value={structure}
              />
            </div>
          </>
        )}
      </Col>
    </Row>
  );
}
