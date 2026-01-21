import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { formatCompactNumber, funders, getColorFromFunder, getEsQuery, getYearRangeLabel, years } from "../../../../utils.ts";
import ChartCard from "../chart-card";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

type ColSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;


export default function Cards() {
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");

  const body = {
    ...getEsQuery({ structures: [structure] }),
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

  const dataFunders = {};
  funders.forEach((funder) => {
    const dataByFunder = (data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder);
    if (dataByFunder) {
      dataFunders[funder] = {
        projects: years.map((year) => ({
          x: year,
          y: dataByFunder?.by_project_year?.buckets.find((item) => item.key === year)?.unique_projects?.value ?? 0,
        })),
        budget: years.map((year) => ({
          x: year,
          y: dataByFunder?.by_project_year?.buckets.find((item) => item.key === year)?.sum_budget?.value ?? 0,
        })),
      };
    }
  });

  const size: ColSize = Math.floor(12 / Object.keys(dataFunders).length) as ColSize;
  const maxProjects: number = Math.max.apply(null, Object.values(dataFunders).map((dataFunder: any) => dataFunder.projects.map((project) => project.y)).flat());
  const maxBudget: number = Math.max.apply(null, Object.values(dataFunders).map((dataFunder: any) => dataFunder.budget.map((project) => project.y)).flat());

  return (
    <>
      <Row gutters>
        {Object.keys(dataFunders).map((funder) => (
          <Col xs="12" md={size} key={`card-projects-${funder}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getColorFromFunder(funder)}
                data={dataFunders[funder].projects}
                detail={getYearRangeLabel({ yearMax, yearMin })}
                title={`Projets financés par ${funder}`}
                tooltipFormatter={function (this: any) { return `${this.y} project(s) par ${funder} en ${this.key}` }}
                value={`${dataFunders[funder].projects.filter((item) => yearMin && yearMax && item.x >= yearMin && item.x <= yearMax).reduce((acc, cur) => acc + cur.y, 0)} projet${dataFunders[funder].projects.filter((item) => yearMin && yearMax && item.x >= yearMin && item.x <= yearMax).reduce((acc, cur) => acc + cur.y, 0) > 1 ? 's' : ''}`}
                yAxisMax={maxProjects}
              />
            }
          </Col>
        ))}
      </Row>
      <Row gutters>
        {Object.keys(dataFunders).map((funder) => (
          <Col xs="12" md={size} key={`card-budget-${funder}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getColorFromFunder(funder)}
                data={dataFunders[funder].budget}
                detail={getYearRangeLabel({ yearMax, yearMin })}
                title={`Montants financés par ${funder}`}
                tooltipFormatter={function (this: any) { return `${formatCompactNumber(this.y)} € par ${funder} en ${this.key}` }}
                value={`${formatCompactNumber(dataFunders[funder].budget.filter((item) => yearMin && yearMax && item.x >= yearMin && item.x <= yearMax).reduce((acc, cur) => acc + cur.y, 0))} €`}
                yAxisMax={maxBudget}
              />
            }
          </Col>
        ))}
      </Row>
    </>
  )
}