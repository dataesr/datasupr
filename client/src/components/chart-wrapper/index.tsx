import { useId, useRef, useState } from "react";
import React from "react";
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsOfflineExporting from "highcharts/modules/offline-exporting";
import HighchartsReact from "highcharts-react-official";
import { Button, Col, Container, Modal, ModalContent, ModalTitle, Radio, Row, Text, Title } from "@dataesr/dsfr-plus";

// Initialiser les modules d'export
HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);

// Configuration globale pour l'export offline
Highcharts.setOptions({
  exporting: {
    fallbackToExportServer: false,
  },
});
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import CopyButton from "../copy-button";
import translations from "./i18n.json";

import "./styles.scss";
import { useSearchParams } from "react-router-dom";

// Fonction utilitaire pour obtenir les traductions
function getTranslation(key: keyof typeof translations, lang: string = "fr"): string {
  return translations[key]?.[lang as "fr" | "en"] || translations[key]?.["fr"] || key;
}

// Fonction utilitaire pour extraire le texte d'un ReactNode
function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (React.isValidElement(node)) {
    if (node.props.children) {
      if (Array.isArray(node.props.children)) {
        return node.props.children.map(extractTextFromReactNode).join("");
      }
      return extractTextFromReactNode(node.props.children);
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
        [key: string]: string;
      }
    | null;
  integrationURL?: string;
};

export type HighchartsOptions = Highcharts.Options | null;

const { VITE_APP_URL } = import.meta.env;
const source = "Commission européenne, Cordis";
const sourceURL = "https://cordis.europa.eu/";

