import { Button, ButtonGroup, Modal, ModalContent, ModalTitle } from '@dataesr/dsfr-plus';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import filtersConfig from './filters-config.json';

type ItemProps = {
  id: string,
  label: string,
}[]

export default function Filters() {
  const [filterId, setFilterId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = useState();
  const [values, setValues] = useState<ItemProps>([]);

  const openModal = (key:string) => {
    setTitle(filtersConfig[key].modalTitle);
    setValues(filtersConfig[key].values);
    setFilterId(key);
    setIsOpen(true);
  }

  const selectItem = (item:{ id: string }) => {
    setSearchParams({ [filterId]: item.id });
    setIsOpen(false);
  };

  return (
    <>
      {
        [...searchParams].forEach((param) => {
          const [key, value] = param;
          const filter = filtersConfig[key];
          return (
            <Button
              className="fr-mr-1w"
              color='purple-glycine'
              icon={filter.icon}
              key={key}
              onClick={() => openModal(key)}
              size='sm'
            >
              {`${filter.label} : ${filter.values.find((item) => item.id === value).label}`}
            </Button>
          );
        })
      }

      <Modal isOpen={isOpen} hide={() => setIsOpen(false)} size="lg">
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>
          <ButtonGroup>
            {
              values.map((value) => (
                <Button
                  color='purple-glycine'
                  key={value.id}
                  onClick={() => selectItem({ ...value })}
                >
                  {value.label}
                </Button>
              ))
            }
          </ButtonGroup>
        </ModalContent>
      </Modal>
    </>
  );
}
