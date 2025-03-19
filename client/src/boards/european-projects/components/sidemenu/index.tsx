import { SideMenu, Link } from "@dataesr/dsfr-plus";
import { useLocation, useSearchParams } from "react-router-dom";

import i18n from "./i18n.json";
import "./styles.scss";

export default function CustomSideMenu() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const filtersParams = searchParams.toString();
  if (!pathname) return null;
  const is = (str: string): boolean => pathname?.startsWith(str);

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <nav>
      <SideMenu title="" sticky fullHeight className="padded-sidemenu">
        <Link
          current={is("/european-projects/synthese")}
          href={`/european-projects/synthese?${filtersParams}`}
        >
          {getI18nLabel("synthesis")}
        </Link>
        <Link
          current={is("/european-projects/positionnement")}
          href={`/european-projects/positionnement?${filtersParams}`}
        >
          {getI18nLabel("positioning")}
        </Link>
        <Link
          current={is("/european-projects/collaborations")}
          href={`/european-projects/collaborations?${filtersParams}`}
        >
          {getI18nLabel("collaborations")}
        </Link>
        {/* 
        <Link
          current={is("/european-projects/objectifs-types-projets")}
          href={`/european-projects/objectifs-types-projets?${filtersParams}`}
        >
          Objectifs & types de projets
        </Link> */}
        <Link
          current={is("/european-projects/beneficiaires")}
          href={`/european-projects/beneficiaires?${filtersParams}`}
        >
          {getI18nLabel("beneficiaries")}
        </Link>
        <Link
          current={is("/european-projects/beneficiaires-types")}
          href={`/european-projects/beneficiaires-types?${filtersParams}`}
        >
          {getI18nLabel("beneficiaries-types")}
        </Link>
        <Link
          current={is("/european-projects/evolution")}
          href={`/european-projects/evolution?${filtersParams}`}
        >
          Evolution
        </Link>

        {/* <Link
          current={is("/european-projects/beneficiaires")}
          href={`/european-projects/beneficiaires?${filtersParams}`}
        >
          Catégories de bénéficiaires
        </Link>
        <Link
          current={is("/european-projects/programme-mires")}
          href={`/european-projects/programme-mires?${filtersParams}`}
        >
          Programme MIRES
        </Link>
        <Link
          current={is("/european-projects/appel-a-projets")}
          href={`/european-projects/appel-a-projets?${filtersParams}`}
          style={{ borderBottom: "1px solid #aaa" }}
        >
          Liste des appels à projets clôturés
        </Link>
        <Link
          current={is("/european-projects/msca")}
          href={`/european-projects/msca?${filtersParams}`}
        >
          MSCA
        </Link>
        <Link
          current={is("/european-projects/erc")}
          href={`/european-projects/erc?${filtersParams}`}
          style={{ borderBottom: "1px solid #aaa" }}
        >
          ERC
        </Link>
        <Link
          current={is("/european-projects/donnees-reference")}
          href={`/european-projects/donnees-reference?${filtersParams}`}
        >
          Données de référence
        </Link>
        <Link
          current={is("/european-projects/informations")}
          href={`/european-projects/informations?${filtersParams}`}
        >
          Informations complémentaires
        </Link> */}
      </SideMenu>
    </nav>
  );
}
