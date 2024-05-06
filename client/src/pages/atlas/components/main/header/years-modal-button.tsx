import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';

import { Alert, Button, Modal, ModalContent, ModalTitle } from '@dataesr/dsfr-plus';
import { getFiltersValues } from '../../../../../api/atlas.ts';

export default function YearsModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const currentYear = searchParams.get('annee_universitaire') || '2022-23';
  const geoId = searchParams.get('geo_id') || '';
  const [showAlertMessage, setShowAlertMessage] = useState(false);

  const { data: filtersValues, isLoading: isLoadingFiltersValues } = useQuery({
    queryKey: ["atlas/get-filters-values", geoId],
    queryFn: () => getFiltersValues(geoId)
  })

  useEffect(() => {
    setShowAlertMessage(!filtersValues?.annees_universitaires?.onlyWithData.includes(currentYear));
  }, [currentYear, filtersValues]);

  if (isLoadingFiltersValues) {
    return <div>Chargement des filtres ...</div>
  }

  function YearsList() {
    return (
      <div className="fr-select-group">
        <label className="fr-label fr-sr-only" htmlFor="select">
          Sélectionnez l'année universitaire souhaitée
        </label>
        <select
          className="fr-select"
          id="select"
          name="select"
          onChange={(e) => {
            searchParams.set('annee_universitaire', e.target.value);
            window.location.search = searchParams.toString();
          }}
        >
          {
            filtersValues.annees_universitaires.all.map((value: string) => (
              <option
                disabled={!filtersValues?.annees_universitaires?.onlyWithData.includes(value)}
                key={value}
                selected={searchParams.get('annee_universitaire') === value ? true : false}
                value={value}
              >
                {`Années universitaire ${value}`}
                {
                  !filtersValues?.annees_universitaires?.onlyWithData.includes(value) && (
                    <span> (- non disponibles -)</span>
                  )
                }
              </option>
            ))
          }
        </select>
      </div>
    )
  }

  return (
    <>
      <Button
        className="button"
        color="pink-tuile"
        icon='calendar-2-line'
        onClick={() => setIsOpen(true)}
        size="sm"
      >
        Année universitaire&nbsp;<strong>{currentYear}</strong>
      </Button>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)} size='lg'>
        <ModalTitle>
          Sélection d'une année universitaire
        </ModalTitle>
        <ModalContent>
          {showAlertMessage && (
            <Alert
              className="fr-mb-3w"
              description="Aucune donnée n'est disponible pour l'année universitaire sélectionnée"
              title="Alerte"
              variant="error"
            />
          )}
          <YearsList />
        </ModalContent>
      </Modal>
    </>
  );
}