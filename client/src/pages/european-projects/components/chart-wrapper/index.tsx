import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getConfig } from "../../utils";
import { Text, Title } from "@dataesr/dsfr-plus";

import "./styles.scss";

export default function ChartWrapper({ id, options, legend }) {
  const graphConfig = getConfig(id);

  return (
    <>
      <Title as="h2" look="h4" className="fr-mb-0">{graphConfig.title}</Title>
      <p className="sources">
        Sources : <a href={graphConfig.sourceURL} target="_blank" rel="noreferrer noopener">{graphConfig.source}</a>
      </p>
      <figure>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </figure>
      <div className="graph-footer">
        {legend}
        <div>
          <p className="share">
            Partage
          </p>
        </div>
      </div>
      <Text className="description">
        {graphConfig.description}
      </Text>
    </>
  );
}