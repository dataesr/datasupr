import { useSearchParams } from "react-router-dom";
import { Breadcrumb, Link } from "@dataesr/dsfr-plus";

export default function CustomBreadcrumb({ pageKey }) {
  const [searchParams] = useSearchParams();
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');

  const pages = {
    "european-projects": {
      label: "Tableau de bord des projets européens - Horizon Europe",
      link: "/european-projects",
    },
    "general": {
      label: "General",
      link: "/european-projects/general",
    },
    "synthese": {
      label: "Synthèse Horizon Europe",
      link: "/european-projects/general/synthese",
    },
    "positionnement": {
      label: "Positionnement",
      link: "/european-projects/general/positionnement",
    },
    "collaboration": {
      label: "Collaboration",
      link: "/european-projects/general/collaboration",
    },
    "evolution": {
      label: "Evolution",
      link: "/european-projects/general/evolution",
    },
    "appel-a-projets": {
      label: "Appel à projets",
      link: "/european-projects/general/appel-a-projets",
    },
    "beneficiaires": {
      label: "Bénéficiaires",
      link: "/european-projects/general/beneficiaires",
    },
    "erc": {
      label: "ERC",
      link: "/european-projects/erc",
    },
    "msca": {
      label: "MSCA",
      link: "/european-projects/msca",
    },
    "projets-collaboratifs": {
      label: "Projets collaboratifs",
      link: "/european-projects/projets-collaboratifs",
    }
  };

  const currentPage = pages[pageKey];
  const parents = currentPage.link.split('/').slice(1, -1);

  return (
    <Breadcrumb className="fr-m-0 fr-mt-1w">
      <Link href="/">Accueil</Link>
      {
        parents.map((parent, index) => {
          return <Link key={index} href={`${pages[parent].link}?${params}`}>{pages[parent].label}</Link>
        })
      }
      <Link>
        <strong>{currentPage.label}</strong>
      </Link>
    </Breadcrumb>
  );
}