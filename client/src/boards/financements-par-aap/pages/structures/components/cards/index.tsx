import { Col, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { formatCompactNumber, funders, getCssColor, getEsQuery, getYearRangeLabel, years } from "../../../../utils.ts";
import ChartCard from "../chart-card";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


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
              size: 25,
            },
            aggregations: {
              unique_projects: {
                cardinality: {
                  field: "project_id.keyword",
                },
              },
              sum_budget: {
                sum: {
                  field: "project_budgetFinanced",
                },
              },
              sum_budget_participation: {
                sum: {
                  field: "participation_funding",
                },
              },
            },
          },
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["funding-cards", structure],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
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
    dataFunders[funder] = {
      projects: years.map((year) => ({
        x: year,
        y: dataByFunder?.by_project_year?.buckets?.find((item) => item.key === year)?.unique_projects?.value ?? 0,
        yDisplay: dataByFunder?.by_project_year?.buckets.find((item) => item.key === year)?.unique_projects?.value ?? 0,
      })),
      budget: years.map((year) => ({
        x: year,
        y: dataByFunder?.by_project_year?.buckets?.find((item) => item.key === year)?.sum_budget?.value ?? 0,
        yDisplay: dataByFunder?.by_project_year?.buckets?.find((item) => item.key === year)?.sum_budget?.value ?? 0,
      })),
      participation: years.map((year) => ({
        x: year,
        y: dataByFunder?.by_project_year?.buckets?.find((item) => item.key === year)?.sum_budget_participation?.value ?? 0,
        yDisplay: dataByFunder?.by_project_year?.buckets?.find((item) => item.key === year)?.sum_budget_participation?.value ?? 0,
      })),
    };
  });

  const maxProjects: number = Math.max.apply(null, Object.values(dataFunders).map((dataFunder: any) => dataFunder.projects.map((project) => project.y)).flat());
  const maxBudget: number = Math.max.apply(null, Object.values(dataFunders).map((dataFunder: any) => dataFunder.budget.map((budget) => budget.y)).flat());
  const maxParticipation: number = Math.max.apply(null, Object.values(dataFunders).map((dataFunder: any) => dataFunder.participation.map((participation) => participation.y)).flat());

  return (
    <>
      <Row gutters style={{ clear: "both" }}>
        <Col xs="12" md="2" />
        {Object.keys(dataFunders).map((funder) => (
          <Col xs="12" md="2" key={`header-${funder}`}>
            <Text
              size="sm"
              bold
              className="fr-mb-0"
              style={{
                color: getCssColor({ name: funder, prefix: "funder" }),
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {funder}
              <span aria-hidden="true" style={{ display: "block", fontSize: "0.75rem", opacity: 0.5 }}>▼</span>
            </Text>
          </Col>
        ))}
      </Row>
      <Row gutters>
        <Col xs="12" md="2" key={`card-projects-intro`}>
          <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
            <Title as="h2" className="fr-mb-0" style={{ fontSize: "0.8rem", letterSpacing: "0.3px", lineHeight: 1.3, textTransform: "uppercase" }}>
              Nombre de projets financés auxquels l'établissement participe
              <span aria-hidden="true" style={{ display: "inline-block", marginLeft: "0.5rem", opacity: 0.4 }}>→</span>
            </Title>
          </div>
        </Col>
        {Object.keys(dataFunders).map((funder) => (
          <Col xs="12" md="2" key={`card-projects-${funder}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getCssColor({ name: funder, prefix: "funder" })}
                data={dataFunders[funder].projects}
                detail={getYearRangeLabel({ yearMax, yearMin })}
                title={`Projets ${funder}`}
                titleAs="h3"
                tooltipFormatter={function (this: any) {
                  return `${this.y} ${this.y > 1 ? "projets" : "projet"} ${funder} en ${this.key}`;
                }}
                value={`${dataFunders[funder].projects.filter((item) => yearMin && yearMax && item.x >= yearMin && item.x <= yearMax).reduce((acc, cur) => acc + cur.yDisplay, 0)} projet${dataFunders[funder].projects.filter((item) => yearMin && yearMax && item.x >= yearMin && item.x <= yearMax).reduce((acc, cur) => acc + cur.yDisplay, 0) > 1 ? 's' : ''}`}
                yAxisMax={maxProjects}
              />
            }
          </Col>
        ))}
      </Row>
      <Row gutters>
        <Col xs="12" md="2" key={`card-budget-intro`}>
          <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
            <Title as="h2" className="fr-mb-0" style={{ fontSize: "0.8rem", letterSpacing: "0.3px", lineHeight: 1.3, textTransform: "uppercase" }}>
              Financements globaux des projets auxquels l'établissement participe
              <span aria-hidden="true" style={{ display: "inline-block", marginLeft: "0.5rem", opacity: 0.4 }}>→</span>
            </Title>
          </div>
        </Col>
        {Object.keys(dataFunders).map((funder) => (
          <Col xs="12" md="2" key={`card-budget-${funder}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getCssColor({ name: funder, prefix: "funder" })}
                data={dataFunders[funder].budget}
                detail={getYearRangeLabel({ yearMax, yearMin })}
                title={`Financement global des projets ${funder}`}
                titleAs="h3"
                tooltipFormatter={function (this: any) { return `${formatCompactNumber(this.y)} € par ${funder} en ${this.key}` }}
                value={`${formatCompactNumber(dataFunders[funder].budget.filter((item) => yearMin && yearMax && item.x >= yearMin && item.x <= yearMax).reduce((acc, cur) => acc + cur.yDisplay, 0))} €`}
                yAxisMax={maxBudget}
              />
            }
          </Col>
        ))}
      </Row>
      <Row gutters>
        <Col xs="12" md="2" key={`card-participation-intro`}>
          <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
            <Title as="h2" className="fr-mb-0" style={{ fontSize: "0.8rem", letterSpacing: "0.3px", lineHeight: 1.3, textTransform: "uppercase" }}>
              Financements perçus pour les projets auxquels l'établissement participe
              <span aria-hidden="true" style={{ display: "inline-block", marginLeft: "0.5rem", opacity: 0.4 }}>→</span>
            </Title>
          </div>
        </Col>
        {Object.keys(dataFunders).map((funder) => (
          <Col xs="12" md="2" key={`card-participation-${funder}`}>
            {isLoading ? <DefaultSkeleton height="250px" /> :
              <ChartCard
                color={getCssColor({ name: funder, prefix: "funder" })}
                data={dataFunders[funder].participation}
                detail={getYearRangeLabel({ yearMax, yearMin })}
                title={`Financements perçus des projets ${funder}`}
                titleAs="h3"
                tooltipFormatter={function (this: any) { return `${formatCompactNumber(this.y)} € par ${funder} en ${this.key}` }}
                value={`${formatCompactNumber(dataFunders[funder].participation.filter((item) => yearMin && yearMax && item.x >= yearMin && item.x <= yearMax).reduce((acc, cur) => acc + cur.yDisplay, 0))} €`}
                yAxisMax={maxParticipation}
              />
            }
          </Col>
        ))}
      </Row>
    </>
  )
}
