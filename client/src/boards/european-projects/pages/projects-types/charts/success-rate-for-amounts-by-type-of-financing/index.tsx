import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "@dataesr/dsfr-plus";

import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

import i18n from "../../../../i18n-global.json";

const config = {
  id: "successRateForAmountsByTypeOfFinancing",
  title: "",
  subtitle: "",
  description: "Attention EIT",
  integrationURL: "/european-projects/components/pages/analysis/overview/charts/projects-types-2",
};

export default function SuccessRateForAmountsByTypeOfFinancing() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);
  const currentLang = searchParams.get("language") || "fr";

  const { data, isLoading } = useQuery({
    queryKey: [config.id, params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  const rootStyles = getComputedStyle(document.documentElement);

  return (
    <Container fluid>
      <Row>
        <Col>
          <ChartWrapper
            config={config}
            options={options(data)}
            legend={
              <fieldset>
                <legend>{getI18nLabel("legend")}</legend>
                <div className="legend">
                  <ul>
                    <li>
                      <div
                        style={{
                          background: rootStyles.getPropertyValue("--selected-country-color"),
                        }}
                      />
                      <span>{getI18nLabel("selected-country")}</span>
                    </li>
                    <li>
                      <div
                        style={{
                          background: rootStyles.getPropertyValue("--associated-countries-color"),
                        }}
                      />
                      <span>{getI18nLabel("associated-countries")}</span>
                    </li>
                  </ul>
                </div>
              </fieldset>
            }
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
    </Container>
  );
}
