import { Badge, Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import SearchableSelect from "../../../../../../components/searchable-select/index.tsx";
import { getEsQuery } from "../../../../utils.ts";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function StructureSelector({ setName, setStructures }) {
  const [county, setCounty] = useState("*");
  const [typology, setTypology] = useState("*");
  const [searchParams, setSearchParams] = useSearchParams({});
  const structure = searchParams.get("structure") ?? "";

  const bodyCounties: any = {
    ...getEsQuery({}),
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
  if (typology && typology !== '*') {
    bodyCounties.query.bool.filter.push({ term: { "participant_typologie_1.keyword": typology } });
  }
  const { data: dataCounties, isLoading: isLoadingCounties } = useQuery({
    queryKey: ["fundings-counties", typology],
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
  const counties = (dataCounties?.aggregations?.by_county?.buckets ?? []).map((bucket) => bucket.key);

  const bodyTypologies: any = {
    ...getEsQuery({}),
    aggregations: {
      by_typology: {
        terms: {
          field: "participant_typologie_1.keyword",
          order: { _key: "desc" },
        },
      },
    },
  };
  if (county && county !== '*') {
    bodyTypologies.query.bool.filter.push({ term: { "address.region.keyword": county } });
  }
  const { data: dataTypologies, isLoading: isLoadingTypologies } = useQuery({
    queryKey: ["fundings-typologies", county],
    queryFn: () =>
      fetch(
        `${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS}`,
        {
          body: JSON.stringify(bodyTypologies),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
        }
      ).then((response) => response.json()),
  });
  const typologies = (dataTypologies?.aggregations?.by_typology?.buckets ?? []).map((bucket) => bucket.key);

  const bodyStructures: any = {
    ...getEsQuery({}),
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
    bodyStructures.query.bool.filter.push({ term: { "address.region.keyword": county } });
  }
  if (typology && typology !== '*') {
    bodyStructures.query.bool.filter.push({ term: { "participant_typologie_1.keyword": typology } });
  }
  const { data: dataStructures, isLoading: isLoadingStructures } = useQuery({
    queryKey: ["fundings-structures", county, typology],
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
  const structures =
    (dataStructures?.aggregations?.by_structure?.buckets ?? []).map((bucket) => {
      const [id, label] = bucket.key.split('###');
      return ({ id, label, searchableText: label.normalize('NFD').replace(/[\u0300-\u036f]/g, '') });
    }) || [];

  const handleStructureChange = (selectedStructure?: string) => {
    if (selectedStructure) {
      setName(structures.find((item) => item.id === selectedStructure).label);
      searchParams.set("structure", selectedStructure.split('###')[0]);
      setSearchParams(searchParams);
    }
  };

  if (structure && structure.length > 0) {
    const str = structures.find((item) => item.id === structure);
    if (str && str?.label) {
      setName(str.label);
    }
  }

  useEffect(() => {
    setStructures((dataStructures?.aggregations?.by_structure?.buckets ?? []).map((bucket) => {
      const [id, label] = bucket.key.split('###');
      return ({ id, label, searchableText: label.normalize('NFD').replace(/[\u0300-\u036f]/g, '') });
    }) || []);
  }, [dataStructures])

  return (
    <Row gutters>
      <Col xs="12" sm="3">
        {isLoadingCounties ? <DefaultSkeleton height="70px" /> : (
          <div className="fr-select-group">
            <label className="fr-label">
              Région
              <Badge className="fr-ml-1w">
                {counties.length}
              </Badge>
            </label>
            <select
              aria-describedby="select-county-messages"
              className="fr-select"
              id="select-county"
              name="select-county"
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

      <Col xs="12" sm="3">
        {isLoadingTypologies ? <DefaultSkeleton height="70px" /> : (
          <div className="fr-select-group">
            <label className="fr-label">
              Typologie
              <Badge className="fr-ml-1w">
                {typologies.length}
              </Badge>
            </label>
            <select
              aria-describedby="select-typology-messages"
              className="fr-select"
              id="select-typology"
              name="select-typology"
              onChange={(e) => setTypology(e.target.value)}
              value={typology}
            >
              <option value="*">Toutes les typologies</option>
              {typologies.map((typology: string) => (
                <option key={typology} value={typology}>
                  {typology}
                </option>
              ))}
            </select>
          </div>
        )}
      </Col>

      <Col xs="12" sm="6">
        {isLoadingStructures ? <DefaultSkeleton height="70px" /> : (
          <>
            <label className="fr-label">
              Etablissement
              <Badge className="fr-ml-1w">
                {structures.length}
              </Badge>
            </label>
            <div className="fr-mt-1w fr-mb-1w">
              <SearchableSelect
                onChange={handleStructureChange}
                options={structures}
                placeholder="Rechercher un établissement..."
                value={structure}
              />
            </div>
          </>
        )}
      </Col>
    </Row>
  );
}