function IntegrationModal({ graphConfig, isOpen, modalId, setIsOpen }) {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  const integrationCode = `<iframe \ntitle="${graphConfig.title}" \nwidth="800" \nheight="600" \nsrc=${VITE_APP_URL}${graphConfig.integrationURL}></iframe>`;
  return (
    <Modal hide={() => setIsOpen(false)} isOpen={isOpen} key={`${modalId}-integrationModal`} size="lg">
      <ModalTitle>{getTranslation("integrationModalTitle", currentLang)}</ModalTitle>
      <ModalContent>
        <div className="text-right">
          <CopyButton text={integrationCode} />
        </div>
        <SyntaxHighlighter language="javascript" style={a11yDark}>
          {integrationCode}
        </SyntaxHighlighter>
        <div className="fr-mt-2w text-right">
          <Button color="beige-gris-galet" onClick={() => setIsOpen(false)} variant="secondary">
            {getTranslation("close", currentLang)}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

function MenuModal({ config, displayType, isOpen, setDisplayType, setIsOpen, setIsOpenIntegration, modalId, downloadCSV, downloadPNG, printChart }) {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  return (
    <Modal isOpen={isOpen} hide={() => setIsOpen(false)} size="sm" key={modalId}>
      <ModalContent className="modal-actions">
        <Title as="h1" look="h6">
          <span className="fr-icon-bar-chart-box-line fr-mr-1w" aria-hidden="true" />
          {getTranslation("modalTitle", currentLang)}
        </Title>

        <fieldset className="fr-fieldset" aria-labelledby="sélection du type d'affichage">
          <legend className="fr-fieldset__legend--regular fr-fieldset__legend" id="radio-hint-legend">
            {getTranslation("displayType", currentLang)}
          </legend>
          <div className="fr-fieldset__element">
            <Radio
              defaultChecked={displayType === "chart"}
              label={getTranslation("chart", currentLang)}
              name={`${modalId}_radio-hint`}
              onClick={() => setDisplayType("chart")}
            />
          </div>
          <div className="fr-fieldset__element">
            <Radio
              defaultChecked={displayType === "data"}
              label={getTranslation("data", currentLang)}
              name={`${modalId}_radio-hint`}
              onClick={() => setDisplayType("data")}
            />
          </div>
        </fieldset>
        <hr />
        <ul>
          <li>
            <Button
              color="beige-gris-galet"
              icon="file-download-line"
              title="téléchargement des données du graphique"
              variant="text"
              onClick={downloadCSV}
            >
              {getTranslation("downloadCSV", currentLang)}
            </Button>
          </li>
          <li>
            <Button color="beige-gris-galet" icon="image-line" title="téléchargement de l'image" variant="text" onClick={downloadPNG}>
              {getTranslation("downloadPNG", currentLang)}
            </Button>
          </li>
          <li>
            <Button color="beige-gris-galet" icon="printer-line" title="lancement de l'impression" variant="text" onClick={printChart}>
              {getTranslation("print", currentLang)}
            </Button>
          </li>
        </ul>
        <hr />
        <Container fluid>
          <Row>
            <Col>
              <Title as="h2" look="h6">
                {getTranslation("share", currentLang)}
              </Title>
              <div className="share">
                <Button color="beige-gris-galet" icon="twitter-x-fill" title="Twitter-X" variant="text" disabled />
                <Button color="beige-gris-galet" icon="linkedin-box-fill" title="Linkedin" variant="text" disabled />
                <Button color="beige-gris-galet" icon="facebook-circle-fill" title="Linkedin" variant="text" disabled />
              </div>
            </Col>
            <Col>
              <Title as="h2" look="h6">
                {getTranslation("integration", currentLang)}
              </Title>
              <div className="share">
                <Button
                  color="beige-gris-galet"
                  icon="code-s-slash-line"
                  onClick={() => {
                    if (config.integrationURL) {
                      setIsOpenIntegration(true);
                      setIsOpen(false);
                    }
                  }}
                  title={getTranslation("integration", currentLang)}
                  variant="secondary"
                  disabled={!config.integrationURL}
                >
                  {getTranslation("integration", currentLang)}
                </Button>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <Text className="sources">
                Sources :{" "}
                <a href={sourceURL} target="_blank" rel="noreferrer noopener">
                  {source}
                </a>
              </Text>
            </Col>
          </Row>
        </Container>
        <div className="fr-mt-2w text-right">
          <Button color="beige-gris-galet" onClick={() => setIsOpen(false)} variant="secondary">
            {getTranslation("close", currentLang)}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

// Composant Title exportable séparément
function ChartTitle({ config, children = null }: { config: ChartConfig; children?: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  if (!config.title) return <>{children}</>;

  // Si title est un string simple
  if (typeof config.title === "string") {
    return (
      <>
        <Title as="h2" look="h6" className="fr-mt-2w fr-mb-3w">
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
        className={config.title.className ? config.title.className : "fr-mt-2w fr-mb-3w"}
      >
        {config.title[currentLang]}
      </Title>
      {children}
    </>
  );
}

export default function ChartWrapper({
  config,
  options,
  legend,
  renderData,
  hideTitle = false,
}: {
  config: ChartConfig;
  options: HighchartsOptions;
  legend: React.ReactNode;
  renderData?: (options: Highcharts.Options) => React.ReactNode;
  hideTitle?: boolean;
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
      chart.current.chart.downloadCSV();
    }
  };

  const downloadPNG = () => {
    if (chart && chart.current && chart.current.chart) {
      try {
        // Utiliser l'export offline
        chart.current.chart.exportChart(
          {
            type: "image/png",
            filename: config.title && typeof config.title === "string" ? config.title : "graphique",
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
        alert("L'export PNG a échoué. Vous pouvez utiliser Ctrl+P pour imprimer la page.");
      }
    }
  };

  const printChart = () => {
    if (chart && chart.current && chart.current.chart) {
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
        const currentTitle = chart.current.chart.options.title;

        // Mettre à jour temporairement le titre pour l'impression
        chart.current.chart.update(
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

        // Imprimer
        chart.current.chart.print();

        // Restaurer le titre original après un délai
        setTimeout(() => {
          if (chart.current && chart.current.chart) {
            chart.current.chart.update(
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
    <section>
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
        <figure>
          <HighchartsReact highcharts={Highcharts} options={options} ref={chart} />
        </figure>
      )}
      <div className="graph-footer fr-pt-1w">
        {legend}
        {config.description && config.description !== null && (
          <div className="fr-notice fr-notice--info fr-mt-1w">
            <div className="fr-container">
              <div className="fr-notice__body">
                <Text className="description">{typeof config.description === "string" ? config.description : config.description[currentLang]}</Text>
              </div>
            </div>
          </div>
        )}
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

// Ajout de la propriété Title au composant principal
ChartWrapper.Title = ChartTitle;
