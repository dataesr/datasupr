import { Col, DismissibleTag, Row, TagGroup } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { useState } from "react";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import SearchableSelect from "../../../../../../components/searchable-select/index.tsx";
import { funders } from "../../../../utils.ts";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function StructuresSelector() {
  const [county, setCounty] = useState("*");
  const [searchParams, setSearchParams] = useSearchParams({});
  const selectedStructures: string[] = searchParams.getAll("structure");

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
              "project_type.keyword": funders,
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
              "project_type.keyword": funders,
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
  const bodyStructuresAll = JSON.parse(JSON.stringify(bodyStructures));
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

  const { data: dataStructuresAll, isLoading: isLoadingStructuresAll } = useQuery({
    queryKey: ["fundings-structures"],
    queryFn: () =>
      fetch(
        `${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS}`,
        {
          body: JSON.stringify(bodyStructuresAll),
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
  const structuresAll = (dataStructuresAll?.aggregations?.by_structure?.buckets ?? []).map((bucket) => {
    const [id, label] = bucket.key.split('###');
    return ({ id, label });
  }) || [];

  const handleStructureChange = (selectedStructure: string) => {
    const selectedStructureId = selectedStructure.split('###')[0];
    if (!selectedStructures.includes(selectedStructureId)) {
      searchParams.append("structure", selectedStructureId);
      setSearchParams(searchParams);
    }
  };

  const handleTagClick = (selectedStructure: string) => {
    searchParams.delete("structure", selectedStructure);
    setSearchParams(searchParams);
  };

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
        {(isLoadingStructures || isLoadingStructuresAll) ? <DefaultSkeleton height="70px" /> : (
          <>
            <label className="fr-label">Structure</label>
            <div className="fr-mt-1w">
              <SearchableSelect
                onChange={handleStructureChange}
                options={structures}
                placeholder="Ajouter une structure..."
                value={""}
              />
            </div>
            <TagGroup className="fr-mt-1w">
              {selectedStructures.map((selectedStructure) => (
                <DismissibleTag key={selectedStructure} onClick={() => handleTagClick(selectedStructure)}>
                  {structuresAll.find((item) => item.id === selectedStructure)?.label}
                </DismissibleTag>
              ))}
            </TagGroup>
          </>
        )}
      </Col>
    </Row>
  );
}
