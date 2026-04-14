import { Button, Col, Container, Modal, ModalContent, ModalTitle, Radio, Row, Title } from "@dataesr/dsfr-plus";
import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
import HighchartsReact from "highcharts-react-official";
import "highcharts/es-modules/masters/highcharts-more.src.js";
import "highcharts/es-modules/masters/modules/exporting.src.js";
import "highcharts/es-modules/masters/modules/export-data.src.js";
import "highcharts/es-modules/masters/modules/map.src.js";
import "highcharts/es-modules/masters/modules/flowmap.src.js";
import "highcharts/es-modules/masters/modules/offline-exporting.src.js";
import "highcharts/es-modules/masters/modules/variable-pie.src.js";
import "highcharts/es-modules/masters/modules/sankey.src.js";
import "highcharts/es-modules/masters/modules/treemap.src.js";

import "highcharts/es-modules/masters/modules/accessibility.src.js";


import React, { useId, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { useSearchParams } from "react-router-dom";
import { deepMerge, getI18nLabel } from "../../utils";
import ChartFooter from "../chart-footer";
import CopyButton from "../copy-button";
import i18n from "./i18n.json";

import "./styles.scss";


// Configuration globale pour l'export offline
Highcharts.setOptions({
  exporting: {
    fallbackToExportServer: false,
  },
});

// Import des types pour ChartFooter
interface LocalizedContent {
  fr: JSX.Element;
  en?: JSX.Element;
}

interface LocalizedUrl {
  fr: string;
  en?: string;
}

interface Source {
  label: LocalizedContent;
  update?: Date;
  url: LocalizedUrl;
}

export type ChartConfig = {
  comment?: LocalizedContent;
  description?:
  | string
  | {
    [key: string]: React.ReactNode;
  }
  | null;
  id: string;
  idQuery?: string;
  integrationURL?: string;
  readingKey?: LocalizedContent;
  sources?: Source[];
  subtitle?: string;
  title?:
  | string
  | {
    [key: string]: React.ReactNode;
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    look?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    className?: string;
  };
};

export type HighchartsOptions = Highcharts.Options | any | null;

const { VITE_APP_URL } = import.meta.env;

function IntegrationModal({ graphConfig, isOpen, modalId, setIsOpen }) {
  const integrationCode = `<iframe \ntitle="${graphConfig.title}" \nwidth="800" \nheight="600" \nsrc="${VITE_APP_URL}${graphConfig.integrationURL}"></iframe>`;
  return (
    <Modal
      hide={() => setIsOpen(false)}
      isOpen={isOpen}
      key={`${modalId}-integrationModal`}
      size="lg"
    >
      <ModalTitle>
        {getI18nLabel(i18n, "integrationModalTitle")}
      </ModalTitle>
      <ModalContent>
        <div className="text-right">
          <CopyButton text={integrationCode} />
        </div>
        <SyntaxHighlighter language="javascript" style={a11yDark}>
          {integrationCode}
        </SyntaxHighlighter>
        <div className="fr-mt-2w text-right">
          <Button
            color="beige-gris-galet"
            onClick={() => setIsOpen(false)}
            variant="secondary"
          >
            {getI18nLabel(i18n, "close")}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

function MenuModal({
  config,
  displayType,
  downloadCSV,
  downloadPNG,
  isOpen,
  modalId,
  printChart,
  setDisplayType,
  setIsOpen,
  setIsOpenIntegration,
}) {
  return (
    <Modal
      hide={() => setIsOpen(false)}
      isOpen={isOpen}
      key={modalId}
      size="sm"
    >
      <ModalContent className="modal-actions">
        <Title as="h1" look="h6">
          <span
            aria-hidden="true"
            className="fr-icon-bar-chart-box-line fr-mr-1w"
          />
          {getI18nLabel(i18n, "modalTitle")}
        </Title>

        <fieldset
          aria-labelledby="sélection du type d'affichage"
          className="fr-fieldset"
        >
          <legend
            className="fr-fieldset__legend--regular fr-fieldset__legend"
            id="radio-hint-legend"
          >
            {getI18nLabel(i18n, "displayType")}
          </legend>
          <div className="fr-fieldset__element">
            <Radio
              defaultChecked={displayType === "chart"}
              label={getI18nLabel(i18n, "chart")}
              name={`${modalId}_radio-hint`}
              onClick={() => setDisplayType("chart")}
            />
          </div>
          <div className="fr-fieldset__element">
            <Radio
              defaultChecked={displayType === "data"}
              label={getI18nLabel(i18n, "data")}
              name={`${modalId}_radio-hint`}
              onClick={() => setDisplayType("data")}
            />
          </div>
        </fieldset>
        <hr />
        <ul>
          <li>
            <Button
              icon="file-download-line"
              onClick={downloadCSV}
              title="Téléchargement des données du graphique"
              variant="text"
            >
              {getI18nLabel(i18n, "downloadCSV")}
            </Button>
          </li>
          <li>
            <Button
              icon="image-line"
              onClick={downloadPNG}
              title="Téléchargement de l'image"
              variant="text"
            >
              {getI18nLabel(i18n, "downloadPNG")}
            </Button>
          </li>
          <li>
            <Button
              icon="printer-line"
              onClick={printChart}
              title="Lancement de l'impression"
              variant="text"
            >
              {getI18nLabel(i18n, "print")}
            </Button>
          </li>
        </ul>
        <hr />
        <Container fluid>
          <Row>
            <Col>
              <Title as="h2" look="h6">
                {getI18nLabel(i18n, "share")}
              </Title>
              <div className="share">
                <Button
                  disabled
                  icon="twitter-x-fill"
                  title="Twitter-X"
                  variant="text"
                />
                <Button
                  disabled
                  icon="linkedin-box-fill"
                  title="Linkedin"
                  variant="text"
                />
                <Button
                  disabled
                  icon="facebook-circle-fill"
                  title="Facebook"
                  variant="text"
                />
              </div>
            </Col>
            <Col>
              <Title as="h2" look="h6" className="text-right">
                {getI18nLabel(i18n, "integration")}
              </Title>
              <div className="share text-right">
                <Button
                  disabled={!config.integrationURL}
                  icon="code-s-slash-line"
                  onClick={() => {
                    if (config.integrationURL) {
                      setIsOpenIntegration(true);
                      setIsOpen(false);
                    }
                  }}
                  title={getI18nLabel(i18n, "integration")}
                  variant="secondary"
                >
                  {getI18nLabel(i18n, "integration")}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
        <div className="fr-mt-2w text-right">
          <hr />
          <Button onClick={() => setIsOpen(false)}>
            {getI18nLabel(i18n, "close")}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

// Composant Title exportable séparément
function ChartTitle({
  config,
  children = null,
}: {
  config: ChartConfig;
  children?: React.ReactNode;
}) {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  if (!config.title) return <>{children}</>;

  // Si title est un string simple
  if (typeof config.title === "string") {
    return (
      <>
        <Title as="h2" look="h6" className="fr-m-0">
          {config.title}
        </Title>
        {children}
      </>
    );
  };

  // Si title est un objet avec configuration
  return (
    <>
      <Title
        as={config.title.size ? config.title.size : "h2"}
        className={config.title.className ? config.title.className : "fr-my-0"}
        look={config.title.look ? config.title.look : "h6"}
      >
        {config.title[currentLang]}
      </Title>
      {children}
    </>
  );
}

// See bug here : https://github.com/highcharts/highcharts/issues/23268
interface CurrentChart extends Highcharts.Chart {
  downloadCSV: () => string;
  exportChart: (exportingOptions: Highcharts.ExportingOptions, chartOptions: Highcharts.Options) => string;
  print: () => string;
}

export default function ChartWrapper({
  config,
  constructorType,
  hideTitle = false,
  legend,
  options,
  renderData,
}: {
  config: ChartConfig;
  constructorType?: "chart" | "stockChart" | "mapChart";
  hideTitle?: boolean;
  legend?: React.ReactNode;
  options: HighchartsOptions;
  renderData?: (options: Highcharts.Options) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenIntegration, setIsOpenIntegration] = useState(false);
  const [displayType, setDisplayType] = useState("chart"); // ["chart", "data"]
  const modalId = useId();

  const chart = useRef<HighchartsReact.RefObject>(null);

  // Si les options sont null, ne pas afficher le graphique
  if (!options) {
    return null;
  };

  const downloadCSV = () => {
    if (chart && chart.current && chart.current.chart) {
      const currentChart = chart.current.chart as CurrentChart;
      currentChart.downloadCSV();
    }
  };

  const downloadPNG = () => {
    if (chart && chart.current && chart.current.chart) {
      const currentChart = chart.current.chart as CurrentChart;
      try {
        // Utiliser l'export offline
        currentChart.exportChart(
          {
            type: "image/png",
            sourceWidth: 800,
            sourceHeight: 600,
            scale: 2, // Pour une meilleure qualité
          },
          {
            exporting: {
              fallbackToExportServer: false,
            },
          }
        );
      } catch (error) {
        console.error("Erreur lors de l'export PNG:", error);
      }
    }
  };

  const printChart = () => {
    if (chart && chart.current && chart.current.chart) {
      const currentChart = chart.current.chart as CurrentChart;
      try {
        currentChart.print();
      } catch (error) {
        console.error("Erreur lors de l'impression: ", error);
        // Fallback : ouvrir la fenêtre d'impression du navigateur
        window.print();
      }
    } else {
      // Si pas de graphique, imprimer la page entière
      window.print();
    }
  };

  const exportingOptions = {
    exporting: {
      chartOptions: { title: { text: config?.title } },
      filename: config?.title ?? 'chart',
      showTable: displayType === 'data',
    }
  };
  const optionsTmp: HighchartsOptions = deepMerge(options, exportingOptions);

  if (chart && chart.current && chart.current.chart && !renderData) {
    const currentChart = chart.current.chart as CurrentChart;
    currentChart.update({
      exporting: {
        showTable: displayType === 'data',
        tableCaption: getI18nLabel(i18n, "data"),
      }
    });
  };

  // Force delete element DOM of data table of Highchart
  if (displayType !== 'data') {
    const elt: HTMLElement = document.getElementsByClassName("highcharts-data-table")?.[0] as HTMLElement;
    elt?.style?.setProperty("display", "none");
  };

  return (
    <section className="chart-container">
      {!hideTitle && <ChartTitle config={config} />}
      <div className="actions">
        <Button
          color="beige-gris-galet"
          icon="settings-5-line"
          onClick={() => setIsOpen(true)}
          size="sm"
          style={{ minHeight: "1rem", padding: "0 0.5rem" }}
          variant="text"
        />
      </div>
      {displayType === "data" && renderData && options && <>{renderData(options)}</>}
      {((displayType === "chart" && renderData) || (!renderData)) && optionsTmp && (
        <figure className="chart">
          <HighchartsReact constructorType={constructorType} highcharts={Highcharts} options={optionsTmp} ref={chart} />
        </figure>
      )}
      <div className="fr-pt-1w">
        {legend && legend}
        <div className="chart-footer">
          <ChartFooter comment={config.comment} readingKey={config.readingKey} sources={config.sources} />
        </div>
      </div>
      <MenuModal
        config={config}
        displayType={displayType}
        downloadCSV={downloadCSV}
        downloadPNG={downloadPNG}
        isOpen={isOpen}
        modalId={modalId}
        printChart={printChart}
        setDisplayType={setDisplayType}
        setIsOpen={setIsOpen}
        setIsOpenIntegration={setIsOpenIntegration}
      />
      <IntegrationModal
        graphConfig={config}
        isOpen={isOpenIntegration && !!config.integrationURL}
        modalId={modalId}
        setIsOpen={setIsOpenIntegration}
      />
    </section>
  );
}

// Ajout de la propriété Title au composant principal
ChartWrapper.Title = ChartTitle;
