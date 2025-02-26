import { useSearchParams } from "react-router-dom";
import { Breadcrumb, Link } from "@dataesr/dsfr-plus";

export default function CustomBreadcrumb({ pageKey }) {
  const [searchParams] = useSearchParams();
  const params = [...searchParams]
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const pages = {
    "european-projects": {
      label: "Tableau de bord des projets européens - Horizon Europe",
      link: "/european-projects",
    },
    general: {
      label: "General",
      link: "/european-projects/general",
    },
    synthese: {
      label: "Synthèse Horizon Europe",
      link: "/european-projects/general/synthese",
    },
    positionnement: {
      label: "Positionnement",
      link: "/european-projects/general/positionnement",
    },
    evolution: {
      label: "Evolution",
      link: "/european-projects/general/evolution",
    },
    "objectifs-types-projets": {
      label: "Objectifs & types de projets",
      link: "/european-projects/general/objectifs-types-projets",
    },
    beneficiaires: {
      label: "Bénéficiaires",
      link: "/european-projects/general/beneficiaires",
    },
    "programme-mires": {
      label: "Programme MIRES",
      link: "/european-projects/general/programme-mires",
    },
    "appel-a-projets": {
      label: "Appel à projets",
      link: "/european-projects/general/appel-a-projets",
    },
    "donnees-reference": {
      label: "Données de référence",
      link: "/european-projects/general/donnees-reference",
    },
    informations: {
      label: "Informations",
      link: "/european-projects/general/informations",
    },
    "horizon-europe": {
      label: "HE hors ERC & MSCA",
      link: "/european-projects/horizon-europe",
    },
    msca: {
      label: "MSCA",
      link: "/european-projects/msca",
    },
    erc: {
      label: "ERC",
      link: "/european-projects/erc",
    },
  };

  const currentPage = pages[pageKey];
  const parents = currentPage.link.split("/").slice(1, -1);

  return (
    <Breadcrumb className="fr-m-0 fr-mt-1w">
      <Link href="/">Accueil</Link>
      {parents.map((parent, index) => {
        return (
          <Link key={index} href={`${pages[parent].link}?${params}`}>
            {pages[parent].label}
          </Link>
        );
      })}
      <Link>
        <strong>{currentPage.label}</strong>
      </Link>
    </Breadcrumb>
  );
}
