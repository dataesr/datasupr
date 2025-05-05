import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

type GenderComparisonOptions = {
  selectedYear?: string;
  disciplineCode?: string;
  mode?: "latest" | "years" | "disciplines";
};

const useFacultyMembersGenderComparison = ({
  selectedYear,
  disciplineCode,
  mode,
}: GenderComparisonOptions = {}) => {
  return useQuery({
    queryKey: ["faculty-gender-comparison", selectedYear, disciplineCode, mode],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (selectedYear) {
        params.append("annee", selectedYear);
      }

      if (disciplineCode) {
        params.append("discipline_code", disciplineCode);
      }

      if (mode) {
        params.append("mode", mode);
      }

      const url = `${VITE_APP_SERVER_URL}/faculty-members-gender-comparison${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erreur ${response.status} lors de la récupération des données de comparaison par genre: ${errorData}`
        );
      }

      const data = await response.json();
      return data;
    },
    enabled: true,
  });
};

export const useGenderComparisonYears = () => {
  return useFacultyMembersGenderComparison({ mode: "years" });
};

export const useGenderComparisonDisciplines = (selectedYear?: string) => {
  return useFacultyMembersGenderComparison({
    mode: "disciplines",
    selectedYear,
  });
};

export const useLatestGenderComparison = (disciplineCode?: string) => {
  return useFacultyMembersGenderComparison({
    mode: "latest",
    disciplineCode,
  });
};

export default useFacultyMembersGenderComparison;
