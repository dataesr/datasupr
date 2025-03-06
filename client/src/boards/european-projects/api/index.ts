const { VITE_APP_SERVER_URL } = import.meta.env;

type FilterValue = {
  id: string;
  label_fr: string;
  label_en: string;
};

export async function getFiltersValues(
  filterKey: string,
  programId?: string
) {

  let values = [];
  if (filterKey === "countries") {
    const url = `${VITE_APP_SERVER_URL}/european-projects/filters-countries`;
    values = await fetch(url).then((response) => response.json());
    return {
      defaultId: "FRA",
      icon: "earth-fill",
      label_fr: "Pays",
      label_en: "Countries",
      title_fr: "Sélectionner un pays",
      title_en: "Select a country",
      values,
    };
  }

  if (filterKey === "extra_joint_organization") {
    return {
      defaultId: null,
      icon: "community-fill",
      label_fr: "Entités",
      label_en: "Entities",
      title_fr: "Sélectionner une entité",
      title_en: "Select an entity",
      values: [
      {
        "id": "null",
        "label_fr": "Toutes les entités",
        "label_en": "All entities"
      },
      {
        "id": "exept",
        "label_fr": "Hors OIE, OIG, entités communes",
        "label_en": "Except IOE, IGO, common entities"
      }
    ],
    };
  }

  if (filterKey === "programs") {
    const url = `${VITE_APP_SERVER_URL}/european-projects/filters-programs`;
    values = await fetch(url).then((response) => response.json());
    return {
      defaultId: "all",
      icon: "community-fill",
      label_fr: "Programmes",
      label_en: "Programs",
      title_fr: "Sélectionner un programme",
      title_en: "Select a program",
      values: [
      {
        id: "all",
        label_fr: "Tous les programmes",
        label_en: "All programs"
      },
      ...values
      ],
    };
  }

    if (filterKey === "thematics") {
    const url = `${VITE_APP_SERVER_URL}/european-projects/filters-thematics${programId ? `?programId=${programId}` : ""}`;
    const valuesRes = await fetch(url).then((response) => response.json());

    let values: FilterValue[];
    if (valuesRes.length > 1) {
      values = [
      {
        id: "all",
        label_fr: "Toutes les thématiques",
        label_en: "All thematics"
      },
      ...valuesRes
      ]
    } else {
      values = valuesRes;
    }
      
    return {
      defaultId: "all",
      icon: "community-fill",
      label_fr: "Thématiques",
      label_en: "Thematics",
      title_fr: "Sélectionner une thématique",
      title_en: "Select a thematic",
      values,
    };
  }

  return [];
}