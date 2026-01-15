import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import SearchableSelect from "../../../../../../components/searchable-select/index.tsx";
import { getLabelFromName } from "../../../../utils";
import { useState } from "react";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } =
  import.meta.env;

export default function StructuresSelector() {
  const [county, setCounty] = useState("*");
  const [searchParams, setSearchParams] = useSearchParams({});
  const structure = searchParams.get("structure") ?? "";
  const year = searchParams.get("year") ?? "";
  const defaultStructure =
    "180089013###FR_Centre national de la recherche scientifique|||EN_French National Centre for Scientific Research";
  const defaultYear = "2023";

  if (!structure || structure.length === 0 || !year || year.length === 0) {
    const next = new URLSearchParams(searchParams);
    if (!structure || structure.length === 0) {
      next.set("structure", defaultStructure);
    }
    if (!year || year.length === 0) {
      next.set("year", defaultYear);
    }
    setSearchParams(next);
  }

  const handleStructureChange = (selectedStructure: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("structure", selectedStructure);
    setSearchParams(next);
  };

  const bodyCounties = {
    size: 0,
    query: {
      bool: {
        filter: [
          // {
          //   term: {
          //     participant_isFrench: true,
          //   },
          // },
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
          missing: "N/A",
          order: { _key: "asc" },
          size: 20,
        },
      },
    },
  };

  const bodyStructures = {
    size: 0,
    query: {
      bool: {
        filter: [
          // {
          //   term: {
          //     participant_isFrench: true,
          //   },
          // },
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
          {
            wildcard: {
              "address.region.keyword": county,
            },
          },
        ],
      },
    },
    aggregations: {
      by_structure: {
        terms: {
          field: "participant_id_name.keyword",
          size: 1500,
        },
      },
    },
  };

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
  console.log(dataCounties);

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

  if (
    isLoadingCounties ||
    !dataCounties ||
    isLoadingStructures ||
    !dataStructures
  )
    return <DefaultSkeleton />;
  const counties = dataCounties.aggregations.by_county?.buckets.map(
    (bucket) => bucket.key
  );
  const structures =
    dataStructures.aggregations?.by_structure?.buckets.map((bucket) => ({
      id: bucket.key,
      label: getLabelFromName(bucket.key),
    })) || [];

  return (
    <>
      <div>
        <h3>Sélectionner une structure</h3>

        <Row gutters>
          <Col xs="12" sm="6" md="4">
            <div className="fr-select-group">
              <label className="fr-label">Région</label>
              <select
                aria-describedby="select-hint-messages"
                className="fr-select "
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
          </Col>

          <Col xs="12" sm="6" md="8">
            <SearchableSelect
              label="Structure"
              onChange={handleStructureChange}
              options={structures}
              placeholder="Rechercher une structure..."
              value={structure}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
