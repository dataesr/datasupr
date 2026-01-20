import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export interface FAQTheme {
  theme: string;
  ordre: number;
  questions: {
    question: string;
    reponse: string;
    ordre: number;
  }[];
}

export const useFinanceFAQ = (language?: string, enabled = true) => {
  return useQuery({
    queryKey: ["finance", "faq", language ?? "fr"],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (language) sp.append("language", language);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/faq${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la FAQ");
      }
      return response.json() as Promise<FAQTheme[]>;
    },
    enabled,
    staleTime: 30 * 60 * 1000,
  });
};
