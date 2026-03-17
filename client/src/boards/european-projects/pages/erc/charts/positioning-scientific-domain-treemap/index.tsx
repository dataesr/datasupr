import "highcharts/modules/treemap";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";

import { getData } from "./query";
import Options from "./options";
import { useGetParams, processTreemapData, renderDataTable, SCIENTIFIC_DOMAINS, type ScientificDomainCode } from "./utils";
import i18n from "./i18n.json";
import { getI18nLabel } from "../../../../../../utils";
import { getCountryNameWithDe, getCountryNameWithArticle } from "../../../../utils/country-mapping";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import "./styles.scss";

type MetricType = "projects" | "funding";

interface PositioningScientificDomainTreemapProps {
  countryCode?: string;
  currentLang?: string;
}

const getConfig = (metric: MetricType, domainCode: ScientificDomainCode, domainLabel) => {
  const isProjects = metric === "projects";
  const domainSuffix = domainCode.toLowerCase();
  return {
    id: isProjects ? `ercPositioningScientificDomainTreemapProjects-${domainSuffix}` : `ercPositioningScientificDomainTreemapFunding-${domainSuffix}`,
    idQuery: "ercPositioningScientificDomainTreemap",
    title: {
      en: getI18nLabel(i18n, isProjects ? "title-projects" : "title-funding", "en").replace("{domain}", domainLabel),
      fr: getI18nLabel(i18n, isProjects ? "title-projects" : "title-funding", "fr").replace("{domain}", domainLabel),
    },
    comment: {
      fr: <>{getI18nLabel(i18n, isProjects ? "comment-projects" : "comment-funding", "fr")}</>,
      en: <>{getI18nLabel(i18n, isProjects ? "comment-projects" : "comment-funding", "en")}</>,
    },
    readingKey: {
      fr: <>{getI18nLabel(i18n, isProjects ? "reading-key-projects" : "reading-key-funding", "fr")}</>,
      en: <>{getI18nLabel(i18n, isProjects ? "reading-key-projects" : "reading-key-funding", "en")}</>,
    },
  };
};

function PositioningScientificDomainTreemapInner({ countryCode: propCountryCode, currentLang: propLang }: PositioningScientificDomainTreemapProps) {
  const [metric, setMetric] = useState<MetricType>("projects");
  const [domainCode, setDomainCode] = useState<ScientificDomainCode>(SCIENTIFIC_DOMAINS[0].code);

  const { params, currentLang: urlLang, countryCode: urlCountryCode } = useGetParams();
  const currentLang = propLang || urlLang;
  const countryCode = propCountryCode || urlCountryCode;

  // Inclure le domaine scientifique dans les params de requête
  const queryParams = params ? `${params}&domaine_scientifique=${domainCode}` : `domaine_scientifique=${domainCode}`;

  const { data, isLoading } = useQuery({
    queryKey: ["ercPositioningScientificDomainTreemap", queryParams],
    queryFn: () => getData(queryParams),
    enabled: params !== "",
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const processedData = processTreemapData(data, countryCode, currentLang, metric, domainCode);

  const domainLabel = SCIENTIFIC_DOMAINS.find((d) => d.code === domainCode)?.label[currentLang as "fr" | "en"] ?? domainCode;
  // const metricLabel = getI18nLabel(i18n, metric === "projects" ? "projects" : "funding", currentLang).toLowerCase();
  const fallbackName = processedData.selectedCountry
    ? currentLang === "fr"
      ? processedData.selectedCountry.country_name_fr
      : processedData.selectedCountry.country_name_en
    : "";
  const countryDisplayName =
    currentLang === "fr" ? getCountryNameWithDe(countryCode, fallbackName) : getCountryNameWithArticle(countryCode, "en", fallbackName);
  const title = getI18nLabel(i18n, "main-title-with-country", currentLang).replace("{country}", countryDisplayName);

  const options = processedData.european.length > 0 ? Options({ processedData, currentLang }) : null;
  const config = getConfig(metric, domainCode, domainLabel);

  return (
    <div className="positioning-scientific-domain-treemap">
      <h3>{title}</h3>

      {/* Contrôles : sélecteur de domaine + toggle métrique */}
      <div className="positioning-scientific-domain-treemap__controls">
        <div className="select-wrapper">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="treemap-domain-select">
              {getI18nLabel(i18n, "select-domain", currentLang)}
            </label>
            <select
              className="fr-select"
              id="treemap-domain-select"
              onChange={(e) => setDomainCode(e.target.value as ScientificDomainCode)}
              value={domainCode}
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
          <SegmentedControl className="fr-segmented--sm" name="positioning-treemap-metric">
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

      {/* Graphique */}
      {processedData.european.length === 0 ? (
        <div className="fr-alert fr-alert--info">
          <p>{getI18nLabel(i18n, "no-data", currentLang)}</p>
        </div>
      ) : (
        <ChartWrapper config={config} options={options} renderData={() => renderDataTable(processedData, currentLang)} />
      )}
    </div>
  );
}

export default function PositioningScientificDomainTreemap({ countryCode, currentLang }: PositioningScientificDomainTreemapProps) {
  return <PositioningScientificDomainTreemapInner countryCode={countryCode} currentLang={currentLang} />;
}
