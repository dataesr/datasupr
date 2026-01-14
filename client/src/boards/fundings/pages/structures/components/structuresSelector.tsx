import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../components/charts-skeletons/default.tsx";
import SearchableSelect from "../../../../structures-finance/components/searchable-select";
import { getLabelFromName } from "../../../utils";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function StructuresSelector() {
  // const years = Array.from(Array(10).keys()).map((item) => (item + 2015).toString());
  // const defaultYear = years[years.length - 2];
  const defaultStructure = '180089013###FR_Centre national de la recherche scientifique|||EN_French National Centre for Scientific Research';
  const [searchParams, setSearchParams] = useSearchParams({});
  const selectedCounty = searchParams.get("county") ?? "";
  const selectedStructure = searchParams.get("structure") ?? "";

  if (!selectedStructure) {
    const next = new URLSearchParams(searchParams);
    next.set('structure', defaultStructure);
    setSearchParams(next);
  }

  const handleCountyChange = (county: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('county', county);
    next.delete('structure');
    setSearchParams(next);
  };

  const handleStructureChange = (structure: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('structure', structure);
    // if (!searchParams.has('year') && defaultYear) {
    //   next.set('year', defaultYear);
    // }
    setSearchParams(next);
  };

  const body = {
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
              "project_type.keyword": ["ANR", "PIA ANR", "PIA hors ANR", "H2020", "Horizon Europe"],
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
      by_county: {
        terms: {
          field: "address.region.keyword",
          // missing
          // order: { "_key": "asc" },
          size: 15,
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-structures"],
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
  const counties = data.aggregations.by_county?.buckets.map((bucket) => bucket.key);
  const structures = data.aggregations?.by_structure?.buckets.map((bucket) => ({ id: bucket.key, label: getLabelFromName(bucket.key) })) || [];

  return (
    <>
      <div>
        <h3>
          Sélectionner une structure
        </h3>

        <Row gutters>
          <Col xs="12" sm="6" md="4">
            <div className="fr-select-group">
              <label className="fr-label">Région</label>
              <select
                aria-describedby="select-hint-messages"
                className="fr-select "
                id="select-hint"
                name="select-hint"
                onChange={(e) => handleCountyChange(e.target.value)}
                value={selectedCounty}
              >
                <option value="toutes">Toutes les régions</option>
                {counties.map((county) => (
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
              value={selectedStructure}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
