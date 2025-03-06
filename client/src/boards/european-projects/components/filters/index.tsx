import { Button, Modal, ModalContent, ModalTitle } from "@dataesr/dsfr-plus";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getFiltersValues } from "../../api";

type ItemProps = {
  id: string;
  label_fr: string;
  label_en: string;
}[];

export default function Filters() {
  const [filterId, setFilterId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [title, setTitle] = useState();
  const [values, setValues] = useState<ItemProps>([]);

  const { data: filterCountries } = useQuery({
    queryKey: ["european-projects/get-filters-values", "countries"],
    queryFn: () => getFiltersValues("countries"),
  });

  const { data: filterExtraJointOrganization } = useQuery({
    queryKey: [
      "european-projects/get-filters-values",
      "extra_joint_organization",
    ],
    queryFn: () => getFiltersValues("extra_joint_organization"),
  });

  const { data: filterPrograms } = useQuery({
    queryKey: ["european-projects/get-filters-values", "programs"],
    queryFn: () => getFiltersValues("programs"),
  });

  const { data: filterThematics } = useQuery({
    queryKey: [
      "european-projects/get-filters-values",
      "thematics",
      searchParams.get("programs"),
    ],
    queryFn: () =>
      getFiltersValues("thematics", searchParams.get("programs") || undefined),
  });

  useEffect(() => {
    if (filterCountries) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        country_code: filterCountries,
      }));
    }
  }, [filterCountries]);

  useEffect(() => {
    if (filterExtraJointOrganization) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        extra_joint_organization: filterExtraJointOrganization,
      }));
    }
  }, [filterExtraJointOrganization]);

  useEffect(() => {
    if (filterPrograms) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        programs: filterPrograms,
      }));
    }
  }, [filterPrograms]);

  useEffect(() => {
    if (filterThematics) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        thematics: filterThematics,
      }));
      setSearchParams((prev) => {
        if (searchParams.get("programs") === "all") {
          prev.set("thematics", "all");
        } else {
          if (filterThematics.values.length === 1) {
            prev.set("thematics", filterThematics.values[0].id);
          } else {
            prev.set("thematics", "all");
          }
        }
        return prev;
      });
    }
  }, [filterThematics]);

  // paramètre par défault
  if (!searchParams.get("country_code")) {
    setSearchParams((prev) => {
      prev.set("country_code", "FRA");
      return prev;
    });
  }
  if (!searchParams.get("extra_joint_organization")) {
    setSearchParams((prev) => {
      prev.set("extra_joint_organization", "all");
      return prev;
    });
  }
  if (!searchParams.get("programs")) {
    setSearchParams((prev) => {
      prev.set("programs", "all");
      return prev;
    });
  }
  if (!searchParams.get("thematics")) {
    setSearchParams((prev) => {
      prev.set("thematics", "all");
      return prev;
    });
  }

  const openModal = (key: string) => {
    setTitle(filters[key].title_fr);
    if (filters[key].values && filters[key].values.length > 0) {
      setValues(filters[key].values);
    }
    setFilterId(key);
    setIsOpen(true);
  };

  return (
    <>
      {[...searchParams].map((param) => {
        const [key, value] = param;
        const filter = filters[key];
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
            {`${filter.label_fr} : ${
              filter.values.find((item) => item.id === value)?.label_fr ??
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
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set(filterId, e.target.value);
                // if (filterId === "programs") {
                //   if (e.target.value === "all") {
                //     prev.set("thematics", "all");
                //   } else {
                //     if (filters["thematics"]?.values.length === 1) {
                //       prev.set("thematics", filters["thematics"].values[0].id);
                //     } else {
                //       prev.set("thematics", "all");
                //     }
                //   }
                // }
                return prev;
              });
              setIsOpen(false);
            }}
          >
            {values.map((value) => (
              <option key={value.id} value={value.id}>
                {value.label_fr}
              </option>
            ))}
          </select>
        </ModalContent>
      </Modal>
    </>
  );
}
