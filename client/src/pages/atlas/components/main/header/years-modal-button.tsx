import { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';

import { Button, Modal, ModalContent, ModalTitle } from '@dataesr/dsfr-plus';
import { getFiltersValues } from '../../../../../api/atlas.ts';

export default function YearsModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const currentYear = searchParams.get('annee_universitaire') || '2022-23';

  const { data: filtersValues, isLoading: isLoadingFiltersValues } = useQuery({
    queryKey: ["atlas/get-filters-values"],
    queryFn: () => getFiltersValues()
  })

  if (isLoadingFiltersValues) {
    return <div>Loading...</div>
  }

  function YearsList() {
    return (
      <div className="fr-select-group">
        <label className="fr-label" htmlFor="select">
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
            filtersValues['annee_universitaire'].map((value: string) => (
              <option
                key={value}
                selected={searchParams.get('annee_universitaire') === value ? true : false}
                value={value}
              >
                {`Années universitaire ${value}`}
              </option>
            ))
          }
        </select>
      </div>
    )
  }

  return (
    <>
      <Button size="sm" color="pink-tuile" onClick={() => setIsOpen(true)}>
        Année universitaire&nbsp;<strong>{currentYear}</strong>
      </Button>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>
          Sélection d'une année universitaire
        </ModalTitle>
        <ModalContent>
          <YearsList />
        </ModalContent>
      </Modal>
    </>
  );
}