import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
// const { VITE_APP_SERVER_URL } = import.meta.env;

import {
  Button, Container, Row, Col,
  Spinner,
} from '@dataesr/dsfr-plus';
import { getFiltersValues, getGeoIdsFromSearch } from '../../../../../../api/atlas.js';
import HomeMapCards from '../../../home-map-cards/index.js';
import { GetLevelBadgeFromId } from '../../../../utils/badges.js';

import './styles.scss';


type SearchTypes = {
  geo_id: string,
  geo_nom: string,
}

export function Search() {
  const [territoiresType, setTerritoiresType] = useState('');
  const [territoireId, setTerritoireId] = useState('');

  const [searchValue, setSearchValue] = useState('');

  const navigate = useNavigate();

  const { data: filtersValues, isLoading: isLoadingFiltersValues } = useQuery({
    queryKey: ["atlas/get-filters-values"],
    queryFn: () => getFiltersValues()
  })

  const { data: dataSearch, isLoading: isLoadingSearch, refetch } = useQuery({
    queryKey: ["atlas/search", searchValue],
    queryFn: () => getGeoIdsFromSearch(searchValue),
    enabled: false,

  })

  const handleClick = async () => {
    refetch();
  };

  if (isLoadingFiltersValues) {
    return <div>Loading...</div>
  }

  // Create a list of all territories (regions, departments, academies - without urban unities and cities)
  const territoiresList = Object.keys(filtersValues.geo_id).map((key) => {
    if (key !== 'communes') {
      return filtersValues.geo_id[key].map((item) => ({
        id: item.geo_id,
        label: item.geo_nom,
        type: key,
      }))
    }
  }).flat();

  // Sort the list of territories by label
  territoiresList.sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Container as="section">
      <Row gutters>
        <Col md={9}>
          <Container fluid>
            <Row gutters>
              <Col md={5}>
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="select">
                    Type de territoire
                  </label>
                  <select className="fr-select" id="select" name="select" onChange={(e) => setTerritoiresType(e.target.value)}>
                    <option value="" selected disabled hidden>Sélectionner un type de territoire</option>
                    <option value="regions" selected={territoiresType === 'regions'} >Régions</option>
                    <option value="departements" selected={territoiresType === 'departements'}>Départements</option>
                    <option value="academies" selected={territoiresType === 'academies'} >Académies</option>
                    <option value="unites_urbaines" selected={territoiresType === 'unites_urbaines'} >Unités urbaines</option>
                  </select>
                </div>
              </Col>
              <Col md={4}>
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="select">
                    Choix du territoire
                  </label>
                  <select className="fr-select" id="select" name="select" disabled={territoiresType === ''} onChange={(e) => setTerritoireId(e.target.value)}>
                    <option value="" selected disabled hidden>Sélectionner un territoire</option>
                    {
                      territoiresList && territoiresList.filter((item) => item?.type === territoiresType).map((item) => (
                        <option value={item?.id} selected={territoireId === item?.id} >{item?.label}</option>
                      ))
                    }
                  </select>
                </div>
              </Col>
              <Col md={3}>
                <Button
                  className="fr-mt-4w"
                  color="pink-tuile"
                  onClick={() => navigate(`/atlas/general?geo_id=${territoireId}&annee_universitaire=2022-23`)}
                >
                  Valider
                </Button>
              </Col>
            </Row>
            <hr className="fr-mt-3w" />
            <Row gutters>
              <Col md={9} className="search">
                <label className="fr-label" htmlFor="text-input-text">
                  Rechercher dans tous les territoires disponibles
                </label>
                <input
                  className="fr-input"
                  id="text-input-text"
                  name="text-input-text"
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyUp={(e) => { if (e.key === 'Enter') handleClick() }}
                  type="text"
                  value={searchValue}
                />
                {
                  isLoadingSearch && <div className='fr-pt-2w'><Spinner /></div>
                }
                {
                  (!isLoadingSearch && dataSearch?.length === undefined) && (
                    <div className='results'>
                      <i className='hint'>
                        Saisissez un mot clé pour rechercher un territoire
                        Par exemple : "Paris", "Bretagne", "Occitanie", etc ...
                        <br />
                        Puis cliquez sur le bouton "Rechercher"
                      </i>
                    </div>
                  )
                }
                {
                  (dataSearch?.length > 0) ? (
                    <ul className='results'>
                      {dataSearch.map((result: SearchTypes) => (
                        <li
                          key={result.geo_id}
                          onClick={() => { navigate(`/atlas/general?geo_id=${result.geo_id}&annee_universitaire=2022-23`) }}
                        >
                          <span onClick={() => { navigate(result.geo_id) }}>
                            <strong><u>{result.geo_nom}</u></strong>
                            <div>
                              code : {result.geo_id}
                              {GetLevelBadgeFromId({ id: result.geo_id })}
                            </div>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null
                }
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
          </Container>
        </Col>
        <Col md={3}>
          <HomeMapCards territoiresList={territoiresList} />
        </Col>
      </Row>
    </Container>
  );
}