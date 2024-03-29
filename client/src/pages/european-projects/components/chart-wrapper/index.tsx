import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getConfig } from "../../utils";
import { Button, Modal, ModalContent, ModalTitle, Text, Title } from "@dataesr/dsfr-plus";

const { VITE_APP_URL } = import.meta.env;

import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import "./styles.scss";
import { useState } from "react";
import CopyButton from "../../../../components/copy-button";

export default function ChartWrapper({ id, options, legend }) {
  const [isOpen, setIsOpen] = useState(false);
  const graphConfig = getConfig(id);

  const integrationCode = `<iframe \ntitle="${graphConfig.title}" \nwidth="800" \nheight="600" \nsrc=${VITE_APP_URL}${graphConfig.integrationURL}></iframe>`;

  return (
    <section>
      {
        graphConfig.title && (
          <>
            <Title as="h2" look="h4" className="fr-mb-1w">{graphConfig.title}</Title>
            <Text className="sources">
              Sources : <a href={graphConfig.sourceURL} target="_blank" rel="noreferrer noopener">{graphConfig.source}</a>
            </Text>
          </>
        )
      }
      {
        graphConfig.subtitle && <Title as="h3" look="h6" className="fr-mb-0">{graphConfig.subtitle}</Title>
      }
      <figure>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </figure>
      <div className="graph-footer fr-pt-1w">
        {legend}

        <div className="fr-notice fr-notice--info fr-mt-1w">
          <div className="fr-container">
            <div className="fr-notice__body">
              <Text className="description">
                {graphConfig.description}
              </Text>
            </div>
          </div>
        </div>
        <div className="share">
          <Button
            color="beige-gris-galet"
            icon="twitter-x-fill"
            title="Twitter-X"
            variant="text"
          />
          <Button title="Linkedin" icon="linkedin-box-fill" variant="text" color="beige-gris-galet" />
          <Button title="Linkedin" icon="facebook-circle-fill" variant="text" color="beige-gris-galet" />
          <Button
            color="beige-gris-galet"
            icon="code-s-slash-line"
            onClick={() => setIsOpen(true)}
            title="Intégration"
            variant="text"
          >
            Intégrer
          </Button>
        </div>
      </div>

      <Modal isOpen={isOpen} hide={() => setIsOpen(false)} size="lg">
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
    </section>
  );
}