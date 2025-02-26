import { Button, Modal, ModalContent, ModalTitle } from "@dataesr/dsfr-plus";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import filtersConfig from "./filters-config.json";

type ItemProps = {
  id: string;
  label: string;
}[];

export default function Filters() {
  const [filterId, setFilterId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = useState();
  const [values, setValues] = useState<ItemProps>([]);

  useEffect(() => {
    const obj = {
      country_code: filtersConfig["country_code"].defaultId,
      extra_joint_organization:
        filtersConfig["extra_joint_organization"].defaultId,
    };
    if (searchParams.get("country_code")) {
      obj.country_code = searchParams.get("country_code") as string;
    }
    if (searchParams.get("extra_joint_organization")) {
      obj.extra_joint_organization = searchParams.get(
        "extra_joint_organization"
      ) as string;
    }
    setSearchParams(obj);
  }, [searchParams, setSearchParams]);

  const openModal = (key: string) => {
    setTitle(filtersConfig[key].title);
    setValues(filtersConfig[key].values);
    setFilterId(key);
    setIsOpen(true);
  };

  const selectItem = (item: { id: string }) => {
    const obj = Object.fromEntries([...searchParams]);
    obj[filterId] = item.id;

    setSearchParams(obj);
    setIsOpen(false);
  };

  return (
    <>
      {[...searchParams].map((param) => {
        const [key, value] = param;
        const filter = filtersConfig[key];
        if (!filter) return null;
        return (
          <Button
            className="fr-mr-1w"
            color="purple-glycine"
            icon={filter.icon}
            key={key}
            onClick={() => openModal(key)}
            size="sm"
          >
            {`${filter.label} : ${
              filter.values.find((item) => item.id === value)?.label ??
              "inconnu"
            }`}
          </Button>
        );
      })}

      <Modal isOpen={isOpen} hide={() => setIsOpen(false)} size="lg">
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>
          <select
            className="fr-select"
            id="select"
            name="select"
            onChange={(e) => selectItem({ id: e.target.value })}
          >
            {values.map((value) => (
              <option key={value.id} value={value.id}>
                {value.label}
              </option>
            ))}
          </select>
        </ModalContent>
      </Modal>
    </>
  );
}
