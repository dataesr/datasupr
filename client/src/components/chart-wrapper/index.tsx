import { useId, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Button,
  Col,
  Container,
  Modal,
  ModalContent,
  ModalTitle,
  Radio,
  Row,
  Text,
  Title,
} from "@dataesr/dsfr-plus";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import CopyButton from "../copy-button";

import "./styles.scss";
import { useSearchParams } from "react-router-dom";


const { VITE_APP_URL } = import.meta.env;
  const source = "Commission européenne, Cordis";
  const sourceURL = "https://cordis.europa.eu/";

  function IntegrationModal({ graphConfig, isOpen, modalId, setIsOpen }) {
    const integrationCode = `<iframe \ntitle="${graphConfig.title}" \nwidth="800" \nheight="600" \nsrc=${VITE_APP_URL}${graphConfig.integrationURL}></iframe>`;
    return (
      <Modal hide={() => setIsOpen(false)} isOpen={isOpen} key={`${modalId}-integrationModal`} size="lg">
        <ModalTitle>Intégrer ce graphique dans un autre site</ModalTitle>
        <ModalContent>
          <div className="text-right">
            <CopyButton text={integrationCode} />
          </div>
          <SyntaxHighlighter language="javascript" style={a11yDark}>
            {integrationCode}
          </SyntaxHighlighter>
        </ModalContent>
      </Modal>
    );
  }

  function MenuModal({ displayType, isOpen, setDisplayType, setIsOpen, setIsOpenIntegration, modalId }) {
    return (
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)} size="sm" key={modalId}>
        <ModalContent className="modal-actions">
          <Title as="h1" look="h6">
            <span className="fr-icon-bar-chart-box-line fr-mr-1w" aria-hidden="true" />
            Options du graphique
          </Title>

          <fieldset className="fr-fieldset" aria-labelledby="sélection du type d'affichage">
            <legend className="fr-fieldset__legend--regular fr-fieldset__legend" id="radio-hint-legend">
              Type d'affichage
            </legend>
            <div className="fr-fieldset__element">
              <Radio
                defaultChecked={displayType === "chart"}
                label="Graphique"
                name={`${modalId}_radio-hint`}
                onClick={() => setDisplayType("chart")}
              />
            </div>
            <div className="fr-fieldset__element">
              <Radio defaultChecked={displayType === "data"} label="Données" name={`${modalId}_radio-hint`} onClick={() => setDisplayType("data")} />
            </div>
          </fieldset>
          <hr />
          <ul>
            <li>
              <Button color="beige-gris-galet" icon="file-download-line" title="téléchargement des données du graphique" variant="text" disabled>
                Télécharger les données (csv)
              </Button>
            </li>
            <li>
              <Button color="beige-gris-galet" icon="image-line" title="téléchargement de l'image" variant="text" disabled>
                Télécharger l'image (png)
              </Button>
            </li>
            <li>
              <Button color="beige-gris-galet" icon="printer-line" title="lancement de l'impression" variant="text" disabled>
                Imprimer
              </Button>
            </li>
          </ul>
          <hr />
          <Container fluid>
            <Row>
              <Col>
                <Title as="h2" look="h6">
                  Partager
                </Title>
                <div className="share">
                  <Button color="beige-gris-galet" icon="twitter-x-fill" title="Twitter-X" variant="text" disabled />
                  <Button color="beige-gris-galet" icon="linkedin-box-fill" title="Linkedin" variant="text" disabled />
                  <Button color="beige-gris-galet" icon="facebook-circle-fill" title="Linkedin" variant="text" disabled />
                </div>
              </Col>
              <Col>
                <Title as="h2" look="h6">
                  Intégrer
                </Title>
                <div className="share">
                  <Button
                    color="beige-gris-galet"
                    icon="code-s-slash-line"
                    onClick={() => {
                      setIsOpenIntegration(true);
                      setIsOpen(false);
                    }}
                    title="Intégration"
                    variant="secondary"
                  >
                    Intégrer
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
        </ModalContent>
      </Modal>
    );
  }

  export default function ChartWrapper({ config, options, legend, renderData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenIntegration, setIsOpenIntegration] = useState(false);
    const [displayType, setDisplayType] = useState("chart"); // ["chart", "data"]
    const modalId = useId();
    const [searchParams] = useSearchParams();
    const currentLang = searchParams.get("language") || "fr";

    if (displayType === "data" && !renderData) {
      setDisplayType("chart");
      return null;
    }

    return (
      <section>
        {config.title[currentLang] && (
          <Title as="h2" look="h4" className="fr-mb-1w">
            <span dangerouslySetInnerHTML={{ __html: config.title[currentLang] }} />
          </Title>
        )}
        {config.subtitle && (
          <Title as={config.title[currentLang] ? "h3" : "h2"} look="h6" className="fr-mb-0">
            <span dangerouslySetInnerHTML={{ __html: config.subtitle }} />
          </Title>
        )}
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
        {displayType === "data" && renderData && <>{renderData(options)}</>}
        {displayType === "chart" && (
          <figure>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </figure>
        )}
        <div className="graph-footer fr-pt-1w">
          {legend}
          {config.description?.[currentLang] && (
            <div className="fr-notice fr-notice--info fr-mt-1w">
              <div className="fr-container">
                <div className="fr-notice__body">
                  <Text className="description">{config.description[currentLang]}</Text>
                </div>
              </div>
            </div>
          )}
        </div>
        <MenuModal
          displayType={displayType}
          isOpen={isOpen}
          setDisplayType={setDisplayType}
          setIsOpen={setIsOpen}
          setIsOpenIntegration={setIsOpenIntegration}
          modalId={modalId}
        />
        <IntegrationModal graphConfig={config} isOpen={isOpenIntegration} setIsOpen={setIsOpenIntegration} modalId={modalId} />
      </section>
    );
  }
