import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getI18nLabel } from "../../../../../../utils";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import { deepMerge, formatCompactNumber, funders, getCssColor, getEsQuery, getGeneralOptions, getYearRangeLabel, pattern } from "../../../../utils.ts";
import i18n from "../i18n.json";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function InternationalPartnersByStructure({ name }: { name: string | undefined }) {
  const [selectedControl, setSelectedControl] = useState("projects");
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
    aggregations: {
      by_international_partners_project: {
        terms: {
          field: "co_partners_foreign_inst.keyword",
        },
        aggregations: {
          by_project_type: {
            terms: {
              field: "project_type.keyword",
            },
            aggregations: {
              is_coordinator: {
                terms: {
                  field: "participation_is_coordinator",
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
        },
      },
      by_international_partners_budget: {
        terms: {
          field: "co_partners_foreign_inst.keyword",
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
              is_coordinator: {
                terms: {
                  field: "participation_is_coordinator",
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
        },
      },
      by_international_partners_participation: {
        terms: {
          field: "co_partners_foreign_inst.keyword",
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
              is_coordinator: {
                terms: {
                  field: "participation_is_coordinator",
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
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-international-partners", structure, yearMax, yearMin],
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

  const partnersProject = data?.aggregations?.by_international_partners_project?.buckets ?? [];
  const seriesProjectCoord: any = funders.map((funder) => ({
    color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
    data: partnersProject.map((partner) => partner.by_project_type.buckets.find((project) => project.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.unique_projects?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
  })).reverse();
  const seriesProjectNotCoord: any = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: partnersProject.map((partner) => partner.by_project_type.buckets.find((project) => project.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.unique_projects?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
  })).reverse();
  const categoriesProject = partnersProject?.map((partner) => {
    const structure = Object.fromEntries(new URLSearchParams(partner.key));
    return `${structure.label} (${structure.country})`;
  });
  const partnersBudget = data?.aggregations?.by_international_partners_budget?.buckets ?? [];
  const seriesBudgetCoord: any = funders.map((funder) => ({
    color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
    data: partnersBudget.map((partner) => partner.by_project_type.buckets.find((project) => project.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
  })).reverse();
  const seriesBudgetNotCoord: any = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: partnersBudget.map((partner) => partner.by_project_type.buckets.find((project) => project.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
  })).reverse();
  const categoriesBudget = partnersBudget.map((partner) => {
    const structure = Object.fromEntries(new URLSearchParams(partner.key));
    return `${structure.label} (${structure.country})`;
  });
  const partnersParticipation = data?.aggregations?.by_international_partners_participation?.buckets ?? [];
  const seriesParticipationCoord: any = funders.map((funder) => ({
    color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
    data: partnersParticipation.map((partner) => partner.by_project_type.buckets.find((project) => project.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget_participation?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
  })).reverse();
  const seriesParticipationNotCoord: any = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: partnersParticipation.map((partner) => partner.by_project_type.buckets.find((project) => project.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget_participation?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
  })).reverse();
  const categoriesParticipation = partnersParticipation.map((partner) => {
    const structure = Object.fromEntries(new URLSearchParams(partner.key));
    return `${structure.label} (${structure.country})`;
  });

  const config = {
    comment: { "fr": <>Ce graphe montre quels partenaires internationaux collaborent le plus avec l'établissement sur les projets financés par AAP.
Les barres représentent le nombre / le montant total des projets auxquels chaque partenaire participe conjointement avec l'établissement.
Certains partenaires internationaux se distinguent par un volume élevé de projets, signalant des collaborations stratégiques et récurrentes à l’international.
Ces montants ne reflètent pas les financements réellement reçus par l'établissement ou ses partenaires, mais indiquent l’importance relative de leur participation dans l’écosystème de projets financés par AAP</> },
    id: "internationalPartnersByStructure",
  };

  // If view by number of projects
  let axis = 'Nombre de projets financés';
  let categories = categoriesProject;
  let dataLabel = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''}`;
  };
  let series = seriesProjectNotCoord.concat(seriesProjectCoord);
  let stackLabel = function (this: any) {
    return `${this.total} projet${this.total > 1 ? 's' : ''}`;
  };
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.series.name}</b> auxquels participent <b>${name}</b> et <b>${this.key}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = 'Montants globaux financés (€)';
      categories = categoriesBudget;
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €`;
      };
      series = seriesBudgetNotCoord.concat(seriesBudgetCoord);
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> financés pour les projets <b>${this.series.name}</b> auxquels participent <b>${name}</b> et <b>${this.key}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = 'Montants financés pour cet établissement (€)';
      categories = categoriesParticipation;
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €`;
      };
      series = seriesParticipationNotCoord.concat(seriesParticipationCoord);
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> alloués pour les projets <b>${this.series.name}</b> auxquels participent <b>${name}</b> et <b>${this.key}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
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
    <div className={`chart-container chart-container--${color}`} id="international-partners-by-structure">
      <Title as="h2" look="h6">
        {`Principaux partenaires internationaux de ${name} ${getYearRangeLabel({ yearMax, yearMin })}`}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
};
