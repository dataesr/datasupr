import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useChartColor } from "../../../../../../hooks/useChartColor";
import { EPChartsSources } from "../../../../config";

export default function BeneficiariesByRole() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);
  const currentLang = searchParams.get("language") || "fr";
  const color = useChartColor();

  const { data, isLoading } = useQuery({
    queryKey: ["beneficiariesByRole", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const config = {
    id: "beneficiariesByRole",
    title: {
      fr: "Top 10 des bénéficiaires par rôle en fonction des subventions alloués",
      en: "Top 10 beneficiaries by role based on allocated funding",
    },
    sources: EPChartsSources,
    integrationURL: "/european-projects/components/pages/analysis/beneficiaries/charts/beneficiaries-by-role",
  };

  return (
    <div className={`fr-mt-5w chart-container chart-container--${color}`}>
      <ChartWrapper config={config} options={options(data, currentLang)} renderData={() => null} />
    </div>
  );
}
