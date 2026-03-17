import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";

import { getData } from "./query";
import Options from "./options";
import { useGetParams, processData, renderDataTable, SCIENTIFIC_DOMAINS, type ScientificDomainCode } from "./utils";
import i18n from "./i18n.json";
import { getI18nLabel } from "../../../../../../utils";
import { getCountryNameWithDe, getCountryNameWithArticle } from "../../../../utils/country-mapping";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import "./styles.scss";

type MetricType = "projects" | "funding";

interface PositioningScientificDomainChartProps {
  countryCode?: string;
  currentLang?: string;
}

const getConfig = (metric: MetricType) => {
  const isProjects = metric === "projects";
  return {
    id: isProjects ? "ercPositioningScientificDomainProjects" : "ercPositioningScientificDomainFunding",
    idQuery: "ercPositioningScientificDomain",
    title: {
      en: getI18nLabel(i18n, isProjects ? "title-projects" : "title-funding", "en"),
      fr: getI18nLabel(i18n, isProjects ? "title-projects" : "title-funding", "fr"),
    },
    comment: {
      fr: <>{getI18nLabel(i18n, isProjects ? "comment-projects" : "comment-funding", "fr")}</>,
      en: <>{getI18nLabel(i18n, isProjects ? "comment-projects" : "comment-funding", "en")}</>,
    },
    readingKey: {
      fr: <>{getI18nLabel(i18n, isProjects ? "reading-key-projects" : "reading-key-funding", "fr")}</>,
      en: <>{getI18nLabel(i18n, isProjects ? "reading-key-projects" : "reading-key-funding", "en")}</>,
    },
    integrationURL: isProjects
      ? "/european-projects/components/pages/erc/charts/positioning-scientific-domain"
      : "/european-projects/components/pages/erc/charts/positioning-scientific-domain-funding",
  };
};

function PositioningScientificDomainChartInner({ countryCode: propCountryCode, currentLang: propLang }: PositioningScientificDomainChartProps) {
  const [metric, setMetric] = useState<MetricType>("projects");
  const [domainCode, setDomainCode] = useState<ScientificDomainCode>(SCIENTIFIC_DOMAINS[0].code);

  const { params, currentLang: urlLang, countryCode: urlCountryCode } = useGetParams();
  const currentLang = propLang || urlLang;
  const countryCode = propCountryCode || urlCountryCode;

  // Construire les params avec le domaine scientifique sélectionné
  const queryParams = params ? `${params}&domaine_scientifique=${domainCode}` : `domaine_scientifique=${domainCode}`;

  const { data, isLoading } = useQuery({
    queryKey: ["ercPositioningScientificDomain", queryParams],
    queryFn: () => getData(queryParams),
    enabled: params !== "",
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const processedData = processData(data, countryCode, currentLang, metric, domainCode);

  // Nom du pays avec préposition
  const fallbackName = processedData.selectedCountry
    ? currentLang === "fr"
      ? processedData.selectedCountry.country_name_fr
      : processedData.selectedCountry.country_name_en
    : "";

  const countryName =
    currentLang === "fr" ? getCountryNameWithDe(countryCode, fallbackName) : getCountryNameWithArticle(countryCode, "en", fallbackName);

  const domainLabel = SCIENTIFIC_DOMAINS.find((d) => d.code === domainCode)?.label[currentLang as "fr" | "en"] ?? domainCode;

  const metricLabel = getI18nLabel(i18n, metric === "projects" ? "projects" : "funding", currentLang).toLowerCase();
  const title = getI18nLabel(i18n, "main-title-with-country", currentLang)
    .replace("{country}", countryName)
    .replace("{metric}", metricLabel)
    .replace("{domain}", domainLabel);

  const options = processedData.countries.length > 0 ? Options({ processedData, currentLang }) : null;

  const config = getConfig(metric);

  return (
    <div className="positioning-scientific-domain-chart">
      <h3>{title}</h3>
      <div className="positioning-scientific-domain-chart__controls">
        <div className="select-wrapper">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="domain-select">
              {getI18nLabel(i18n, "select-domain", currentLang)}
            </label>
            <select
              className="fr-select"
              id="domain-select"
              value={domainCode}
              onChange={(e) => setDomainCode(e.target.value as ScientificDomainCode)}
            >
              {SCIENTIFIC_DOMAINS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.label[currentLang as "fr" | "en"]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="segmented-wrapper">
          <SegmentedControl className="fr-segmented--sm" name="positioning-scientific-domain-metric">
            <SegmentedElement
              checked={metric === "projects"}
              label={getI18nLabel(i18n, "projects", currentLang)}
              onClick={() => setMetric("projects")}
              value="projects"
            />
            <SegmentedElement
              checked={metric === "funding"}
              label={getI18nLabel(i18n, "funding", currentLang)}
              onClick={() => setMetric("funding")}
              value="funding"
            />
          </SegmentedControl>
        </div>
      </div>

      {processedData.countries.length === 0 ? (
        <div className="fr-alert fr-alert--info">
          <p>{getI18nLabel(i18n, "no-data", currentLang)}</p>
        </div>
      ) : (
        <ChartWrapper config={config} options={options} renderData={() => renderDataTable(processedData, currentLang)} />
      )}
    </div>
  );
}

export default function PositioningScientificDomainChart({ countryCode, currentLang }: PositioningScientificDomainChartProps) {
  return <PositioningScientificDomainChartInner countryCode={countryCode} currentLang={currentLang} />;
}
