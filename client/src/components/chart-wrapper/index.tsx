import { Button, Col, Container, Modal, ModalContent, ModalTitle, Radio, Row, Title } from "@dataesr/dsfr-plus";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/exporting";
import "highcharts/modules/map";
import "highcharts/modules/offline-exporting";
import React, { useId, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { useSearchParams } from "react-router-dom";
import { getI18nLabel } from "../../utils";
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

// Fonction utilitaire pour extraire le texte d'un ReactNode
function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    if (props.children) {
      if (Array.isArray(props.children)) {
        return props.children.map(extractTextFromReactNode).join("");
      }
      return extractTextFromReactNode(props.children);
    }
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join("");
  }
  return "";
}

export type ChartConfig = {
  id: string;
  idQuery?: string;
  subtitle?: string;
  title?:
    | string
    | {
        [key: string]: React.ReactNode;
        size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        look?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        className?: string;
      };
  description?:
    | string
    | {
        [key: string]: React.ReactNode;
      }
    | null;
  integrationURL?: string;
  comment?: LocalizedContent;
  readingKey?: LocalizedContent;
  sources?: Source[];
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
      isOpen={isOpen}
      hide={() => setIsOpen(false)}
      size="sm"
      key={modalId}
    >
      <ModalContent className="modal-actions">
        <Title as="h1" look="h6">
          <span
            className="fr-icon-bar-chart-box-line fr-mr-1w"
            aria-hidden="true"
          />
          {getI18nLabel(i18n, "modalTitle")}
        </Title>

        <fieldset
          className="fr-fieldset"
          aria-labelledby="sélection du type d'affichage"
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
              title="téléchargement des données du graphique"
              variant="text"
              onClick={downloadCSV}
            >
              {getI18nLabel(i18n, "downloadCSV")}
            </Button>
          </li>
          <li>
            <Button
              icon="image-line"
              title="téléchargement de l'image"
              variant="text"
              onClick={downloadPNG}
            >
              {getI18nLabel(i18n, "downloadPNG")}
            </Button>
          </li>
          <li>
            <Button
              icon="printer-line"
              title="lancement de l'impression"
              variant="text"
              onClick={printChart}
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
                  icon="twitter-x-fill"
                  title="Twitter-X"
                  variant="text"
                  disabled
                />
                <Button
                  icon="linkedin-box-fill"
                  title="Linkedin"
                  variant="text"
                  disabled
                />
                <Button
                  icon="facebook-circle-fill"
                  title="Linkedin"
                  variant="text"
                  disabled
                />
              </div>
            </Col>
            <Col>
              <Title as="h2" look="h6" className="text-right">
                {getI18nLabel(i18n, "integration")}
              </Title>
              <div className="share text-right">
                <Button
                  icon="code-s-slash-line"
                  onClick={() => {
                    if (config.integrationURL) {
                      setIsOpenIntegration(true);
                      setIsOpen(false);
                    }
                  }}
                  title={getI18nLabel(i18n, "integration")}
                  variant="secondary"
                  disabled={!config.integrationURL}
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
  }

  // Si title est un objet avec configuration
  return (
    <>
      <Title
        as={config.title.size ? config.title.size : "h2"}
        look={config.title.look ? config.title.look : "h6"}
        className={config.title.className ? config.title.className : "fr-my-0"}
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
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  const chart = useRef<HighchartsReact.RefObject>(null);

  if (displayType === "data" && !renderData) {
    setDisplayType("chart");
    return null;
  }

  // Si les options sont null, ne pas afficher le graphique
  if (!options) {
    return null;
  }

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
            filename:
              config.title && typeof config.title === "string"
                ? config.title
                : "graphique",
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
        // Fallback alternatif : essayer avec la méthode print
        alert(
          "L'export PNG a échoué. Vous pouvez utiliser Ctrl+P pour imprimer la page."
        );
      }
    }
  };

  const printChart = () => {
    if (chart && chart.current && chart.current.chart) {
      const currentChart = chart.current.chart as CurrentChart;
      try {
        // Obtenir le titre du graphique
        let chartTitle = "Graphique";
        if (config.title && typeof config.title === "string") {
          chartTitle = config.title;
        } else if (config.title && typeof config.title === "object" && config.title[currentLang]) {
          // Si c'est un ReactNode, essayer d'extraire le texte
          const titleContent = config.title[currentLang];
          if (typeof titleContent === "string") {
            chartTitle = titleContent;
          } else {
            // Pour les ReactNode complexes, utiliser la fonction d'extraction
            const extractedText = extractTextFromReactNode(titleContent);
            chartTitle = extractedText || "Graphique";
          }
        }
        // Sauvegarder le titre actuel
        const currentTitle = currentChart.options.title;
        // Mettre à jour temporairement le titre pour l'impression
        currentChart.update(
          {
            title: {
              text: chartTitle,
              style: {
                fontSize: "18px",
                fontWeight: "bold",
              },
            },
          },
          false
        );
        currentChart.print();
        // Restaurer le titre original après un délai
        setTimeout(() => {
          if (currentChart) {
            currentChart.update(
              {
                title: currentTitle,
              },
              false
            );
          }
        }, 100);
      } catch (error) {
        console.error("Erreur lors de l'impression:", error);
        // Fallback : ouvrir la fenêtre d'impression du navigateur
        window.print();
      }
    } else {
      // Si pas de graphique, imprimer la page entière
      window.print();
    }
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
      {displayType === "chart" && options && (
        <figure className="chart">
          <HighchartsReact highcharts={Highcharts} options={options} ref={chart} constructorType={constructorType} />
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
        isOpen={isOpen}
        setDisplayType={setDisplayType}
        setIsOpen={setIsOpen}
        setIsOpenIntegration={setIsOpenIntegration}
        modalId={modalId}
        downloadCSV={downloadCSV}
        downloadPNG={downloadPNG}
        printChart={printChart}
      />
      <IntegrationModal
        graphConfig={config}
        isOpen={isOpenIntegration && !!config.integrationURL}
        setIsOpen={setIsOpenIntegration}
        modalId={modalId}
      />
    </section>
  );
}

// Ajout de la propriété Title au composant principal
ChartWrapper.Title = ChartTitle;
