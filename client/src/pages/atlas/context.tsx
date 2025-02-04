import { createContext, ReactNode, useEffect, useState } from "react";
const { VITE_APP_SERVER_URL } = import.meta.env;

interface AtlasContextType {
  DEFAULT_CURRENT_YEAR: string;
  DEFAULT_GEO_ID: string;
  START_YEAR: string;
  END_YEAR: string;
}

export const AtlasContext = createContext<AtlasContextType | undefined>(
  undefined
);

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<AtlasContextType>();

  const transformDataToObject = (
    data: Array<{ key: string; value: string }>
  ): AtlasContextType => {
    return data.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.key]: curr.value,
      };
    }, {}) as AtlasContextType;
  };

  useEffect(() => {
    const fetchAtlasData = async () => {
      try {
        const response = await fetch(
          VITE_APP_SERVER_URL + "/admin/get-constants?dashboardId=atlas"
        );

        const data = await response.json();

        const transformedData = transformDataToObject(data);
        setValue(transformedData);
      } catch (error) {
        console.error("Error fetching atlas data:", error);
      }
    };

    fetchAtlasData();
  }, []);

  return (
    <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>
  );
}
