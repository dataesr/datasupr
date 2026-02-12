import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import { deepMerge, formatCompactNumber, funders, getCssColor, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function LaboratoriesByStructure({ name }: { name: string | undefined }) {
  const [selectedControl, setSelectedControl] = useState("projects");
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  // No filter on typology bc some laboratories may have no typology, bc not in Paysage
  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          { range: { project_year: { gte: yearMin, lte: yearMax } } },
          { term: { participant_isFrench: true } },
          { term: { participant_status: "active" } },
          { term: { participant_type: "laboratory" } },
          { term: { "participant_kind.keyword": "Secteur public" } },
          { terms: { "project_type.keyword": funders } },
          { term: { "participant_institutions.structure.keyword": structure } }
        ],
      },
    },
    aggregations: {
      by_laboratory_project: {
        terms: {
          field: "participant_id_name_default.keyword",
          size: 25,
        },
        aggregations: {
          by_project_type: {
            terms: {
              field: "project_type.keyword",
            },
            aggregations: {
              unique_projects: {
                cardinality: {
                  field: "project_id.keyword",
                },
              },
            },
          },
        },
      },
      by_laboratory_budget: {
        terms: {
          field: "participant_id_name_default.keyword",
          size: 25,
          order: { "sum_budget": "desc" },
        },
        aggregations: {
          sum_budget: {
            sum: {
              field: "project_budgetFinanced",
            },
          },
          by_project_type: {
            terms: {
              field: "project_type.keyword",
            },
            aggregations: {
              sum_budget: {
                sum: {
                  field: "project_budgetFinanced",
                },
              },
            },
          },
        },
      },
      by_laboratory_participation: {
        terms: {
          field: "participant_id_name_default.keyword",
          size: 25,
          order: { "sum_budget_participation": "desc" },
        },
        aggregations: {
          sum_budget_participation: {
            sum: {
              field: "participation_funding",
            },
          },
          by_project_type: {
            terms: {
              field: "project_type.keyword",
            },
            aggregations: {
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
    queryKey: ["fundings-projects-by-structures", structure, yearMax, yearMin],
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

  const laboratoriesProject = data?.aggregations?.by_laboratory_project?.buckets ?? [];
  const seriesProject = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: laboratoriesProject.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.unique_projects?.value ?? 0),
    name: funder,
  })).reverse();
  const categoriesProject = laboratoriesProject.map((item) => item.key.split('###')[1]);
  const laboratoriesBudget = data?.aggregations?.by_laboratory_budget?.buckets ?? [];
  const seriesBudget = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: laboratoriesBudget.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.sum_budget?.value ?? 0),
    name: funder,
  })).reverse();
  const categoriesBudget = laboratoriesBudget.map((item) => item.key.split('###')[1]);
  const laboratoriesParticipation = data?.aggregations?.by_laboratory_participation?.buckets ?? [];
  const seriesParticipation = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: laboratoriesParticipation.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.sum_budget_participation?.value ?? 0),
    name: funder,
  })).reverse();
  const categoriesParticipation = laboratoriesParticipation.map((item) => item.key.split('###')[1]);

  const config = {
    comment: { "fr": <>Ce graphe présente la répartition des projets financés par appels à projets (AAP) dans lesquels l'établissement est impliqué, ventilée par laboratoire et par financeur.
Les sources de données ne donnent pas toujours accès au niveau laboratoire. Pour les projets européens, c'est un travail mené avec 5 organismes pour ajouter ce niveau, avec un délai d'actualisation de un an. Pour le PIA, les données au niveau laboratoire ne sont pas disponibles.
Les barres indiquent le nombre / le montant total des projets auxquels chaque laboratoire participe. Les montants indiqués correspondent au financement global des projets auxquels l’établissement participe et ne reflètent pas les sommes effectivement perçues.
On observe que certains laboratoires concentrent une part importante des projets financés, ce qui peut refléter à la fois la taille des laboratoires, leur historique de participation aux AAP et leur spécialisation thématique.</> },
    id: "projectsByStructures",
  };

  // If view by number of projects
  let axis = 'Nombre de projets financés';
  let categories = categoriesProject;
  let dataLabel = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''}`;
  };
  let series = seriesProject;
  let stackLabel = function (this: any) {
    return `${this.total} projet${this.total > 1 ? 's' : ''}`;
  };
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.series.name}</b> auxquels participe <b>${categoriesProject[this.x]}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = 'Montants globaux financés (€)';
      categories = categoriesBudget;
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €`;
      };
      series = seriesBudget;
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été financés par <b>${this.series.name}</b> pour des projets débutés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} auxquels prend part <b>${categoriesBudget[this.x]}</b>`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = 'Montants financés pour cet établissement (€)';
      categories = categoriesParticipation;
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €`;
      };
      series = seriesParticipation;
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été alloués par <b>${this.series.name}</b> pour des projets débutés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} auxquels prend part <b>${categoriesBudget[this.x]}</b>`;
      };
      break;
  }

  const localOptions = {
    legend: { enabled: true, reversed: true },
    yAxis: {
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold'
        },
        formatter: stackLabel,
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: dataLabel,
        },
        stacking: "normal",
      }
    },
    series,
    tooltip: { formatter: tooltip },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", categories, "", axis), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-by-structures">
      <Title as="h2" look="h6">
        {`Principaux laboratoires de ${name} impliqués dans les projets par AAP ${getYearRangeLabel({ yearMax, yearMin })}`}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
}
