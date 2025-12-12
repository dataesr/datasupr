import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getOptions, getSeries } from "./utils.tsx";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopFundersByStructure() {
  const [selectedStructure, setSelectedStructure] = useState<string>("180089013");
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2000");
  const color = useChartColor();

  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              year: {
                gte: selectedYearStart,
                lte: selectedYearEnd
              }
            }
          },
          {
            term: {
              "participants.structure.id": selectedStructure
            }
          }
        ]
      }
    },
    aggs: {
      by_funder: {
        terms: {
          field: "type.keyword"
        }
      }
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: [`scanr-top-funders-by-structure`, selectedStructure, selectedYearEnd, selectedYearStart],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-projects`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });
  if (isLoading || !data) return <DefaultSkeleton />;
  const { series, categories } = getSeries(data);

  const config = {
    id: "fundedStructures",
    integrationURL: "/scanr/components/pages/overview/charts/top-funders-by-structure",
    title: `Principaux financeurs pour ${selectedStructure} sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };

  const options: object = getOptions(
    series,
    categories,
    '',
    'a financé',
    `projet(s) auquel(s) prend part ${selectedStructure} sur la période ${selectedYearStart}-${selectedYearEnd}`,
    '',
    'Nombre de projets financés',
  );

  const structures = [
    { name: "Centre national de la recherche scientifique", id: "180089013" },
    { name: "Université de Montpellier", id: "130029796" }
  ]
  const years = Array.from(Array(25).keys()).map((item) => item + 2000);

  return (
    <div className={`chart-container chart-container--${color}`} id="top-funders-by-structure">
      <Row gutters className="form-row">
        <Col md={12}>
          <select
            name="scanr-structure"
            id="scanr-structure"
            className="fr-mb-2w fr-select"
            value={selectedStructure}
            onChange={(e) => setSelectedStructure(e.target.value)}
          >
            <option disabled value="">Sélectionnez une structure</option>
            {structures.map((structure) => (
              <option key={structure.id} value={structure.id}>
                {structure.name}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <Row gutters className="form-row">
        <Col md={6}>
          <select
            name="scanr-year-start"
            id="scanr-year-start"
            className="fr-mb-2w fr-select"
            value={selectedYearStart}
            onChange={(e) => setSelectedYearStart(e.target.value)}
          >
            <option disabled value="">Sélectionnez une année de début</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Col>
        <Col md={6}>
          <select
            name="scanr-year-end"
            id="scanr-year-end"
            className="fr-mb-2w fr-select"
            value={selectedYearEnd}
            onChange={(e) => setSelectedYearEnd(e.target.value)}
          >
            <option disabled value="">Sélectionnez une année de fin</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <ChartWrapper
        config={config}
        legend={null}
        options={options}
      />
    </div>
  );
}
