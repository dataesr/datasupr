import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Text,
  Title,
} from "@dataesr/dsfr-plus";

import {
  getFiltersValues,
  getGeoIdsFromSearch,
} from "../../../../../../api/atlas.js";
import HomeMapCards from "../../../home-map-cards/index.js";
import { GetLevelBadgeFromItem } from "../../../../utils/badges.js";

import "./styles.scss";
import { DEFAULT_CURRENT_YEAR } from "../../../../../../constants.js";

type SearchTypes = {
  geo_id: string;
  geo_nom: string;
};

export function Search() {
  const [territoiresType, setTerritoiresType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const { data: filtersValues, isLoading: isLoadingFiltersValues } = useQuery({
    queryKey: ["atlas/get-filters-values"],
    queryFn: () => getFiltersValues(),
  });

  const {
    data: dataSearch,
    isLoading: isLoadingSearch,
    refetch,
  } = useQuery({
    queryKey: ["atlas/search", searchValue, territoiresType],
    queryFn: () => getGeoIdsFromSearch(searchValue, territoiresType),
    enabled: false,
  });

  const handleClick = async () => {
    refetch();
  };

  if (isLoadingFiltersValues) {
    return <Spinner />;
  }

  // Create a list of all territories (regions, departments, academies - without urban unities and cities)
  const territoiresList = Object.keys(filtersValues.geo_id)
    .map((key) => {
      if (key !== "communes") {
        return filtersValues.geo_id[key].map((item) => ({
          id: item.geo_id,
          label: item.geo_nom,
          type: key,
        }));
      }
    })
    .flat();

  // Sort the list of territories by label
  territoiresList.sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Container as="section">
      <Row>
        <Col md={8}>
          <Container fluid>
            <Row>
              <Col>
                <Title as="h1" look="h1">
                  Atlas des effectifs étudiants
                </Title>
                <Text>
                  <i>
                    L’Atlas des effectifs étudiants est un outil indispensable
                    pour une bonne appréhension de la structuration territoriale
                    de l’enseignement supérieur et pour l’élaboration de
                    stratégies territoriales. Il présente, sous forme de cartes,
                    de graphiques et de tableaux, la diversité du système
                    français d’enseignement supérieur.
                  </i>
                </Text>
              </Col>
            </Row>
            <Row className="fr-mt-5w">
              <Col md={9} className="search">
                <label className="fr-label" htmlFor="text-input-text">
                  Rechercher un territoires
                </label>
                <input
                  className="fr-input"
                  id="text-input-text"
                  name="text-input-text"
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") handleClick();
                  }}
                  type="text"
                  value={searchValue}
                />
              </Col>
              <Col md={3}>
                <Button
                  className="fr-mt-4w"
                  color="pink-tuile"
                  icon="search-line"
                  onClick={handleClick}
                >
                  Rechercher
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="territories-filter">
                  <ul>
                    <li className={territoiresType === "" ? "active" : ""}>
                      <span onClick={() => setTerritoiresType("")}>Tous</span>
                    </li>
                    <li
                      className={territoiresType === "REGION" ? "active" : ""}
                    >
                      <span onClick={() => setTerritoiresType("REGION")}>
                        Régions
                      </span>
                    </li>
                    <li
                      className={territoiresType === "ACADEMIE" ? "active" : ""}
                    >
                      <span onClick={() => setTerritoiresType("ACADEMIE")}>
                        Académies
                      </span>
                    </li>
                    <li
                      className={
                        territoiresType === "DEPARTEMENT" ? "active" : ""
                      }
                    >
                      <span onClick={() => setTerritoiresType("DEPARTEMENT")}>
                        Départements
                      </span>
                    </li>
                    <li
                      className={
                        territoiresType === "UNITE_URBAINE" ? "active" : ""
                      }
                    >
                      <span onClick={() => setTerritoiresType("UNITE_URBAINE")}>
                        Unités urbaines
                      </span>
                    </li>
                    <li
                      className={territoiresType === "COMMUNE" ? "active" : ""}
                    >
                      <span onClick={() => setTerritoiresType("COMMUNE")}>
                        Communes
                      </span>
                    </li>
                  </ul>
                </div>

                {isLoadingSearch && (
                  <div className="fr-pt-2w">
                    <Spinner />
                  </div>
                )}

                {!isLoadingSearch && dataSearch?.length === undefined && (
                  <div className="results">
                    <i className="hint">
                      Saisissez un mot clé pour rechercher un territoire Par
                      exemple : "Paris", "Bretagne", "Occitanie", etc ...
                      <br />
                      Puis cliquez sur le bouton <strong>"Rechercher"</strong>
                      <br />
                      Vous pouvez limiter les résultats à un type de territoire
                      en cliquant sur les boutons correspondants
                    </i>
                  </div>
                )}

                {dataSearch?.length > 0 ? (
                  <ul className="results">
                    {dataSearch.map((result: SearchTypes) => (
                      <li
                        key={result.geo_id}
                        onClick={() => {
                          navigate(
                            `/atlas/general?geo_id=${result.geo_id}&annee_universitaire=${DEFAULT_CURRENT_YEAR}`
                          );
                        }}
                      >
                        <span
                          onClick={() => {
                            navigate(result.geo_id);
                          }}
                        >
                          <strong>
                            <u>{result.geo_nom}</u>
                          </strong>
                          <div>
                            code : {result.geo_id}
                            {GetLevelBadgeFromItem(result)}
                          </div>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Col>
            </Row>
          </Container>
        </Col>
        <Col md={3} offsetMd={1}>
          <HomeMapCards territoiresList={territoiresList} />
        </Col>
      </Row>
    </Container>
  );
}
