import { SideMenu, Link } from "@dataesr/dsfr-plus";
import { useLocation, useSearchParams } from "react-router-dom";

import "./styles.scss";

export default function CustomSideMenu() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const filtersParams = searchParams.toString();
  if (!pathname) return null;
  const is = (str: string): boolean => pathname?.startsWith(str);

  return (
    <nav>
      <SideMenu title="" sticky fullHeight className="padded-sidemenu">
        <Link
          current={is("/personnel-enseignants/synthese")}
          href={`/personnel-enseignants/synthese?${filtersParams}`}
        >
          En un coup d'oeil
        </Link>
        <Link
          current={is("/personnel-enseignants/disciplines")}
          href={`/personnel-enseignants/disciplines?${filtersParams}`}
        >
          Disciplines
        </Link>
        <Link
          current={is("/personnel-enseignants/typologie")}
          href={`/personnel-enseignants/typologie?${filtersParams}`}
        >
          Typologie
        </Link>
        <Link
          current={is("/personnel-enseignants/evolution")}
          href={`/personnel-enseignants/evolution?${filtersParams}`}
        >
          Evolution
        </Link>
      </SideMenu>
    </nav>
  );
}
