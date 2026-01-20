import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { getColorFromFunder, years } from "../../../../utils.ts";
import ChartCard from "../chart-card/index.tsx";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function Cards() {
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");

  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              project_year: {
                gte: years[0],
              },
            },
          },
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
              "participant_id.keyword": structure,
            },
          },
          {
            terms: {
              "project_type.keyword": ["ANR", "PIA ANR", "PIA hors ANR", "Horizon 2020", "Horizon Europe"],
            },
          },
        ]
      },
    },
    aggregations: {
      by_project_type: {
        terms: {
          field: "project_type.keyword",
          size: 50,
        },
        aggregations: {
          by_project_year: {
            terms: {
              field: "project_year",
            },
            aggs: {
              unique_projects: {
                cardinality: {
                  field: "project_id.keyword",
                },
              },
              sum_budget: {
                sum: {
                  field: "project_budgetTotal",
                },
              },
            },
          },
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ['funding-projects-over-time-by-structure', structure],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  const funders = (data?.aggregations?.by_project_type?.buckets ?? []).map((item) => item.key);

  return (
    <>
      <Row gutters>
        {funders.map((funder, i) => (
          <Col xs="12" md="4" key={`card-projects-${i}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getColorFromFunder(funder)}
                evolutionData={(data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder)?.by_project_year?.buckets?.map((item) => ({ exercice: item.key, value: item.unique_projects.value }))}
                title={`Projets financés par ${funder} en 2023`}
                value={(data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder)?.by_project_year?.buckets?.find((item) => item.key === 2023)?.unique_projects?.value ?? 0}
              />
            }
          </Col>
        ))}
      </Row>
      <Row gutters>
        {funders.map((funder, i) => (
          <Col xs="12" md="4" key={`card-budget-${i}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getColorFromFunder(funder)}
                evolutionData={(data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder)?.by_project_year?.buckets?.map((item) => ({ exercice: item.key, value: item.sum_budget.value }))}
                title={`Projets financés par ${funder} en 2023`}
                unit="€"
                value={(data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder)?.by_project_year?.buckets?.find((item) => item.key === 2023)?.sum_budget?.value ?? 0}
              />
            }
          </Col>
        ))}
      </Row>
    </>
  )
}