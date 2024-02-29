import { Button, ButtonGroup, Modal, ModalContent, ModalTitle } from '@dataesr/dsfr-plus';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

type ItemProps = {
  id: string,
  label: string,
}[]

import filtersConfig from './filters-config.json';

export default function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = [...searchParams];
  const [modalTitle, setModalTitle] = useState();
  const [modalItems, setModalItems] = useState<ItemProps>([]);
  const [modalFilterId, setModalFilterId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (key) => {
    setModalTitle(filtersConfig[key].modalTitle);
    setModalItems(filtersConfig[key].values.map((item) => ({ id: item.iso3, label: item.name_fr })));
    setModalFilterId(key);
    setIsOpen(true);
  }

  function InitializeButton({ param }) {
    const [key, value] = param;

    return (
      <Button
        className="fr-mr-1w"
        color='purple-glycine'
        icon={filtersConfig[key].icon}
        key={key}
        onClick={() => openModal(key)}
        size='sm'
      >
        {`${filtersConfig[key].label} : ${filtersConfig[key].values.find((item) => item.iso3 === value).name_fr}`}
      </Button>
    )
  }

  const selectItem = (item) => {
    setSearchParams({ [modalFilterId]: item.id });
    setIsOpen(false);

  };

  return (
    <>
      {
        params.map((param) => (<InitializeButton param={param} />))
      }

      <Modal isOpen={isOpen} hide={() => setIsOpen(false)} size="lg">
        <ModalTitle>{modalTitle}</ModalTitle>
        <ModalContent>
          <ButtonGroup>
            {
              modalItems.map((item) => (
                <Button
                  color='purple-glycine'
                  onClick={() => selectItem({ ...item })}
                >
                  {item.label}
                </Button>
              ))
            }
          </ButtonGroup>
        </ModalContent>
      </Modal>
    </>
  );
}