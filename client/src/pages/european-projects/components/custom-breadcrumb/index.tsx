import { useSearchParams } from "react-router-dom";
import { Breadcrumb, Link } from "@dataesr/dsfr-plus";

export default function CustomBreadcrumb({ pageKey }) {
  const [searchParams] = useSearchParams();
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  console.log('params', params);

  const pages = {
    "european-projects": {
      label: "Tableau de bord des projets européens - Horizon Europe",
      link: "/european-projects",
    },
    "analyse": {
      label: "Analyse",
      link: "/european-projects/analyse",
    },
    "synthese": {
      label: "Synthèse",
      link: "/european-projects/analyse/synthese",
    },
    "positionnement": {
      label: "Positionnement",
      link: "/european-projects/analyse/positionnement",
    },
    "collaboration": {
      label: "Collaboration",
      link: "/european-projects/analyse/collaboration",
    },
    "evolution": {
      label: "Evolution",
      link: "/european-projects/analyse/evolution",
    },
    "appel-a-projets": {
      label: "Appel à projets",
      link: "/european-projects/analyse/appel-a-projets",
    },
    "beneficiaires": {
      label: "Bénéficiaires",
      link: "/european-projects/analyse/beneficiaires",
    },
    "erc": {
      label: "ERC",
      link: "/european-projects/analyse/erc",
    },
    "msca": {
      label: "MSCA",
      link: "/european-projects/analyse/msca",
    },
    "liste-des-appels-a-projets": {
      label: "Liste des appels à projets",
      link: "/european-projects/liste-des-appels-a-projets",
    },
    "chiffres-cles-tableau": {
      label: "Chiffres-clés tableau",
      link: "/european-projects/chiffres-cles-tableau",
    },
    "objectifs": {
      label: "Objectifs",
      link: "/european-projects/objectifs",
    },
    "collaborations-chiffrees": {
      label: "Collaborations chiffrées",
      link: "/european-projects/collaborations-chiffrees",
    },
    "pays": {
      label: "Pays",
      link: "/european-projects/pays",
    },
    "pays-evolution": {
      label: "Pays évolution",
      link: "/european-projects/pays-evolution",
    },
    "typologie-des-participants": {
      label: "Typologie des participants",
      link: "/european-projects/typologie-des-participants",
    },
    "participants-francais": {
      label: "Participants français",
      link: "/european-projects/participants-francais",
    },
    "participants-tous-pays": {
      label: "Participants tous pays",
      link: "/european-projects/participants-tous-pays",
    },
    "participants-hors-pays": {
      label: "Participants hors pays",
      link: "/european-projects/participants-hors-pays",
    },
  };

  const currentPage = pages[pageKey];
  const parents = currentPage.link.split('/').slice(1, -1);
  console.log('parents', parents);

  return (
    <Breadcrumb>
      <Link href="/">Accueil</Link>
      {
        parents.map((parent, index) => {
          return <Link key={index} href={pages[parent].link}>{pages[parent].label}</Link>
        }
        )}
      <Link>
        <strong>{currentPage.label}</strong>
      </Link>
    </Breadcrumb>
  );
}