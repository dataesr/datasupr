import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

import { GetData } from "./query";
import optionsSubventionsValues from "./options-subventions_values";
import optionsSubventionsRates from "./options-subventions_rates";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

import i18n from "../../../../i18n-global.json";

const configChart1 = {
  id: "typeOfFinancingSubsidiesRequestedByProjects",
  title: "",
  subtitle: "Subventions demandées et obtenues (M€) <br />&nbsp;",
  description: null,
  integrationURL: "/european-projects/components/pages/analysis/overview/charts/projects-types-1",
};

const configChart2 = {
  id: "typeOfFinancingSubsidiesRequestedByProjectsRates",
  title: "",
  subtitle: "Part des subventions demandées et obtenues sur HE",
  description: null,
  integrationURL: "/european-projects/components/pages/analysis/overview/charts/projects-types-1",
};

export default function TypeOfFinancingSubsidiesRequestedByProjects() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);
  const currentLang = searchParams.get("language") || "fr";

  const { data, isLoading } = useQuery({
    queryKey: [
      configChart1.id,
      params,
      Cookies.get("selectedPillars"),
      Cookies.get("selectedPrograms"),
      Cookies.get("selectedTopics"),
      Cookies.get("selectedDestinations"),
    ],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton col={2} />;

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  const rootStyles = getComputedStyle(document.documentElement);

  return (
    <Container fluid>
      <Row>
        <Col>
          <ChartWrapper
            config={configChart1}
            options={optionsSubventionsValues(data)}
            legend={null}
            renderData={() => null} // TODO: add data table
          />
        </Col>
        <Col>
          <ChartWrapper
            config={configChart2}
            options={optionsSubventionsRates(data)}
            legend={null}
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <fieldset>
            <legend>{getI18nLabel("legend")}</legend>
            <div className="legend">
              <ul>
                <li>
                  <div
                    style={{
                      background: rootStyles.getPropertyValue("--evaluated-project-color"),
                    }}
                  />
                  <span>{getI18nLabel("evaluated-projects")}</span>
                </li>
                <li>
                  <div
                    style={{
                      background: rootStyles.getPropertyValue("--successful-project-color"),
                    }}
                  />
                  <span>{getI18nLabel("successful-prjects")}</span>
                </li>
              </ul>
            </div>
          </fieldset>
        </Col>
      </Row>
    </Container>
  );
}
