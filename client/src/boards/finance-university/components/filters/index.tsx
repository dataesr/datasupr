import { Button, Modal, ModalContent, ModalTitle } from '@dataesr/dsfr-plus';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import filtersConfig from './filters-config.json';

type ItemProps = {
  uai: string,
  idPaysage: string,
  libelle: string,
}[]

export default function Filters() {
  const [filterId, setFilterId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = useState();
  const [values, setValues] = useState<ItemProps>([]);

  const openModal = (key: string) => {
    setTitle(filtersConfig[key].title);
    setValues(filtersConfig[key].values);
    setFilterId(key);
    setIsOpen(true);
  }

  const selectItem = (item: { id: string }) => {
    setSearchParams({ [filterId]: item.id });
    setIsOpen(false);
  };

  return (
    <>
      {
        [...searchParams].map((param) => {
          const [key, value] = param;
          const filter = filtersConfig[key];
          if (!filter) return null;
          return (
            <Button
              className="fr-mr-1w"
              color='purple-glycine'
              icon={filter.icon}
              key={key}
              onClick={() => openModal(key)}
              size='sm'
            >
              {`${filter.label} : ${filter.values.find((item) => item.uai === value)?.libelle ?? 'inconnu'}`}
            </Button>
          );
        })
      }
      
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)} size="lg">
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>
          <select
            className="fr-select"
            id="select"
            name="select"
            onChange={(e) => selectItem({ id: e.target.value })}
          >
            {
              values.map((value) => (
                <option
                  key={value.uai}
                  value={value.uai}
                >
                  {value.libelle}
                </option>
              ))
            }
          </select>
        </ModalContent>
      </Modal>
    </>
  );
}
