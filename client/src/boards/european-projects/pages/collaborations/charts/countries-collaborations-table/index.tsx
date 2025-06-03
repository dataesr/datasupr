import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Button, Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { GetData } from "./query";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

import i18nGlobal from "../../../../i18n-global.json";
import i18nLocal from "./i18n.json";
import { getFlagEmoji } from "../../../../utils";
import { getNeighbouringCountriesFromIso3 } from "../../../../../../utils";

export default function CountriesCollaborationsTable() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortColumn, setSortColumn] = useState("collaborations");
  const [showAll, setShowAll] = useState(false);
  const currentLang = searchParams.get("language") || "fr";
  const country_code = searchParams.get("country_code") || "FRA";

  const configChart = {
    id: "CountriesCollaborationsTable",
    queryId: "CountriesCollaborations",
    title: {
      fr: `Liste des pays collaborateurs`,
      en: "List of collaborating countries",
    },
    subtitle: "",
    description: null,
    integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-participating-organizations",
  };

  const { data, isLoading } = useQuery({
    queryKey: [
      configChart.id,
      country_code,
      Cookies.get("selectedPillars"),
      Cookies.get("selectedPrograms"),
      Cookies.get("selectedThematics"),
      Cookies.get("selectedDestinations"),
    ],
    queryFn: () => GetData(country_code),
  });

  const { data: dataCountries } = useQuery({
    queryKey: ["getNeighbouringCountriesFromIso3", country_code],
    queryFn: () => getNeighbouringCountriesFromIso3(country_code),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const i18n = { ...i18nGlobal, ...i18nLocal };
  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      if (sortColumn === "country") {
        return sortDirection === "asc" ? a.country_name_fr.localeCompare(b.country_name_fr) : b.country_name_fr.localeCompare(a.country_name_fr);
      }
      return sortDirection === "asc" ? a.total_collaborations - b.total_collaborations : b.total_collaborations - a.total_collaborations;
    });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = sortData(data);
  const displayedData = showAll ? sortedData : sortedData.slice(0, 10);
  const neighbouringCountriesSum = dataCountries
    ? dataCountries.reduce((acc, code) => {
        const countryData = sortedData.find((item) => item.country_code === code);
        return acc + (countryData ? countryData.total_collaborations : 0);
      }, 0)
    : 0;
  const neighbouringCountriesSumWithCountry =
    neighbouringCountriesSum + (data.find((item) => item.country_code === country_code)?.total_collaborations || 0);

  const total_collaborations = sortedData.reduce((acc, item) => acc + item.total_collaborations, 0);

  const handleCountryClick = (countryCode) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("country_code", countryCode);
    navigate(`?${newSearchParams.toString()}`);
  };

  return (
    <Container fluid className="fr-mt-5w">
      <Row>
        <Title as="h2" className="fr-mb-3w">
          {configChart.title[currentLang]}
        </Title>
      </Row>
      <Row>
        <Col>
          <div className="fr-table--sm fr-table fr-table" id="table-sm-component">
            <div className="fr-table__wrapper">
              <div className="fr-table__container">
                <div className="fr-table__content">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <button className="fr-btn fr-btn--tertiary-no-outline" onClick={() => handleSort("country")}>
                            {getI18nLabel("country")} {sortColumn === "country" && (sortDirection === "asc" ? "↑" : "↓")}
                          </button>
                        </th>
                        <th>
                          <button className="fr-btn fr-btn--tertiary-no-outline" onClick={() => handleSort("collaborations")}>
                            {getI18nLabel("collaborations-count")} {sortColumn === "collaborations" && (sortDirection === "asc" ? "↑" : "↓")}
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedData.map((item) => (
                        <tr key={item.country_code}>
                          <td>
                            <button className="fr-btn fr-btn--tertiary-no-outline fr-p-0" onClick={() => handleCountryClick(item.country_code)}>
                              {getFlagEmoji(item.country_code)}
                              <span className="fr-ml-1w">{item[`country_name_${currentLang}`]}</span>
                            </button>
                          </td>
                          <td>{item.total_collaborations}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={2} className="fr-text--sm">
                          {getI18nLabel("total-collaborations")}
                          {total_collaborations.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {sortedData.length > 10 && (
            <Button className="fr-mr-1w" onClick={() => setShowAll(!showAll)} size="sm" variant="secondary">
              {showAll ? getI18nLabel("show-less") : getI18nLabel("show-more")}
            </Button>
          )}
          <Button
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," + data.map((e) => `${e.country_code},${e.country_name_fr},${e.total_collaborations}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `countries_collaborations_${country_code}.csv`);
              document.body.appendChild(link); // Required for FF
              link.click(); // This will download the data file
              document.body.removeChild(link); // Clean up
            }}
            size="sm"
            variant="secondary"
          >
            {getI18nLabel("download_data")}
          </Button>
        </Col>
        <Col>
          <Row>
            <div className="fr-tile fr-mt-2w">
              <div className="fr-tile__body">
                <div className="fr-tile__content">
                  <h3 className="fr-tile__title">
                    <span className="fr-icon-earth-fill fr-mr-1w" aria-hidden="true" />
                    <br />
                    {getI18nLabel("neighbouring-countries")}
                  </h3>
                  <p className="fr-tile__desc">
                    Les pays frontaliers comptabilisent <strong>{neighbouringCountriesSum.toLocaleString()}</strong> projets, soit{" "}
                    <strong>{Math.floor((neighbouringCountriesSum / total_collaborations) * 100)} %</strong> des collaborations totales.
                    <br />
                    <br />
                    <strong>{Math.floor((neighbouringCountriesSumWithCountry / total_collaborations) * 100)} %</strong> en prenant en compte le pays
                    sélectionné ({getFlagEmoji(country_code)} {data.find((item) => item.country_code === country_code)?.country_name_fr}).
                  </p>
                </div>
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
