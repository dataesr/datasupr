import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";

import { Button, Container, Row, Col } from '@dataesr/dsfr-plus';
import { getFiltersValues } from '../../../../api/atlas.ts';
import HomeMapCards from '../home-map-cards/index.tsx';

export function Search() {
  const [territoiresType, setTerritoiresType] = useState('');
  const [territoireId, setTerritoireId] = useState('');

  const navigate = useNavigate();

  const { data: filtersValues, isLoading: isLoadingFiltersValues } = useQuery({
    queryKey: ["atlas/get-filters-values"],
    queryFn: () => getFiltersValues()
  })

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
        <Col md={5}>
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
        <Col md={2}>
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

      <Row>
        <Col md={10}>
          <label className="fr-label" htmlFor="text-input-text">
            Rechercher dans tous les territoires disponibles
          </label>
          <input className="fr-input" type="text" id="text-input-text" name="text-input-text" />
        </Col>
        <Col md={2}>
          <Button
            className="fr-mt-4w"
            color="pink-tuile">
            Rechercher
          </Button>
        </Col>
      </Row>

      <hr className="fr-mt-3w" />

      <HomeMapCards
        // data={filtersValues}
        // isLoading={isLoadingFiltersValues}
        territoiresList={territoiresList}
      />
    </Container>
  );
}