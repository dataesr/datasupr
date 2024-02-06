import { useState, useEffect } from 'react';
import { Accordion, AccordionGroup, Button, Col, Container, Modal, ModalContent, ModalTitle, Row, Tag, TagGroup, Text, Title } from '@dataesr/dsfr-plus';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFiltersValues } from '../../api';
import { getGeoLabel } from '../../utils';

import {
  DEFAULT_CURRENT_YEAR,
  DEFAULT_GEO_ID,
  LABELS,
  MAX_NUMBER_OF_VALUES_TO_DISPLAY
} from '../../constants';
const atlasKeysFilters = ['annee_universitaire', 'geo_id'];

type ItemGeo = {
  geo_id: string,
  geo_nom: string,
}

export default function FiltersFromUrl() {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilterForModal, setActiveFilterForModal] = useState('annee_universitaire');

  const { data: filtersValues, isLoading } = useQuery({
    queryKey: ["atlas/get-filters-values"],
    queryFn: () => getFiltersValues()
  })

  useEffect(() => {
    if (searchParams.get('annee_universitaire') === null) {
      searchParams.set('annee_universitaire', DEFAULT_CURRENT_YEAR);
    }
    if (searchParams.get('geo_id') === null) {
      searchParams.set('geo_id', DEFAULT_GEO_ID);
    }
  }, [searchParams]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  const launchModal = (key: string) => {
    setActiveFilterForModal(key);
    setIsOpen(true);
  }

  function YearsList({ list = false }: { list?: boolean }) {
    if (list) {
      return (
        <>
          <Text size="sm">L'année actuellement sélectionnée est <strong>{searchParams.get(activeFilterForModal)}</strong></Text>
          <ul>
            {
              filtersValues[activeFilterForModal].map((value: string) => (
                <li key={value} style={{ listStyle: 'none' }}>
                  <Button
                    variant={searchParams.get(activeFilterForModal) === value ? 'primary' : 'secondary'}
                    onClick={() => {
                      searchParams.set(activeFilterForModal, value);
                      window.location.search = searchParams.toString();
                    }}
                    style={{ width: '100%', }}
                  >
                    {`Années ${value}`}
                  </Button>
                </li>
              ))
            }
          </ul>
        </>
      )
    }
    return (
      <>
        <div className="fr-select-group">
          <label className="fr-label" htmlFor="select">
            Sélectionnez l'année universitaire souhaitée
          </label>
          <select
            className="fr-select"
            id="select"
            name="select"
            onChange={(e) => {
              searchParams.set(activeFilterForModal, e.target.value);
              window.location.search = searchParams.toString();
            }}
          >
            {
              filtersValues[activeFilterForModal].map((value: string) => (
                <option
                  key={value}
                  selected={searchParams.get(activeFilterForModal) === value ? true : false}
                  value={value}
                >
                  {`Années universitaire ${value}`}
                </option>
              ))
            }
          </select>
        </div>
      </>
    )
  }

  function GeoIdList() {
    return (
      <>
        <Text size="sm">
          Le territoire actuellement sélectionné est <strong>{mapValueLabel(activeFilterForModal, searchParams.get(activeFilterForModal) || '')}</strong>
        </Text>
        <AccordionGroup>
          {
            Object.keys(filtersValues[activeFilterForModal]).map(title => (
              <Accordion title={title}>
                {
                  filtersValues[activeFilterForModal][title].length > MAX_NUMBER_OF_VALUES_TO_DISPLAY ?
                    (
                      // Afficher les premiers resultats et un champ de recherche
                      <section>
                        <Title as="h3" look='h6'>Rechercher un territoire</Title>
                        <input type="text" />
                        <Title as="h3" look='h6'>{`Les 5 premiers résultats de type "${title}"`}</Title>
                        <ul>
                          {
                            filtersValues[activeFilterForModal][title].slice(0, 5).map((item: ItemGeo) => (
                              <li key={`${title}${item.geo_id}`} style={{ listStyle: 'none' }}>
                                <Button
                                  variant={searchParams.get(activeFilterForModal) === item.geo_id ? 'primary' : 'secondary'}
                                  onClick={() => {
                                    searchParams.set(activeFilterForModal, item.geo_id);
                                    window.location.search = searchParams.toString();
                                  }}
                                  style={{ width: '100%', }}
                                >
                                  {item.geo_nom}
                                </Button>
                              </li>
                            ))
                          }
                        </ul>
                      </section>
                    ) : (
                      <ul>
                        {
                          filtersValues[activeFilterForModal][title].map((item: ItemGeo) => (
                            <li key={`${title}${item.geo_id}`} style={{ listStyle: 'none' }}>
                              <Button
                                variant={searchParams.get(activeFilterForModal) === item.geo_id ? 'primary' : 'secondary'}
                                onClick={() => {
                                  searchParams.set(activeFilterForModal, item.geo_id);
                                  window.location.search = searchParams.toString();
                                }}
                                style={{ width: '100%', }}
                              >
                                {item.geo_nom}
                              </Button>
                            </li>
                          ))
                        }
                      </ul >
                    )
                }
              </Accordion>
            ))
          }
        </AccordionGroup>
      </>
    )
  }

  const mapValueLabel = (key: string, value: string) => {
    if (key === 'geo_id') {
      return getGeoLabel(value, filtersValues.geo_id);
    }
    return value;
  }

  return (
    <section>
      <div className="fr-callout fr-icon-information-line fr-py-0">
        <Container>
          <Row>
            <Col md={3}>
              <Title as="h2" look='h4'>Filtres disponibles</Title>
            </Col>
            <Col>
              <TagGroup>
                {
                  atlasKeysFilters.map(key => (
                    <Tag
                      key={key}
                      color='green-archipel'
                      onClick={(e) => { launchModal(key); e.preventDefault(); }}
                      style={{ cursor: 'pointer' }}
                    >
                      <Text size='xs' className="fr-mr-1w">
                        {LABELS[key as keyof typeof LABELS]}
                      </Text>
                      {mapValueLabel(key, searchParams.get(key) || '')}
                    </Tag>
                  ))
                }
              </TagGroup>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>
          {
            activeFilterForModal === "annee_universitaire" && "Sélection d'une année universitaire"
          }
          {
            activeFilterForModal === "geo_id" && "Sélection d'un territoire"
          }
        </ModalTitle>
        <ModalContent>
          {
            activeFilterForModal === "annee_universitaire" && <YearsList list={false} />
          }
          {
            activeFilterForModal === "geo_id" && <GeoIdList />
          }
        </ModalContent>
        {/* <ModalFooter>
          <ButtonGroup isInlineFrom="xs" align="right">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button>Valider les filtres</Button>
          </ButtonGroup>
        </ModalFooter> */}
      </Modal>
    </section >
  )
}
