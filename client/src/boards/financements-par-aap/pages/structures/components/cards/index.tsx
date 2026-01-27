import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { getCssColor } from "../../../../../../utils/colors.ts";
import { formatCompactNumber, funders, getEsQuery, getYearRangeLabel, years } from "../../../../utils.ts";
import ChartCard from "../chart-card/index.tsx";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


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
            aggregations: {
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
    queryKey: ["funding-projects-over-time-by-structure", structure],
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
          y: 1 + (dataByFunder?.by_project_year?.buckets.find((item) => item.key === year)?.unique_projects?.value ?? 0),
          yDisplay: dataByFunder?.by_project_year?.buckets.find((item) => item.key === year)?.unique_projects?.value ?? 0,
        })),
        budget: years.map((year) => ({
          x: year,
          y: 1 + (dataByFunder?.by_project_year?.buckets.find((item) => item.key === year)?.sum_budget?.value ?? 0),
          yDisplay: dataByFunder?.by_project_year?.buckets.find((item) => item.key === year)?.sum_budget?.value ?? 0,
        })),
      };
    }
  });

  const maxProjects: number = Math.max.apply(null, Object.values(dataFunders).map((dataFunder: any) => dataFunder.projects.map((project) => project.y)).flat());
  const maxBudget: number = Math.max.apply(null, Object.values(dataFunders).map((dataFunder: any) => dataFunder.budget.map((project) => project.y)).flat());

  return (
    <>
      <Row gutters>
        <Col xs="12" md="2" key={`card-projects-intro`}>
          <div
            aria-label={`Nombre de projets financés ${getYearRangeLabel({ yearMax, yearMin })} par financeur`}
            className="fr-card"
            role="article"
            style={{
              borderBottom: "none",
              borderLeft: "none",
              borderRight: "none",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div className="fr-card__body fr-p-2w" style={{ pointerEvents: "none", position: "relative" }}>
              <div className="fr-card__content">
                <p
                  className="fr-text--sm fr-text--bold fr-mb-1v"
                  style={{ letterSpacing: "0.5px", textTransform: "uppercase" }}
                >
                  {`Nombre de projets financés auxquels l'établissement participe`}
                </p>
              </div>
            </div>
          </div>
        </Col>
        {Object.keys(dataFunders).map((funder) => (
          <Col xs="12" md="2" key={`card-projects-${funder}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getCssColor(`funder-${funder.toLowerCase().replaceAll(" ", "-")}`)}
                data={dataFunders[funder].projects}
                detail={getYearRangeLabel({ yearMax, yearMin })}
                title={`Projets ${funder}`}
                tooltipFormatter={function (this: any) {
                  const nbProjects = this.y - 1;
                  return `${nbProjects} ${nbProjects > 1 ? "projets" : "projet"} ${funder} en ${this.key}`;
                }}
                value={`${dataFunders[funder].projects.filter((item) => yearMin && yearMax && item.x >= yearMin && item.x <= yearMax).reduce((acc, cur) => acc + cur.yDisplay, 0)} projet${dataFunders[funder].projects.filter((item) => yearMin && yearMax && item.x >= yearMin && item.x <= yearMax).reduce((acc, cur) => acc + cur.yDisplay, 0) > 1 ? 's' : ''}`}
                yAxisMax={maxProjects}
              />
            }
          </Col>
        ))}
      </Row>
      <Row gutters>
        <Col xs="12" md="2" key={`card-projects-intro`}>
          <div
            aria-label={`Montants financés ${getYearRangeLabel({ yearMax, yearMin })} par financeur`}
            className="fr-card"
            role="article"
            style={{
              borderBottom: "none",
              borderLeft: "none",
              borderRight: "none",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div className="fr-card__body fr-p-2w" style={{ pointerEvents: "none", position: "relative" }}>
              <div className="fr-card__content">
                <p
                  className="fr-text--sm fr-text--bold fr-mb-1v"
                  style={{ letterSpacing: "0.5px", textTransform: "uppercase" }}
                >
                  {`Montants financés pour les projets auxquels l'établissement participe`}
                </p>
              </div>
            </div>
          </div>
        </Col>
        {Object.keys(dataFunders).map((funder) => (
          <Col xs="12" md="2" key={`card-budget-${funder}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getCssColor(`funder-${funder.toLowerCase().replaceAll(" ", "-")}`)}
                data={dataFunders[funder].budget}
                detail={getYearRangeLabel({ yearMax, yearMin })}
                title={`Montants des projets ${funder}`}
                tooltipFormatter={function (this: any) { return `${formatCompactNumber(this.y - 1)} € par ${funder} en ${this.key}` }}
                value={`${formatCompactNumber(dataFunders[funder].budget.filter((item) => yearMin && yearMax && item.x >= yearMin && item.x <= yearMax).reduce((acc, cur) => acc + cur.yDisplay, 0))} €`}
                yAxisMax={maxBudget}
              />
            }
          </Col>
        ))}
      </Row>
    </>
  )
}
