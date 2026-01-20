import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { formatCompactNumber, funders, getColorFromFunder, years } from "../../../../utils.ts";
import ChartCard from "../chart-card";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function Cards() {
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const year = Number(searchParams.get("year"));

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
              "project_type.keyword": funders,
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

  const getDataByFunder = (funder) => {
    const dataFunder = (data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder)?.by_project_year?.buckets ?? [];
    return years.map((year) => ({
      x: year,
      y: dataFunder.find((item) => item.key === year)?.unique_projects?.value ?? 0,
    }));
  }

  return (
    <>
      <Row gutters>
        {(data?.aggregations?.by_project_type?.buckets ?? []).map((funder) => (
          <Col xs="12" md="4" key={`card-projects-${funder.key}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getColorFromFunder(funder.key)}
                data={getDataByFunder(funder.key)}
                title={`Projets financés par ${funder.key} en ${year}`}
                value={(data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder.key)?.by_project_year?.buckets?.find((item) => item.key === year)?.unique_projects?.value ?? 0}
              />
            }
          </Col>
        ))}
      </Row>
      <Row gutters>
        {(data?.aggregations?.by_project_type?.buckets ?? []).map((funder) => (
          <Col xs="12" md="4" key={`card-budget-${funder.key}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getColorFromFunder(funder.key)}
                data={(data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder.key)?.by_project_year?.buckets?.map((item) => ({ x: item.key, y: item.sum_budget.value }))}
                title={`Projets financés par ${funder.key} en ${year}`}
                unit="€"
                value={formatCompactNumber((data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder.key)?.by_project_year?.buckets?.find((item) => item.key === year)?.sum_budget?.value ?? 0)}
              />
            }
          </Col>
        ))}
      </Row>
    </>
  )
}