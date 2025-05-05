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
    "": {
      label: "General",
      link: "/european-projects/",
    },
    synthese: {
      label: "En un coup d'oeil",
      link: "/european-projects/synthese",
    },
    positionnement: {
      label: "Positionnement",
      link: "/european-projects/positionnement",
    },
    collaborations: {
      label: "Collaborations",
      link: "/european-projects/collaborations",
    },
    evolution: {
      label: "Evolution",
      link: "/european-projects/evolution",
    },
    "objectifs-types-projets": {
      label: "Objectifs & types de projets",
      link: "/european-projects/objectifs-types-projets",
    },
    beneficiaires: {
      label: "Bénéficiaires",
      link: "/european-projects/beneficiaires",
    },
    "programme-mires": {
      label: "Programme MIRES",
      link: "/european-projects/programme-mires",
    },
    "appel-a-projets": {
      label: "Appel à projets",
      link: "/european-projects/appel-a-projets",
    },
    "donnees-reference": {
      label: "Données de référence",
      link: "/european-projects/donnees-reference",
    },
    informations: {
      label: "Informations",
      link: "/european-projects/informations",
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
