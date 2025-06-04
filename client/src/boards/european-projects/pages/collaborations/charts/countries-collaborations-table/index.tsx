import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Badge, Button, Col, Container, Row, Title, Modal, ModalContent, Tag, TagGroup } from "@dataesr/dsfr-plus";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { getCollaborations, getCollaborationsByCountry } from "./query";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

import i18nGlobal from "../../../../i18n-global.json";
import i18nLocal from "./i18n.json";
import { getFlagEmoji } from "../../../../utils";
import { getNeighbouringCountriesFromIso3 } from "../../../../../../utils";
import { formatToMillions } from "../../../../../../utils/format";

type CollaborationDetail = {
  project_id: string;
  call_year: string;
  country_code: string;
  country_code_collab: string;
  participates_as: string;
  participates_as_collab: string;
  total_cost: number;
  proposal_budget: number;
  participation_nuts: string;
  participation_nuts_collab: string;
  flag_coordination: string;
};

export default function CountriesCollaborationsTable() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortColumn, setSortColumn] = useState("collaborations");
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedParticipationType, setSelectedParticipationType] = useState("all");
  const [displayLimit, setDisplayLimit] = useState(20);

  type CollaborationCountry = {
    country_code: string;
    country_name_fr: string;
    country_name_en: string;
    total_collaborations: number;
  };

  const [collabCountry, setCollabCountry] = useState<CollaborationCountry | null>(null);
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
    queryFn: () => getCollaborations(country_code),
  });

  const { data: collaborationDetails, isLoading: isLoadingDetails } = useQuery<CollaborationDetail[]>({
    queryKey: ["getCollaborationsByCountry", country_code, collabCountry?.country_code],
    queryFn: () => getCollaborationsByCountry(country_code, collabCountry?.country_code),
    enabled: !!collabCountry,
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

  // Fonctions utilitaires pour le traitement des données
  type CollaborationStats = {
    total: number;
    totalBudget: number;
    asCoordinator: number;
  };

  type ProcessedCollaborationDetails = {
    years: string[];
    byYear: Record<string, CollaborationDetail[]>;
    stats: CollaborationStats;
  };

  const processCollaborationDetails = (data: CollaborationDetail[] | undefined): ProcessedCollaborationDetails => {
    if (!data) return { years: [], byYear: {}, stats: { total: 0, totalBudget: 0, asCoordinator: 0 } };

    const byYear = data.reduce((acc, item) => {
      if (!acc[item.call_year]) acc[item.call_year] = [];
      acc[item.call_year].push(item);
      return acc;
    }, {} as Record<string, CollaborationDetail[]>);

    const years = Object.keys(byYear).sort((a, b) => parseInt(b) - parseInt(a));
    const minYear = Math.min(...years.map(Number));
    const maxYear = Math.max(...years.map(Number));
    const yearRanges = [`${minYear}-${maxYear}`, ...years];

    const stats = {
      total: data.length,
      totalBudget: data.reduce((sum, item) => sum + (item.total_cost || 0), 0),
      asCoordinator: data.filter((item) => item.flag_coordination === "True").length,
    };

    return { years: yearRanges, byYear, stats };
  };

  const filterData = (data: CollaborationDetail[] | undefined, withLimit = true) => {
    if (!data) return [];
    let filtered = [...data];

    if (selectedYear !== "all") {
      const yearStart = parseInt(selectedYear.split("-")[0]);
      const yearEnd = parseInt(selectedYear.split("-")[1]) || yearStart;
      filtered = filtered.filter((item) => {
        const itemYear = parseInt(item.call_year);
        return itemYear >= yearStart && itemYear <= yearEnd;
      });
    }

    if (selectedParticipationType !== "all") {
      filtered = filtered.filter((item) => item.participates_as === selectedParticipationType);
    }

    return withLimit ? filtered.slice(0, displayLimit) : filtered;
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
          <div className="fr-table fr-table--sm">
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
                      {displayedData.map((collab) => (
                        <tr key={collab.country_code}>
                          <td className="fr-py-0">
                            <button className="fr-btn fr-btn--tertiary-no-outline fr-p-0" onClick={() => handleCountryClick(collab.country_code)}>
                              {getFlagEmoji(collab.country_code)}
                              <span className="fr-ml-1w">{collab[`country_name_${currentLang}`]}</span>
                              {
                                // ajoute un badge si le pays est un pays frontalier
                                dataCountries && dataCountries.includes(collab.country_code) && (
                                  <span
                                    className="fr-mx-1w"
                                    style={{ display: "inline-block", width: "5px", height: "5px", backgroundColor: "#000091", borderRadius: "50%" }}
                                  />
                                )
                              }
                            </button>
                          </td>
                          <td className="fr-py-0" style={{ textAlign: "center" }}>
                            {collab.total_collaborations}
                            <Button
                              icon="eye-line"
                              className="fr-ml-1w"
                              size="sm"
                              variant="text"
                              onClick={() => {
                                setCollabCountry(collab);
                                setIsModalOpen(true);
                              }}
                            />
                          </td>
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
                    <br />
                    <Badge>
                      {dataCountries ? dataCountries.length : 0} {getI18nLabel("countries")}
                      {" / "}
                      {data.length}
                    </Badge>
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
      <Modal isOpen={isModalOpen} hide={() => setIsModalOpen(false)} size="xl">
        <ModalContent>
          {isLoadingDetails ? (
            <p>Chargement des détails...</p>
          ) : (
            <>
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12">
                  <h4>{collabCountry && `${getFlagEmoji(collabCountry.country_code)} ${collabCountry[`country_name_${currentLang}`]}`}</h4>
                </div>
              </div>

              {collaborationDetails && (
                <>
                  {/* Statistiques globales */}
                  <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
                    <div className="fr-col-12">
                      <TagGroup>
                        <Tag color="green-bourgeon">{processCollaborationDetails(collaborationDetails).stats.total} projets</Tag>
                        <Tag color="green-emeraude">
                          <span className="fr-icon-money-euro-circle-line fr-mr-1w" aria-hidden="true" />
                          {formatToMillions(processCollaborationDetails(collaborationDetails).stats.totalBudget)}
                        </Tag>
                        <Tag color="yellow-tournesol">
                          {processCollaborationDetails(collaborationDetails).stats.asCoordinator} en tant que coordinateur
                        </Tag>
                      </TagGroup>
                    </div>
                  </div>

                  {/* Filtres */}
                  <Row gutters className="fr-mt-2w">
                    <Col>
                      <label className="fr-label">Années</label>
                      <select className="fr-select" onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
                        {processCollaborationDetails(collaborationDetails).years.map((year) => (
                          <option key={year} value={year}>
                            {year.includes("-") ? `${year} (Toutes)` : year}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col>
                      <label className="fr-label">Type de participation du pays</label>
                      <select className="fr-select" onChange={(e) => setSelectedParticipationType(e.target.value)} value={selectedParticipationType}>
                        <option value="all">Tous</option>
                        <option value="beneficiary">Bénéficiaire</option>
                        <option value="thirdparty">Partenaire tiers</option>
                        <option value="associated partner">Associé</option>
                      </select>
                    </Col>
                  </Row>

                  {/* Récapitulatif en tags */}
                  <div className="fr-mt-4w">
                    <TagGroup>
                      <Tag>
                        <span className="fr-icon-calendar-line fr-mr-1w" aria-hidden="true" />
                        {selectedYear === "all" ? "Toutes les années" : selectedYear.includes("-") ? `${selectedYear} (Toutes)` : selectedYear}
                      </Tag>
                      <Tag>
                        <span className="fr-icon-folder-2-line fr-mr-1w" aria-hidden="true" />
                        {filterData(collaborationDetails, false).length} projets
                      </Tag>
                      <Tag>
                        <span className="fr-icon-money-euro-circle-line fr-mr-1w" aria-hidden="true" />
                        Budget total :{" "}
                        {formatToMillions(filterData(collaborationDetails, false).reduce((sum, item) => sum + (item.total_cost || 0), 0))}
                      </Tag>
                      <Tag>
                        <span className="fr-icon-money-euro-box-line fr-mr-1w" aria-hidden="true" />
                        Budget proposé :{" "}
                        {formatToMillions(filterData(collaborationDetails, false).reduce((sum, item) => sum + (item.proposal_budget || 0), 0))}
                      </Tag>
                    </TagGroup>
                  </div>

                  {/* Liste des projets */}
                  <div className="fr-table fr-table--sm">
                    <div className="fr-table__wrapper">
                      <div className="fr-table__container">
                        <div className="fr-table__content">
                          <table>
                            <thead>
                              <tr>
                                <th>Année</th>
                                <th>ID Projet</th>
                                <th>Rôle pays</th>
                                <th>Rôle collab.</th>
                                <th>Budget total</th>
                                <th>Budget proposé</th>
                                <th>participation_nuts</th>
                                <th>participation_nuts_collab</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filterData(collaborationDetails).map((item, index) => (
                                <tr key={`${item.project_id}-${index}`}>
                                  <td className="fr-py-0">{item.call_year}</td>
                                  <td className="fr-py-0">{item.project_id}</td> {/* TODO: lien vers commission ? */}
                                  <td className="fr-py-0">{item.participates_as}</td>
                                  <td className="fr-py-0">{item.participates_as_collab}</td>
                                  <td className="fr-py-0">{formatToMillions(item.total_cost, 2)}</td>
                                  <td className="fr-py-0">{item.proposal_budget ? `${formatToMillions(item.proposal_budget, 2)}` : "-"}</td>
                                  <td className="fr-py-0">{item.participation_nuts || "-"}</td>
                                  <td className="fr-py-0">{item.participation_nuts_collab || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {collaborationDetails.length > displayLimit && (
                    <div className="fr-mt-2w">
                      <Button onClick={() => setDisplayLimit((prev) => prev + 50)} size="sm" variant="secondary">
                        Voir plus de résultats
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
}
