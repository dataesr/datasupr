// import { useSearchParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";

import bool from "./query";
// import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import {
  useQueryResponse,
  getOptions,
  getSeries,
} from "./utils.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useChartColor } from "../../../../../../hooks/useChartColor";
// import { EPChartsSource, EPChartsUpdateDate } from "../../../../config";

export default function MainPartners() {
  const color = useChartColor();

  const { data, isLoading } = useQueryResponse(bool, 15, "");
  if (isLoading || !data) return <DefaultSkeleton />;

  const { series, categories } = getSeries(data);

  const options: object = getOptions(
    series,
    categories,
    '',
    'a obtenu',
    'financements sur la période 2022-2024',
    '',
    'Nombre de projets financés',
  );

  const config = {
    id: "mainPartners",
    title: "Top structures françaises par nombre de financements sur la période 2022-2024",
    // comment: {
    //   fr: (
    //     <>
    //       Ce graphique présente les principaux bénéficiaires des financements européens, en mettant en évidence ceux qui reçoivent 50% des fonds
    //       alloués. Il permet d'identifier les acteurs clés dans la répartition des financements et d'analyser leur rôle dans le contexte des projets
    //       européens. Chaque barre représente un bénéficiaire, avec la longueur de la barre indiquant le montant total des financements reçus. Les
    //       bénéficiaires sont classés par ordre décroissant de financement, permettant ainsi d'identifier rapidement les acteurs les plus importants.
    //     </>
    //   ),
    //   en: (
    //     <>
    //       This chart presents the main beneficiaries of European funding, highlighting those who receive 50% of the allocated funds. It helps identify
    //       key players in the distribution of funding and analyze their role in the context of European projects. Each bar represents a beneficiary,
    //       with the length of the bar indicating the total amount of funding received. Beneficiaries are ranked in descending order of funding,
    //       allowing for quick identification of the most important actors.
    //     </>
    //   ),
    // },
    // readingKey: readingKey(data),
    // source: EPChartsSource,
    // updateDate: EPChartsUpdateDate,
    integrationURL: "/scanr/components/pages/overview/charts/main-beneficiaries",
  };

  return (
    <div className={`chart-container chart-container--${color}`}>
      <ChartWrapper
        config={config}
        legend={null}
        // options={options(data, currentLang)}
        options={options}
        // renderData={() => renderDataTable(data, currentLang)}
      />
    </div>
  );
}
