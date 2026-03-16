import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";

import { getData } from "./query";
import Options from "./options";
import { useGetParams, processPositioningData, renderDataTable } from "./utils";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

type MetricType = "projects" | "funding";

interface PositioningGlobalChartProps {
  countryCode?: string;
  currentLang?: string;
}

const configProjects = {
  id: "ercPositioningGlobalProjects",
  idQuery: "ercPositioningGlobal",
  title: {
    en: "Global positioning - Projects",
    fr: "Positionnement global - Projets",
  },
  comment: {
    fr: (
      <>
        Ce graphique présente le classement des pays par nombre de porteurs de projets ERC lauréats. Le pays sélectionné est mis en évidence en bleu
        foncé. Si le pays sélectionné n'est pas dans le top 10, il est affiché en dernière position pour comparaison.
      </>
    ),
    en: (
      <>
        This chart shows the country ranking by number of successful ERC project PIs. The selected country is highlighted in dark blue. If the
        selected country is not in the top 10, it is displayed at the last position for comparison.
      </>
    ),
  },
  readingKey: {
    fr: (
      <>
        Un pays bien positionné dans ce classement a un nombre élevé de porteurs de projets ERC lauréats, ce qui reflète la capacité de recherche
        d'excellence du pays.
      </>
    ),
    en: (
      <>
        A well-positioned country in this ranking has a high number of successful ERC project PIs, which reflects the country's research excellence
        capacity.
      </>
    ),
  },
  integrationURL: "/european-projects/components/pages/erc/charts/positioning-global",
};

const configFunding = {
  id: "ercPositioningGlobalFunding",
  idQuery: "ercPositioningGlobal",
  title: {
    en: "Global positioning - Funding",
    fr: "Positionnement global - Financements",
  },
  comment: {
    fr: (
      <>
        Ce graphique présente le classement des pays par montant de financements ERC obtenus. Le pays sélectionné est mis en évidence en bleu foncé.
        Si le pays sélectionné n'est pas dans le top 10, il est affiché en dernière position pour comparaison.
      </>
    ),
    en: (
      <>
        This chart shows the country ranking by ERC funding amount obtained. The selected country is highlighted in dark blue. If the selected country
        is not in the top 10, it is displayed at the last position for comparison.
      </>
    ),
  },
  readingKey: {
    fr: (
      <>
        Un pays bien positionné dans ce classement a obtenu des montants élevés de financements ERC, ce qui reflète l'attractivité et la compétitivité
        de sa recherche.
      </>
    ),
    en: (
      <>
        A well-positioned country in this ranking has obtained high amounts of ERC funding, which reflects the attractiveness and competitiveness of
        its research.
      </>
    ),
  },
  integrationURL: "/european-projects/components/pages/erc/charts/positioning-global-funding",
};

function PositioningGlobalChartInner({
  countryCode: propCountryCode,
  currentLang: propLang,
  metric,
}: PositioningGlobalChartProps & { metric: MetricType }) {
  const { params, currentLang: urlLang, countryCode: urlCountryCode } = useGetParams();
  const currentLang = propLang || urlLang;
  const countryCode = propCountryCode || urlCountryCode;

  const { data, isLoading } = useQuery({
    queryKey: ["ercPositioningGlobal", params],
    queryFn: () => getData(params),
    enabled: params !== "",
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const processedData = processPositioningData(data, countryCode, currentLang, metric);

  if (processedData.countries.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>{currentLang === "fr" ? "Aucune donnée disponible." : "No data available."}</p>
      </div>
    );
  }

  const options = Options({
    processedData,
    currentLang,
  });

  const config = metric === "projects" ? configProjects : configFunding;

  return <ChartWrapper config={config} options={options} renderData={() => renderDataTable(processedData, currentLang)} />;
}

export default function PositioningGlobalChart({ countryCode, currentLang: propLang }: PositioningGlobalChartProps) {
  const [metric, setMetric] = useState<MetricType>("projects");
  const { currentLang: urlLang } = useGetParams();
  const currentLang = propLang || urlLang;

  return (
    <div className="fr-my-3w">
      <h3>{currentLang === "fr" ? "Positionnement global du pays" : "Country global positioning"}</h3>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <SegmentedControl className="fr-segmented--sm" name="positioning-global-metric">
          <SegmentedElement
            checked={metric === "projects"}
            label={currentLang === "fr" ? "Projets" : "Projects"}
            onClick={() => setMetric("projects")}
            value="projects"
          />
          <SegmentedElement
            checked={metric === "funding"}
            label={currentLang === "fr" ? "Financements" : "Funding"}
            onClick={() => setMetric("funding")}
            value="funding"
          />
        </SegmentedControl>
      </div>
      <PositioningGlobalChartInner countryCode={countryCode} currentLang={currentLang} metric={metric} />
    </div>
  );
}
